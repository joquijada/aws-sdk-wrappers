jest.mock('s3-zip')
jest.mock('node:stream/promises')

const { pipeline } = require('node:stream/promises')
const s3Zip = require('s3-zip')
const cloneDeep = require('lodash.clonedeep')
const passThrough = new (require('stream')).PassThrough()

const MOCK_METADATA = {
  AcceptRanges: 'bytes',
  LastModified: 'Tue, 27 Oct 2020 18:06:39 GMT',
  ContentLength: 154624,
  ETag: 'dbec9d6433b70c815e0ce7bb3d6261e7',
  ContentType: 'image/jpeg',
  Metadata: {}
}

const MOCK_S3_LIST_OBJECTS_V2_METADATA = {
  Contents: [
    {
      ETag: '"70ee1738b6b21e2c8a43f3a5ab0eee71"',
      Key: 'happyface.jpg',
      LastModified: '2021-04-11T18:26:00.494Z',
      Size: 11,
      StorageClass: 'STANDARD'
    },
    {
      ETag: '"becf17f89c30367a9a44495d62ed521a-1"',
      Key: 'test.jpg',
      LastModified: '2021-04-12T18:26:00.494Z',
      Size: 4192256,
      StorageClass: 'STANDARD'
    }
  ],
  IsTruncated: false,
  KeyCount: 2,
  MaxKeys: 2,
  Name: 'examplebucket',
  Prefix: ''
}

const MOCK_TAGS = {
  TagSet: [
    {
      Key: 'updated-by',
      Value: 'Image-Delivery-Pipeline'
    }
  ]
}

const mockCopyObjectPromise = Promise.resolve('Copy successful')
const mockCopyObject = jest.fn(() => ({
  promise: () => mockCopyObjectPromise
}))

const mockUploadPromise = Promise.resolve('Upload successful')
const mockUpload = jest.fn(() => ({
  promise: () => mockUploadPromise
}))

const mockReadable = new (jest.requireActual('stream')).Readable({
  read() {
  }
})

const mockGetObject = jest.fn(() => ({
  createReadStream: () => mockReadable
}))

const mockGetObjectTagging = jest.fn(() => ({
  promise: () => Promise.resolve(MOCK_TAGS)
}))

const mockHeadObject = jest.fn(() => ({
  promise: () => Promise.resolve(MOCK_METADATA)
}))

const mockListObjectsV2 = jest.fn(() => ({
  promise: () => Promise.resolve({})
}))

/**
 * Must provide mock factories for `aws-sdk` so that the mocks are already set up
 * before `s3-client.js` goes to use them, which is pretty early on actually (I.e. in the root of the module,
 * outside of the modules.export... statement).
 * Note: Jest jest.mock() hoisting feature is our friend here, see https://github.com/kentcdodds/how-jest-mocking-works
 */
// Must be a 'var' for hoisting to do its thing. else get 'ReferenceError: Cannot access 'mockS3' before initialization' error
var mockS3 = jest.fn(() => ({
  copyObject: mockCopyObject,
  upload: mockUpload,
  getObject: mockGetObject,
  headObject: mockHeadObject,
  getObjectTagging: mockGetObjectTagging,
  listObjectsV2: mockListObjectsV2
}))

var mockEndpoint = jest.fn()
jest.mock('aws-sdk', () => ({
  S3: mockS3,
  Endpoint: mockEndpoint
}))

const s3Client = require('../../lib/s3-client') // Our test subject (SUT)
const testParams = { param1: 'val1' }
const testOptions = { opt1: 'optVal1' }
const mockCallback = jest.fn()

