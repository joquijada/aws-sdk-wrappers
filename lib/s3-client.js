const {
  Endpoint,
  S3
} = require('aws-sdk')
const {
  PassThrough,
  Readable,
  Writable
} = require('stream')
const { pipeline } = require('node:stream/promises')
const s3Zip = require('s3-zip')
const API_VERSION = '2006-03-01'
const s3Properties = {
  apiVersion: API_VERSION
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

const s3ClientWrapper = {
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
      const metadata = await s3ClientWrapper.metadata(params.Bucket, params.Key)
      return {
        ...metadata,
        ...params,
        exists: true
      }
    } catch (e) {
      if (e.statusCode !== 404) {
        console.error(`Problem checking if file ${params.Key} exists on S3 bucket ${bucketName}`, e)
        return { exists: undefined }
      } else {
        return { exists: false }
      }
    }
  },
  list: async (bucketName, folder) => {
    const allObjects = []
    for await (const s3Objects of s3ObjectsListGenerator({ bucketName, folder })) {
      const contents = s3Objects.contents
      console.debug(`${folder}: added ${contents.length} objects`)
      allObjects.push(...contents)
    }

    console.debug(`Retrieved ${allObjects.length} s3 objects`)
    return allObjects
  },
  listAsStream: ({ bucketName, folder, startAfter = undefined }) => {
    let buffer = []
    let continuationToken = 'continuationToken'
    return new Readable({
      objectMode: true,
      async read() {
        // Give priority to items that couldn't make it into the stream's internal buffer
        // last time _read() was call.
        const items = buffer
        buffer = []
        let res
        /*
         * If continuationToken came back as undefined in last call to this.read(), it signals that S3 has no
         * more objects. But our buffer might not be fully drained yet, if for example the Readable stream's
         * buffer became full, so we have to keep going until we process all items in our buffer, all the whilet skipping
         * calls to the S3 list API (to avoid looping infinitely over the S3 objects).
         */
        if (continuationToken) {
          res = await s3ObjectsListGenerator({
            bucketName,
            folder,
            continuationToken,
            startAfter
          }).next()
        }
        startAfter = undefined
        continuationToken = res && res.value.continuationToken // save for next call to this._read()
        res && res.value && res.value.contents && items.push(...res.value.contents)

        if (items.length < 1) {
          // S3 has no more items, and no items left over in buffer either, end this stream
          this.push(null)
        } else {
          // Push each item onto stream's internal buffer
          let isFull = false
          for (const item of items) {
            if (!isFull) {
              isFull = !this.push(item)
            } else {
              // Internal buffer full? Save for next call to _read()
              console.debug(`Readable buffer full, process ${JSON.stringify(item)} once level drops below water mark.`)
              buffer.push(item)
            }
          }
        }
      }
    })
  },
  /**
   * Retrieves the metadata associated with an object in S3.
   * Note: Caller is responsible for catching any errors! This simply awaits for the promise to resolve and returns s3ClientWrapper. Caller
   *       should check in a try/catch or similar if the promise rejected for example if the file did not exist.
   */
  metadata: async (bucketName, filePath) => await s3Client.headObject({
    Bucket: bucketName,
    Key: filePath
  }).promise(),
  put: (params, callback, options = {}) => s3Client.upload(params, options, callback).promise(),
  sync: ({
    fromS3Client = s3ClientWrapper,
    fromBucket,
    fromPath,
    toS3Client = s3ClientWrapper,
    toBucket,
    toPath = undefined,
    startAfter = undefined
  }) => {
    return pipeline(
      fromS3Client.listAsStream({ bucketName: fromBucket, folder: fromPath, startAfter }),
      new Writable({
        objectMode: true,
        async write(chunk, encoding, callback) {
          try {
            const pass = new PassThrough()
            s3ClientWrapper.createReadStream({
              Bucket: fromBucket,
              Key: chunk.Key
            }).pipe(pass)
            await toS3Client.put({
              Bucket: toBucket,
              Key: toPath ? chunk.Key.replace(fromPath, toPath) : chunk.Key,
              Body: pass
            })
            console.debug(`Successfully synce'ed ${JSON.stringify(chunk)}`)
          } catch (e) {
            // No fail-fast, log error and allow sync to continue
            console.error(`Problem syncing ${JSON.stringify(chunk)}`, e)
          }
          callback()
        }
      })
    )
  },
  tag: async (bucketName, filePath, tagName) => {
    const tags = await s3ClientWrapper.tags(bucketName, filePath)
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
    return s3Zip.archive({
      s3: s3Client,
      bucket: bucketName,
      preserveFolderStructure: true
    }, folder, objects)
  },
  /**
   * The list of 'objects' to Zip can contain folders too. Simply append those with '/' and this method
   * will regard them as folders. Then the files underneath those folders will ger added to the list of the
   * other non-folder 'objects', prefixed with the parent folder.<br/>
   * For example if one of the objects is 'folder123/', and it contains 'file1.xxx' and 'file2.xxx',
   * 'folder123/' then becomes 'folder123/file1.xxx', 'folder123/file2.xxx' in the 'objects' list.<br/>
   * One caveat though, this works for shallow folders,
   * meaning that if there are folders underneath, this method currently will not recurse into those, only the
   * first folders are replaced with their contents before building the final Zip. Future versions
   * will handle more than one level of nested folders.
   */
  zipObjectsToBucket: (fromBucketName, fromFolder, objects, toBucketName, toPath) => {
    const {
      writeStream,
      uploadPromise
    } = s3ClientWrapper.createWriteStream({
      Bucket: toBucketName,
      Key: toPath
    })

    /*
     * We do it this way to ensure s3ClientWrapper both the pipeline AND the upload Zip to S3 promise are
     * waited on before declaring success. Just returning the pipeline promise alone did not work. Need to wait
     * on the upload promise as well. This follows AWS S3 SDK semantics.
     */
    return new Promise((resolve, reject) => {
      expandFolders(fromBucketName, fromFolder, objects).then(finalObjectList => {
        pipeline(s3ClientWrapper.zipObjects(fromBucketName, fromFolder, finalObjectList), writeStream).then(() => {
          uploadPromise.then(success => resolve(success)).catch(uploadError => reject(uploadError))
        }).catch(pipelineError => reject(pipelineError))
      }).catch(expandFolderError => reject(expandFolderError))
    })
  },
  /**
   * Updates the <strong>existing</strong> wrapped S3 client object that was exported with the passed
   * in options.
   */
  updateClient: (opts) => {
    s3Client = new S3({
      ...opts,
      apiVersion: API_VERSION
    })
    Object.assign(s3Client, s3ClientWrapper)
  },
  /**
   * Builds a brand new wrapped S3 client object using the passed in options
   */
  buildNewClient: (opts) => {
    const client = new S3({
      ...opts,
      apiVersion: API_VERSION
    })
    Object.assign(client, s3ClientWrapper)
    return client
  }
}

