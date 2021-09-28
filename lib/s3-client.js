const { Endpoint, S3 } = require('aws-sdk')
const { PassThrough } = require('stream')

const S3_CLIENTS_PER_STAGE = {
  local: new S3({
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
    endpoint: new Endpoint('http://localhost:4569')
  }),
  default: new S3({ apiVersion: '2006-03-01' })
}

const s3Client = () => {
  let stage = process.env.SHO_AWS_STAGE
  /* istanbul ignore if */
  if (!stage && process.env.IS_OFFLINE) {
    stage = 'local'
  }

  return S3_CLIENTS_PER_STAGE[stage] ? S3_CLIENTS_PER_STAGE[stage] : S3_CLIENTS_PER_STAGE.default
}

const that = module.exports = {
  copy: async (fromBucket, fromPath, toBucket, toPath, extraParams = {}) => await s3Client().copyObject({
    ...extraParams,
    Bucket: toBucket,
    CopySource: `/${fromBucket}/${fromPath}`,
    Key: `${toPath}`
  }).promise(),
  createReadStream: (params, callback) => s3Client().getObject(params, callback).createReadStream(),
  createWriteStream: (params, callback, options = {}) => {
    const pass = new PassThrough()
    const uploadParams = { ...params }
    uploadParams.Body = pass
    return {
      writeStream: pass,
      uploadPromise: s3Client().upload(uploadParams, options, callback).promise()
    }
  },
  /**
   * If file exists on the S3 bucket specified, return its metadata along with the file path and bucket name. Else
   * return false.
   */
  isFileExists: async (bucketName, filePath) => {
    const params = {
      Bucket: bucketName,
      Key: filePath
    }

    try {
      const metadata = await that.metadata(params.Bucket, params.Key)
      return { ...metadata, ...params, exists: true }
    } catch (e) {
      if (e.statusCode !== 404) {
        console.error(`Problem checking if file ${params.Key} exists on S3 bucket ${bucketName}`, e)
        return { exists: undefined }
      } else {
        return { exists: false }
      }
    }
  },
  /**
   * Retrieves the metadata associated with an object in S3.
   * Note: Caller is responsible for catching any errors! This simply awaits for the promise to resolve and returns that. Caller
   *       should check in a try/catch or similar if the promise rejected for example if the file did not exist.
   */
  metadata: async (bucketName, filePath) => await s3Client().headObject({
    Bucket: bucketName,
    Key: filePath
  }).promise(),
  put: (params, callback, options = {}) => s3Client().upload(params, options, callback).promise(),
  tag: async (bucketName, filePath, tagName) => {
    const tags = await that.tags(bucketName, filePath)
    if (!tags || !tags.TagSet) {
      return null
    }

    for (const tag of tags.TagSet) {
      if (tag.Key === tagName) {
        return tag.Value
      }
    }
    return null
  },
  tags: async (bucketName, filePath) => await s3Client().getObjectTagging({
    Bucket: bucketName,
    Key: filePath
  }).promise(),
  list: async (bucketName, filePath) => {
    console.debug(`Scanning bucket ${bucketName}, prefix: ${filePath}`)

    const allObjects = []
    for await (const s3Objects of s3ObjectsListGenerator(bucketName, filePath)) {
      console.debug(`${filePath}: added ${s3Objects.length} objects`)
      allObjects.push(...s3Objects)
    }

    console.debug(`Retrieved ${allObjects.length} s3 objects.`)
    return allObjects
  }
}

/**
 * Async generator-style function that allows the caller to use 'for await' construct to iterate over
 * results that may require multiple asynchronous calls to S3's listObjectsV2() api
 * */
async function * s3ObjectsListGenerator(bucketName, filePath) {
  const s3 = s3Client()
  const opts = {
    Bucket: bucketName,
    Prefix: filePath
  }

  do {
    const data = await s3.listObjectsV2(opts).promise()
    opts.ContinuationToken = data.NextContinuationToken
    yield data.Contents
  } while (opts.ContinuationToken)
}