const testBucketName = 'testBucketName'
const testFilePath = 'testFilePath'
describe('S3Client', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('updates client', () => {
    s3Client.updateClient({})
  })

  it('builds new client', () => {
    const newClient = s3Client.buildNewClient({})
    expect(newClient).not.toBe(s3Client)
  })

  it('sets local properties', () => {
    const prevStage = process.env.SHO_AWS_STAGE
    process.env.SHO_AWS_STAGE = 'local'
    jest.isolateModules(() => {
      copyS3Client = require('../../lib/s3-client')
    })
    process.env.SHO_AWS_STAGE = prevStage
  })

  it('copies from one bucket to another', () => {
    const [fromBucket, fromPath, toBucket, toPath] = ['fromBucket', 'fromPath', 'toBucket', 'toPath']
    const expectedCopyObjectArg = {
      Bucket: toBucket,
      CopySource: `/${fromBucket}/${fromPath}`,
      Key: `${toPath}`
    }
    let res = s3Client.copy(fromBucket, fromPath, toBucket, toPath, testOptions)
    expect(res).toEqual(mockCopyObjectPromise)
    // Validate parameters were correctly passed to S3.upload()
    expect(mockCopyObject.mock.calls[0][0]).toEqual({ ...expectedCopyObjectArg, ...testOptions })

    // Test things when options argument is NOT provided; SUT should just default "extraParams" to "{}" in those cases
    res = s3Client.copy(fromBucket, fromPath, toBucket, toPath)
    expect(res).toEqual(mockCopyObjectPromise)
    expect(mockCopyObject.mock.calls[1][0]).toEqual(expectedCopyObjectArg)
  })

  it('creates a write stream when "createWriteStream() gets invoked', () => {
    let res = s3Client.createWriteStream(testParams, mockCallback, testOptions)
    expect(JSON.stringify(res)).toEqual(JSON.stringify({
      writeStream: passThrough,
      uploadPromise: mockUploadPromise
    }))
    // Validate parameters were correctly passed to S3.upload()
    expect(JSON.stringify(mockUpload.mock.calls[0][0])).toEqual(JSON.stringify({
      ...testParams,
      Body: passThrough
    }))
    expect(mockUpload.mock.calls[0][1]).toEqual(testOptions)
    expect(mockUpload.mock.calls[0][2]).toEqual(mockCallback)

    // Test things when options argument is not provided; SUT should justr default "options" to "{}" in those cases
    res = s3Client.createWriteStream(testParams, mockCallback)
    expect(JSON.stringify(res)).toEqual(JSON.stringify({
      writeStream: passThrough,
      uploadPromise: mockUploadPromise
    }))
    expect(JSON.stringify(mockUpload.mock.calls[1][0])).toEqual(JSON.stringify({
      ...testParams,
      Body: passThrough
    }))
    expect(mockUpload.mock.calls[1][1]).toEqual({})
    expect(mockUpload.mock.calls[1][2]).toEqual(mockCallback)
  })

  it('creates a read stream when "createReadStream()" method gets invoked', () => {
    const res = s3Client.createReadStream(testParams, mockCallback)
    expect(res).toEqual(mockReadable)
    // Validate parameters were correctly passed to S3.getObject()
    expect(mockGetObject.mock.calls[0][0]).toEqual(testParams)
    expect(mockGetObject.mock.calls[0][1]).toEqual(mockCallback)
  })

  it('uploads a file to S3', () => {
    let res = s3Client.put(testParams, mockCallback, testOptions)
    expect(res).toEqual(mockUploadPromise)
    // Validate parameters were correctly passed to S3.upload()
    expect(mockUpload.mock.calls[0][0]).toEqual(testParams)
    expect(mockUpload.mock.calls[0][1]).toEqual(testOptions)
    expect(mockUpload.mock.calls[0][2]).toEqual(mockCallback)

    // Test things when options argument is not provided; SUT should just default "options" to "{}" in those cases
    res = s3Client.put(testParams, mockCallback)
    expect(res).toEqual(mockUploadPromise)
    expect(mockUpload.mock.calls[1][0]).toEqual(testParams)
    expect(mockUpload.mock.calls[1][1]).toEqual({})
    expect(mockUpload.mock.calls[1][2]).toEqual(mockCallback)
  })

  it('Zips S3 objects and stores the Zip on S3', async () => {
    process.env.SHO_AWS_STAGE = 'local'
    const payload1 = cloneDeep(MOCK_S3_LIST_OBJECTS_V2_METADATA)
    const payload2 = cloneDeep(MOCK_S3_LIST_OBJECTS_V2_METADATA)
    // Change the file names around a bit
    payload2.Contents[0].Key = 'fileX.pdf'
    payload2.Contents[1].Key = 'fileZ.pdf'
    prepareS3ListObjectsV2Mock([payload1, payload2])

    const zipPipelinePromiseSuccess = 'THIS IS A TEST: Zip pipeline was successful'
    pipeline.mockResolvedValueOnce(zipPipelinePromiseSuccess)
    const s3ZipArchiveReturnValue = {
      foo: 'bar'
    }
    s3Zip.archive.mockReturnValueOnce(s3ZipArchiveReturnValue)
    const args = ['from-bucket', 'from-folder', ['obj1', 'obj2', 'obj3', 'obj4/']]
    await s3Client.zipObjectsToBucket(...args)
    expect(s3Zip.archive).toHaveBeenLastCalledWith({
      s3: s3Client,
      bucket: args[0],
      preserveFolderStructure: true
    }, args[1], [args[2][0], args[2][1], args[2][2],
      `obj4/${MOCK_S3_LIST_OBJECTS_V2_METADATA.Contents[0].Key}`, `obj4/${MOCK_S3_LIST_OBJECTS_V2_METADATA.Contents[1].Key}`,
      'obj4/fileX.pdf', 'obj4/fileZ.pdf'])
    expect(pipeline.mock.calls[0][0]).toEqual(s3ZipArchiveReturnValue)
    expect(JSON.stringify(pipeline.mock.calls[0][1])).toEqual(JSON.stringify(passThrough))
    expect(mockListObjectsV2).toHaveBeenNthCalledWith(1, {
      Bucket: 'from-bucket',
      Prefix: 'from-folder/obj4/'
    })
    expect(mockListObjectsV2).toHaveBeenNthCalledWith(2, {
      Bucket: 'from-bucket',
      Prefix: 'from-folder/obj4/'
    })
  })

  it('Zips S3 objects that are at the top level in the bucket', async () => {
    /*
     * Essentially this is the same test as above, only difference is that the files to Zip are located at the
     * root level inside the bucket
     */
    process.env.SHO_AWS_STAGE = 'local'
    const payload1 = cloneDeep(MOCK_S3_LIST_OBJECTS_V2_METADATA)
    const payload2 = cloneDeep(MOCK_S3_LIST_OBJECTS_V2_METADATA)
    // Change the file names around a bit
    payload2.Contents[0].Key = 'fileX.pdf'
    payload2.Contents[1].Key = 'fileZ.pdf'
    prepareS3ListObjectsV2Mock([payload1, payload2])

    const zipPipelinePromiseSuccess = 'THIS IS A TEST: Zip pipeline was successful'
    pipeline.mockResolvedValueOnce(zipPipelinePromiseSuccess)
    const s3ZipArchiveReturnValue = {
      foo: 'bar'
    }
    s3Zip.archive.mockReturnValueOnce(s3ZipArchiveReturnValue)
    // The 'from folder' is blank because the objects to Zip are at the top level
    const args = ['from-bucket', '', ['obj1', 'obj2', 'obj3', 'obj4/']]
    await s3Client.zipObjectsToBucket(...args)
    expect(s3Zip.archive).toHaveBeenLastCalledWith({
      s3: s3Client,
      bucket: args[0],
      preserveFolderStructure: true
    }, args[1], [args[2][0], args[2][1], args[2][2],
      `obj4/${MOCK_S3_LIST_OBJECTS_V2_METADATA.Contents[0].Key}`, `obj4/${MOCK_S3_LIST_OBJECTS_V2_METADATA.Contents[1].Key}`,
      'obj4/fileX.pdf', 'obj4/fileZ.pdf'])
    expect(pipeline.mock.calls[0][0]).toEqual(s3ZipArchiveReturnValue)
    expect(JSON.stringify(pipeline.mock.calls[0][1])).toEqual(JSON.stringify(passThrough))
    expect(mockListObjectsV2).toHaveBeenNthCalledWith(1, {
      Bucket: 'from-bucket',
      Prefix: 'obj4/'
    })
    expect(mockListObjectsV2).toHaveBeenNthCalledWith(2, {
      Bucket: 'from-bucket',
      Prefix: 'obj4/'
    })
  })

  it('throws error if Zip pipeline fails', async () => {
    const zipPipelinePromiseError = 'THIS IS A TEST: Zip pipeline FAILED'
    try {
      process.env.SHO_AWS_STAGE = 'local'
      pipeline.mockRejectedValueOnce(zipPipelinePromiseError)
      const s3ZipArchiveReturnValue = {
        foo: 'bar'
      }
      s3Zip.archive.mockReturnValueOnce(s3ZipArchiveReturnValue)
      const args = ['from-bucket', 'from-folder', ['obj1', 'obj2', 'obj3']]
      await s3Client.zipObjectsToBucket(...args)
      throw new Error('Should have thrown an error')
    } catch (e) {
      expect(e).toBe(zipPipelinePromiseError)
    }
  })

  it('throws error if Zip upload to S3 fails', async () => {
    const zipUploadToS3PromiseError = 'THIS IS A TEST: Zip upload to S3 FAILED'
    pipeline.mockResolvedValueOnce('THIS IS A TEST: Zip pipeline was successful')
    try {
      mockUpload.mockImplementationOnce(() => ({
        promise: () => Promise.reject(zipUploadToS3PromiseError)
      }))
      const s3ZipArchiveReturnValue = {
        foo: 'bar'
      }
      s3Zip.archive.mockReturnValueOnce(s3ZipArchiveReturnValue)
      const args = ['from-bucket', 'from-folder', ['obj1', 'obj2', 'obj3']]
      await s3Client.zipObjectsToBucket(...args)
      throw new Error('Should have thrown an error')
    } catch (e) {
      expect(e).toBe(zipUploadToS3PromiseError)
    }
  })

  it('throws error if folder expansion fails during Zip', async () => {
    const s3ListError = 'THIS IS A TEST: Problem listing S3 bucket folder'
    try {
      mockListObjectsV2.mockImplementationOnce(() => ({
        promise: () => Promise.reject(s3ListError)
      }))
      process.env.SHO_AWS_STAGE = 'local'
      const args = ['from-bucket', 'from-folder', ['obj1', 'obj2', 'obj3', 'obj4/']]
      await s3Client.zipObjectsToBucket(...args)
      throw new Error('Should have thrown an error')
    } catch (e) {
      expect(e).toBe(s3ListError)
    }
  })

  it('retrieves file tags', async () => {
    const res = await s3Client.tag(testBucketName, testFilePath, 'updated-by')
    expect(res).toEqual('Image-Delivery-Pipeline')
    expect(mockGetObjectTagging.mock.calls[0][0]).toEqual({
      Bucket: testBucketName,
      Key: testFilePath
    })
  })

  it('does not retrieve tag if object doesn\'t have any', async () => {
    const savedTagSet = MOCK_TAGS.TagSet
    delete MOCK_TAGS.TagSet
    const res = await s3Client.tag(testBucketName, testFilePath, 'updated-by')
    expect(res).toBeNull()
    // Validate parameters were correctly passed to S3.upload()
    expect(mockGetObjectTagging.mock.calls[0][0]).toEqual({
      Bucket: testBucketName,
      Key: testFilePath
    })
    MOCK_METADATA.TagSet = savedTagSet
  })

  it('does not retrieve tag if object tags do not have the tag request', async () => {
    const savedTagSet = MOCK_TAGS.TagSet
    MOCK_TAGS.TagSet = [
      {
        Key: 'foo',
        Value: 'bar'
      }
    ]
    const res = await s3Client.tag(testBucketName, testFilePath, 'updated-by')
    expect(res).toBeNull()
    // Validate parameters were correctly passed to S3.upload()
    expect(mockGetObjectTagging.mock.calls[0][0]).toEqual({
      Bucket: testBucketName,
      Key: testFilePath
    })
    MOCK_METADATA.TagSet = savedTagSet
  })

  describe('checks if a file exists on S3', () => {
    it('returns the file metadata if it exists', async () => {
      pipeline.mockImplementation(() => {})
      const res = await s3Client.isFileExists(testBucketName, testFilePath)
      expect(res).toEqual({
        ...MOCK_METADATA,
        Bucket: testBucketName,
        Key: testFilePath,
        exists: true
      })
      // Validate parameters were correctly passed to S3.headObject()
      expect(mockHeadObject.mock.calls[0][0]).toEqual({
        Bucket: testBucketName,
        Key: testFilePath
      })
    })
    it('returns false if it does not exist', async () => {
      mockHeadObject.mockImplementation(() => {
        const e = new Error()
        e.statusCode = 404
        throw e
      })
      const res = await s3Client.isFileExists(testBucketName, testFilePath)
      expect(res.exists).toBe(false)
    })
    it('returns undefined if there was an unexpected error', async () => {
      mockHeadObject.mockImplementation(() => {
        const e = new Error('THIS IS A TEST')
        throw e
      })
      const res = await s3Client.isFileExists(testBucketName, testFilePath)
      expect(res.exists).toBeUndefined()
    })
  })
  it("uses the sls offline S3 plugin client when stage is 'local'", async () => {
    process.env.SHO_AWS_STAGE = 'local'
    // TODO: Currently nothing gets validated here. We validate by virtue of code coverage that it
    //       executed the branch the selects the `local` S3 client. Will think of adding an explicit test here
    //       in the future.
    // TODO: Get rid of this
    await s3Client.tag(testBucketName, testFilePath, 'updated-by')
  })
  describe('when listing objects in S3 bucket', () => {
    it('returns S3 object metadata', async () => {
      mockListObjectsV2.mockImplementationOnce(() => ({
        promise: () => Promise.resolve(MOCK_S3_LIST_OBJECTS_V2_METADATA)
      }))
      const s3Objects = await s3Client.list('TEST_BUCKET', 'test/file/path')
      expect(s3Objects).toBeDefined()
      expect(s3Objects.length).toEqual(MOCK_S3_LIST_OBJECTS_V2_METADATA.Contents.length)

      // will sort MOCKed and resulting array elements by ETag so we can compare them using jest (one-liner)
      const sortByETag = (lhs, rhs) => {
        lhs.ETag.localeCompare(rhs.ETag)
      }
      expect(s3Objects.sort(sortByETag)).toEqual(MOCK_S3_LIST_OBJECTS_V2_METADATA.Contents.sort(sortByETag))
    })

    it('returns correct number of S3 objects when S3 client uses "NextContinuationToken" in response payload.', async () => {
      // When more than 1 listObjectsV2 call is needed to retrieve bucket keys, NextContinuationToken
      // is present and isTruncated is set to true
      // we'll deep clone the mocked listObjectV2 result fixture and modify to simulate that scenario
      const payload1 = cloneDeep(MOCK_S3_LIST_OBJECTS_V2_METADATA)
      const payload2 = cloneDeep(MOCK_S3_LIST_OBJECTS_V2_METADATA)

      prepareS3ListObjectsV2Mock([payload1, payload2])

      const s3Objects = await s3Client.list('TEST_BUCKET', 'test/file/path')
      expect(s3Objects).toBeDefined()
      expect(s3Objects.length).toEqual(payload1.Contents.length + payload2.Contents.length)
    })
  })
  describe('when syncing files', () => {
    beforeEach(() => {
      // For each test here need the real 'pipeline()' function to build the streams that handle the sync
      pipeline.mockImplementation(jest.requireActual('node:stream/promises').pipeline)
    })

    it('uses same destination folder as source when destination folder not specified', async () => {
      const [fromBucket, fromPath, toBucket] = ['fromBucket', 'fromPath', 'toBucket']
      const payload1 = cloneDeep(MOCK_S3_LIST_OBJECTS_V2_METADATA)
      const payload2 = cloneDeep(MOCK_S3_LIST_OBJECTS_V2_METADATA)
      // Change the file names around a bit
      payload2.Contents[0].Key = 'fileX.pdf'
      payload2.Contents[1].Key = 'fileZ.pdf'
      prepareS3ListObjectsV2Mock([payload1, payload2])
      await s3Client.sync({
        fromBucket,
        fromPath,
        toBucket
      })

      expect(mockUpload.mock.calls[0][0]).toEqual({
        Bucket: toBucket,
        Key: `${fromPath}/happyface.jpg`
      })
      expect(mockUpload.mock.calls[1][0]).toEqual({
        Bucket: toBucket,
        Key: `${fromPath}/test.jpg`
      })
      expect(mockUpload.mock.calls[2][0]).toEqual({
        Bucket: toBucket,
        Key: `${fromPath}/fileX.pdf`
      })
      expect(mockUpload.mock.calls[3][0]).toEqual({
        Bucket: toBucket,
        Key: `${fromPath}/fileZ.pdf`
      })
    })

    it('uses the destination folder specified', async () => {
      const [fromBucket, fromPath, toBucket, toPath] = ['fromBucket', 'fromPath', 'toBucket', 'toPath']
      const payload1 = cloneDeep(MOCK_S3_LIST_OBJECTS_V2_METADATA)
      const payload2 = cloneDeep(MOCK_S3_LIST_OBJECTS_V2_METADATA)
      // Change the file names around a bit
      payload2.Contents[0].Key = 'fileX.pdf'
      payload2.Contents[1].Key = 'fileZ.pdf'
      prepareS3ListObjectsV2Mock([payload1, payload2])
      await s3Client.sync({
        fromBucket,
        fromPath,
        toBucket,
        toPath
      })

      expect(mockUpload.mock.calls[0][0]).toEqual({
        Bucket: toBucket,
        Key: `${toPath}/happyface.jpg`
      })
      expect(mockUpload.mock.calls[1][0]).toEqual({
        Bucket: toBucket,
        Key: `${toPath}/test.jpg`
      })
      expect(mockUpload.mock.calls[2][0]).toEqual({
        Bucket: toBucket,
        Key: `${toPath}/fileX.pdf`
      })
      expect(mockUpload.mock.calls[3][0]).toEqual({
        Bucket: toBucket,
        Key: `${toPath}/fileZ.pdf`
      })
    })

    it('reacts to watermark reached by pausing source stream and resuming reading once buffer falls below watermark again', async () => {
      const realReadable = jest.requireActual('stream').Readable
      const pushSpy = jest.spyOn(realReadable.prototype, 'push').mockImplementationOnce((item) => {
        // Simulate watermark full. This causes an extraneous call to Readable.push, which we account for in the
        // expectation farther below
        realReadable.prototype.push.call(global.Readable, item)
        console.log(`JMQ: ITEM IS ${JSON.stringify(item)}`)
        return false
      })
      const [fromBucket, fromPath, toBucket] = ['fromBucket', 'fromPath', 'toBucket']
      const payload1 = cloneDeep(MOCK_S3_LIST_OBJECTS_V2_METADATA)
      const payload2 = cloneDeep(MOCK_S3_LIST_OBJECTS_V2_METADATA)
      // Change the file names around a bit
      payload2.Contents[0].Key = 'fileX.pdf'
      payload2.Contents[1].Key = 'fileZ.pdf'
      prepareS3ListObjectsV2Mock([payload1, payload2])
      await s3Client.sync({
        fromBucket,
        fromPath,
        toBucket
      })
      // 4 calls to push data, 1 call to push NULL (end), and the extraneous call noted above
      // because of how we've set up the mock implementation to simulate full Readable watermark
      // reached (I.e. Readable.push(item) returns FALSE)
      expect(pushSpy).toHaveBeenCalledTimes(6)
    })

    it('does not fail-fast if problem encountered processing an item', async () => {
      process.env.SHO_AWS_STAGE = 'local'
      mockUpload.mockImplementationOnce(() => ({
        promise: () => Promise.reject(new Error('THIS IS A TEST: problem writing to S3 during sync'))
      }))

      const [fromBucket, fromPath, toBucket] = ['fromBucket', 'fromPath', 'toBucket']
      const payload1 = cloneDeep(MOCK_S3_LIST_OBJECTS_V2_METADATA)
      const payload2 = cloneDeep(MOCK_S3_LIST_OBJECTS_V2_METADATA)
      // Change the file names around a bit
      payload2.Contents[0].Key = 'fileX.pdf'
      payload2.Contents[1].Key = 'fileZ.pdf'
      prepareS3ListObjectsV2Mock([payload1, payload2])
      await s3Client.sync({
        fromBucket,
        fromPath,
        toBucket
      })
      expect(global.writableCallback).toHaveBeenCalledTimes(4)
    })
  })
})

function prepareS3ListObjectsV2Mock(payloads) {
  const last = payloads.length - 1
  payloads.forEach((payload, idx) => {
    // All but the last one will contain 'NextContinuationToken'
    if (idx === last) {
      payload = {
        ...payload,
        ...{
          IsTruncated: false,
          NextContinuationToken: undefined
        }
      }
    } else {
      payload = {
        ...payload,
        ...{
          IsTruncated: true,
          NextContinuationToken: 'XXX-Token-XXX'
        }
      }
    }
    mockListObjectsV2.mockImplementationOnce((params) => ({
      promise: () => {
        for (const c of payload.Contents) {
          if (params.Prefix.lastIndexOf('/') !== params.Prefix.length - 1) {
            params.Prefix = `${params.Prefix + '/'}`
          }
          c.Key = `${params.Prefix}${c.Key}`
        }
        return Promise.resolve(payload)
      }
    }))
  })
}
