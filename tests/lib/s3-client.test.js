const cloneDeep = require('lodash.clonedeep')

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
  // NextContinuationToken: "1w41l63U0xa8q7smH50vCxyTQqdxo69O3EmK28Bi5PcROI4wI/EyIJg==",
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
}
))

const mockUploadPromise = Promise.resolve('Upload successful')
const mockUpload = jest.fn(() => ({
  promise: () => mockUploadPromise
}
))

const mockReadable = new (jest.requireActual('stream')).Readable({
  read() {
  }
})
const mockGetObject = jest.fn(() => ({
  createReadStream: () => mockReadable
}
))

const mockGetObjectTagging = jest.fn(() => ({
  promise: () => Promise.resolve(MOCK_TAGS)
}
))

const mockHeadObject = jest.fn(() => ({
  promise: () => Promise.resolve(MOCK_METADATA)
}
))

const mockEndpoint = jest.fn()

const mockListObjectsV2 = jest.fn(() => ({
  promise: () => Promise.resolve(MOCK_S3_LIST_OBJECTS_V2_METADATA)
}))

/**
 * Must provide mock factories for `aws-sdk` and `stream` so that these mocks are already set up
 * before `s3-client.js` goes to use them, which is pretty early on actually (I.e. in the root of the module,
 * outside of the modules.export... statement).
 * Note: Jest jest.mock() hoisting feature is our friend here, see https://github.com/kentcdodds/how-jest-mocking-works
 */
jest.mock('aws-sdk', () => ({
  S3: jest.fn(() => ({
    copyObject: mockCopyObject,
    upload: mockUpload,
    getObject: mockGetObject,
    headObject: mockHeadObject,
    getObjectTagging: mockGetObjectTagging,
    listObjectsV2: mockListObjectsV2
  })),
  Endpoint: mockEndpoint
})
)

/*
 * Need actual `stream` module to create a PassThrough stream (which s3-client require()'s) to pass around and validate that
 * the SUT (Subject Under Test), s3-client used it. Jest does not provide a way to mock stream return objects like it does for promises; there might
 * by 3rd party modules out there to accomplish this, but why bloat the app more than necessary for something so simple, so just create
 * our own here. Again jest.mock() hoisting is our friend here in that Jest will invoke jest.mock() before any require()'s
 */
const ActualPassThrough = jest.requireActual('stream').PassThrough
const mockPass = new ActualPassThrough()
jest.mock('stream', () => ({
  PassThrough: jest.fn(() => mockPass)
}))

const s3Client = require('../../lib/s3-client') // Our test subject (SUT)
const testParams = { param1: 'val1' }
const testOptions = { opt1: 'optVal1' }
const mockCallback = jest.fn()

