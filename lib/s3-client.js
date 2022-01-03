const { Endpoint, S3 } = require('aws-sdk')
const { PassThrough } = require('stream')
const util = require('util')
const pipeline = util.promisify(require('stream').pipeline)
const s3Zip = require('s3-zip')

const s3Properties = {
  apiVersion: '2006-03-01'
}

/*
 * If 'local' stage is used in this Node.js process, it is assumed
 * that we're in local development mode running SLS S3 offline plugin
 * in another Node.js process.
 */
const stage = process.env.SHO_AWS_STAGE
if (stage === 'local' || (!stage && process.env.IS_OFFLINE)) {
  s3Properties.accessKeyId = 'S3RVER'
  s3Properties.secretAccessKey = 'S3RVER'
  s3Properties.endpoint = new Endpoint('http://localhost:4569')
}

let s3Client = new S3(s3Properties)

const that = module.exports = {
  ...s3Client,
  copy: async (fromBucket, fromPath, toBucket, toPath, extraParams = {}) => await s3Client.copyObject({
    ...extraParams,
    Bucket: toBucket,
    CopySource: `/${fromBucket}/${fromPath}`,
    Key: `${toPath}`
  }).promise(),
  createReadStream: (params, callback) => s3Client.getObject(params, callback).createReadStream(),
  createWriteStream: (params, callback, options = {}) => {
    const pass = new PassThrough()
    const uploadParams = { ...params }
    uploadParams.Body = pass
    return {
      writeStream: pass,
      uploadPromise: s3Client.upload(uploadParams, options, callback).promise()
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
  list: async (bucketName, filePath) => {
    console.debug(`Scanning bucket ${bucketName}, prefix: ${filePath}`)

    const allObjects = []
    for await (const s3Objects of s3ObjectsListGenerator(bucketName, filePath)) {
      console.debug(`${filePath}: added ${s3Objects.length} objects`)
      allObjects.push(...s3Objects)
    }

    console.debug(`Retrieved ${allObjects.length} s3 objects.`)
    return allObjects
  },
  /**
   * Retrieves the metadata associated with an object in S3.
   * Note: Caller is responsible for catching any errors! This simply awaits for the promise to resolve and returns that. Caller
   *       should check in a try/catch or similar if the promise rejected for example if the file did not exist.
   */
  metadata: async (bucketName, filePath) => await s3Client.headObject({
    Bucket: bucketName,
    Key: filePath
  }).promise(),
  put: (params, callback, options = {}) => s3Client.upload(params, options, callback).promise(),
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
  tags: async (bucketName, filePath) => await s3Client.getObjectTagging({
    Bucket: bucketName,
    Key: filePath
  }).promise(),
  zipObjects: (bucketName, folder, objects) => {
    return s3Zip.archive({ s3: s3Client, bucket: bucketName }, folder, objects)
  },
  zipObjectsToBucket: (fromBucketName, fromFolder, objects, toBucketName, toPath) => {
    const { writeStream, uploadPromise } = that.createWriteStream({
      Bucket: toBucketName,
      Key: toPath
    })

    /*
     * We do it this way to ensure that both the pipeline AND the upload Zip to S3 promise are
     * waited on before declaring success. Just returning the pipeline promise alone did not work. Need to wait
     * on the upload promise as well. This follows AWS S3 SDK semantics.
     */
    return new Promise((resolve, reject) => {
      pipeline(that.zipObjects(fromBucketName, fromFolder, objects), writeStream).then(() => {
        uploadPromise.then(success => resolve(success)).catch(error => reject(error))
      }).catch(error => reject(error))
    })
  },
  updateClient: (opts) => {
    s3Client = new S3({
      ...opts,
      apiVersion: '2006-03-01'
    })
    Object.assign(this, s3Client)
  }
}

/**
 * Async generator-style function that allows the caller to use 'for await' construct to iterate over
 * results that may require multiple asynchronous calls to S3's listObjectsV2() api
 * */
async function* s3ObjectsListGenerator (bucketName, filePath) {
  const s3 = s3Client
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