Object.assign(s3Client, s3ClientWrapper)
module.exports = s3Client

/**
 * Async generator-style function that allows the caller to use 'for await' construct to iterate over
 * results that may require multiple asynchronous calls to S3's listObjectsV2() api
 * */
async function * s3ObjectsListGenerator({ bucketName, folder, continuationToken = undefined, startAfter = undefined }) {
  const s3 = s3Client
  const opts = {
    Bucket: bucketName,
    Prefix: folder,
    ContinuationToken: continuationToken,
    StartAfter: startAfter
  }

  let moreResults
  do {
    const data = await s3.listObjectsV2(opts).promise()
    moreResults = opts.ContinuationToken = data.NextContinuationToken
    yield {
      contents: data.Contents,
      continuationToken: opts.ContinuationToken
    }
  } while (moreResults)
}

/**
 * Replaces folders (anything that ends in '/') with the actual s3 objects
 * contained in it. The returned paths are relative to the 'folder'
 * passed in.
 */
async function expandFolders(bucket, folder, objects) {
  const retObjects = []
  for (const obj of objects) {
    if (!obj.endsWith('/')) {
      retObjects.push(obj)
      continue
    }
    // Now add each file found in folder to the running list of files
    let fullFolderPath = obj
    if (folder) {
      fullFolderPath = `${folder}/${obj}`
    }
    for (const item of await s3ClientWrapper.list(bucket, fullFolderPath)) {
      // Make the paths relative to 'folder'. AWS S3 gives back paths which are absolute
      retObjects.push(folder ? item.Key.replace(`${folder}/`, '') : item.Key)
    }
  }
  return retObjects
}