const testBucketName = 'testBucketName'
const testFilePath = 'testFilePath'
describe('S3Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('copies from one bucket to another', () => {
    const [fromBucket, fromPath, toBucket, toPath] = ['fromBucket', 'fromPath', 'toBucket', 'toPath']
    const expectedCopyObjectArg = {
      Bucket: toBucket,
      CopySource: `/${fromBucket}/${fromPath}`,
      Key: `${toPath}`
    }
    try {
      let res = s3Client.copy(fromBucket, fromPath, toBucket, toPath, testOptions)
      expect(res).toEqual(mockCopyObjectPromise)
      // Validate parameters were correctly passed to S3.upload()
      expect(mockCopyObject.mock.calls[0][0]).toEqual({ ...expectedCopyObjectArg, ...testOptions })

      // Test things when options argument is NOT provided; SUT should just default "extraParams" to "{}" in those cases
      res = s3Client.copy(fromBucket, fromPath, toBucket, toPath)
      expect(res).toEqual(mockCopyObjectPromise)
      expect(mockCopyObject.mock.calls[1][0]).toEqual(expectedCopyObjectArg)
    } catch (e) {
      console.error(`Problem running the test: ${e}`)
      expect(e).toBeUndefined()
    }
  })

  it('creates a write stream properly when "createWriteStream() gets invoked', () => {
    try {
      let res = s3Client.createWriteStream(testParams, mockCallback, testOptions)
      expect(res).toEqual({ writeStream: mockPass, uploadPromise: mockUploadPromise })
      // Validate parameters were correctly passed to S3.upload()
      expect(mockUpload.mock.calls[0][0]).toEqual({ ...testParams, Body: mockPass })
      expect(mockUpload.mock.calls[0][1]).toEqual(testOptions)
      expect(mockUpload.mock.calls[0][2]).toEqual(mockCallback)

      // Test things when options argument is not provided; SUT should justr default "options" to "{}" in those cases
      res = s3Client.createWriteStream(testParams, mockCallback)
      expect(res).toEqual({ writeStream: mockPass, uploadPromise: mockUploadPromise })
      expect(mockUpload.mock.calls[1][0]).toEqual({ ...testParams, Body: mockPass })
      expect(mockUpload.mock.calls[1][1]).toEqual({})
      expect(mockUpload.mock.calls[1][2]).toEqual(mockCallback)
    } catch (e) {
      console.error(`Problem running the test: ${e}`)
      expect(e).toBeUndefined()
    }
  })

  it('creates a read stream properly when "createReadStream()" method gets invoked', () => {
    try {
      const res = s3Client.createReadStream(testParams, mockCallback)
      expect(res).toEqual(mockReadable)
      // Validate parameters were correctly passed to S3.getObject()
      expect(mockGetObject.mock.calls[0][0]).toEqual(testParams)
      expect(mockGetObject.mock.calls[0][1]).toEqual(mockCallback)
    } catch (e) {
      console.error(`Problem running the test: ${e}`)
      expect(e).toBeUndefined()
    }
  })

  it('uploads a file to S3 when "put()" method gets invoked', () => {
    try {
      let res = s3Client.put(testParams, mockCallback, testOptions)
      expect(res).toEqual(mockUploadPromise)
      // Validate parameters were correctly passed to S3.upload()
      expect(mockUpload.mock.calls[0][0]).toEqual(testParams)
      expect(mockUpload.mock.calls[0][1]).toEqual(testOptions)
      expect(mockUpload.mock.calls[0][2]).toEqual(mockCallback)

      // Test things when options argument is not provided; SUT should justr default "options" to "{}" in those cases
      res = s3Client.put(testParams, mockCallback)
      expect(res).toEqual(mockUploadPromise)
      expect(mockUpload.mock.calls[1][0]).toEqual(testParams)
      expect(mockUpload.mock.calls[1][1]).toEqual({})
      expect(mockUpload.mock.calls[1][2]).toEqual(mockCallback)
    } catch (e) {
      console.error(`Problem running the test: ${e}`)
      expect(e).toBeUndefined()
    }
  })

  it('retrieves file tags', async () => {
    try {
      const res = await s3Client.tag(testBucketName, testFilePath, 'updated-by')
      expect(res).toEqual('Image-Delivery-Pipeline')
      // Validate parameters were correctly passed to S3.upload()
      expect(mockGetObjectTagging.mock.calls[0][0]).toEqual({
        Bucket: testBucketName,
        Key: testFilePath
      })
    } catch (e) {
      console.error(`Problem running the test: ${e}`)
      expect(e).toBeUndefined()
    }
  })

  it("does not retrieve tag if object doesn't have any", async () => {
    const savedTagSet = MOCK_TAGS.TagSet
    delete MOCK_TAGS.TagSet
    try {
      const res = await s3Client.tag(testBucketName, testFilePath, 'updated-by')
      expect(res).toBeNull()
      // Validate parameters were correctly passed to S3.upload()
      expect(mockGetObjectTagging.mock.calls[0][0]).toEqual({
        Bucket: testBucketName,
        Key: testFilePath
      })
    } catch (e) {
      console.error(`Problem running the test: ${e}`)
      expect(e).toBeUndefined()
    }
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
    try {
      const res = await s3Client.tag(testBucketName, testFilePath, 'updated-by')
      expect(res).toBeNull()
      // Validate parameters were correctly passed to S3.upload()
      expect(mockGetObjectTagging.mock.calls[0][0]).toEqual({
        Bucket: testBucketName,
        Key: testFilePath
      })
    } catch (e) {
      console.error(`Problem running the test: ${e}`)
      expect(e).toBeUndefined()
    }
    MOCK_METADATA.TagSet = savedTagSet
  })

  describe('checks if a file exists on S3', () => {
    it('returns the file metadata if it exists', async () => {
      try {
        const res = await s3Client.isFileExists(testBucketName, testFilePath)
        expect(res).toEqual({ ...MOCK_METADATA, Bucket: testBucketName, Key: testFilePath, exists: true })
        // Validate parameters were correctly passed to S3.headObject()
        expect(mockHeadObject.mock.calls[0][0]).toEqual({ Bucket: testBucketName, Key: testFilePath })
      } catch (e) {
        console.error(`Problem running the test: ${e}`)
        expect(e).toBeUndefined()
      }
    })
    it('returns false if it does not exist', async () => {
      try {
        mockHeadObject.mockImplementation(() => {
          const e = new Error()
          e.statusCode = 404
          throw e
        })
        const res = await s3Client.isFileExists(testBucketName, testFilePath)
        expect(res.exists).toBe(false)
      } catch (e) {
        console.error(`Problem running the test: ${e}`)
        expect(e).toBeUndefined()
      }
    })
    it('returns undefined if there was an unexpected error', async () => {
      try {
        mockHeadObject.mockImplementation(() => {
          const e = new Error('THIS IS A TEST')
          throw e
        })
        const res = await s3Client.isFileExists(testBucketName, testFilePath)
        expect(res.exists).toBeUndefined()
      } catch (e) {
        console.error(`Problem running the test: ${e}`)
        expect(e).toBeUndefined()
      }
    })
  })
  it("uses the sls offline S3 plugin client when stage is 'local'", async () => {
    process.env.SHO_AWS_STAGE = 'local'
    try {
      // TODO: Currently nothing gets validated here. We validate by virtue of code coverage that it
      //       executed the branch the selects the `local` S3 client. Will think of adding an explicit test here
      //       in the future.
      await s3Client.tag(testBucketName, testFilePath, 'updated-by')
    } catch (e) {
      console.error(`Problem running the test: ${e}`)
      expect(e).toBeUndefined()
    }
  })
})

describe('when listing objects in S3 bucket', () => {
  it('returns S3 object metadata', async () => {
    const s3Objects = await s3Client.list('TEST_BUCKET', 'test/file/path')
    expect(s3Objects).toBeDefined()
    expect(s3Objects.length).toEqual(MOCK_S3_LIST_OBJECTS_V2_METADATA.Contents.length)

    // s3Objects = JSON.parse(JSON.stringify(s3Objects))
    // s3Objects[0].Key = "unhappyface.jpg"

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
    let payload1 = cloneDeep(MOCK_S3_LIST_OBJECTS_V2_METADATA)
    let payload2 = cloneDeep(MOCK_S3_LIST_OBJECTS_V2_METADATA)

    payload1 = { ...payload1, ...{ IsTruncated: true, NextContinuationToken: 'XXX-Token-XXX' } }
    payload2 = { ...payload2, ...{ IsTruncated: false, NextContinuationToken: undefined } }

    mockListObjectsV2
      .mockImplementationOnce(() => ({
        promise: () => Promise.resolve(payload1) // contains 'NextContinuationToken'
      }))
      .mockImplementationOnce(() => ({
        promise: () => Promise.resolve(payload2)
      }))

    const s3Objects = await s3Client.list('TEST_BUCKET', 'test/file/path')
    expect(s3Objects).toBeDefined()
    expect(s3Objects.length).toEqual(payload1.Contents.length + payload2.Contents.length)
  })
})
