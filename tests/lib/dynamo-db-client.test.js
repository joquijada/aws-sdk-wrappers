jest.mock('copy-dynamodb-table')

const mockPromise = jest.fn().mockResolvedValue('success')
const mockGet = jest.fn(() => ({
  promise: () => mockPromise
}))
const mockPut = jest.fn(() => ({
  promise: () => mockPromise
}))
const mockQuery = jest.fn(() => ({
  promise: () => mockPromise
}))
const mockUpdate = jest.fn(() => ({
  promise: () => mockPromise
}))
const mockDelete = jest.fn(() => ({
  promise: () => mockPromise
}))
const mockScan = jest.fn(() => ({
  promise: () => mockPromise
}))

/*
 * Must provide mock factories for `aws-sdk` so that our mock is already set up as opposed to the default Jest mock
 * before `dynamo-db-client.js` goes to use it, which is pretty early on actually (I.e. outside of the modules.export... statement)
 */
jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      delete: mockDelete,
      get: mockGet,
      put: mockPut,
      query: mockQuery,
      scan: mockScan,
      update: mockUpdate
    }))
  }
}))
const dynamoDbClient = require('../../lib/dynamo-db-client')
const { copy } = require('copy-dynamodb-table')
const testParams = {
  param1: 'value1'
}
describe('DynamoDbClient', () => {
  it('invokes DynamoDB "get" correctly', async () => {
    const res = await dynamoDbClient.get(testParams)
    expect(res).toEqual(mockPromise)
    expect(mockGet.mock.calls[0][0]).toEqual(testParams)
  })

  it('invokes DynamoDB "put" correctly', async () => {
    const res = await dynamoDbClient.put(testParams)
    expect(res).toEqual(mockPromise)
    expect(mockPut.mock.calls[0][0]).toEqual(testParams)
  })

  it('invokes DynamoDB "query" correctly', async () => {
    const res = await dynamoDbClient.query(testParams)
    expect(res).toEqual(mockPromise)
    expect(mockQuery.mock.calls[0][0]).toEqual(testParams)
  })

  it('invokes DynamoDB "update" correctly', async () => {
    const res = await dynamoDbClient.update(testParams)
    expect(res).toEqual(mockPromise)
    expect(mockUpdate.mock.calls[0][0]).toEqual(testParams)
  })

  it('invokes DynamoDB "delete" correctly', async () => {
    const res = await dynamoDbClient.delete(testParams)
    expect(res).toEqual(mockPromise)
    expect(mockDelete.mock.calls[0][0]).toEqual(testParams)
  })

  it('scans a table', async () => {
    const res = await dynamoDbClient.scan(testParams)
    expect(res).toEqual(mockPromise)
    expect(mockScan.mock.calls[0][0]).toEqual(testParams)
  })

  it('returns a resolved promise when copy table succeeds', async () => {
    const dummySuccessResult = {
      success: true
    }
    copy.mockImplementationOnce((params, cb) => {
      cb(null, dummySuccessResult)
    })
    try {
      const res = await dynamoDbClient.copyTable(testParams)
      expect(res).toEqual(dummySuccessResult)
      expect(copy.mock.calls[0][0]).toEqual(testParams)
    } catch (e) {
      console.error(`Problem running the test: ${e}`)
      expect(e).toBeUndefined()
    }
  })

  it('returns a rejected promise when copy table fails', async () => {
    const dummyError = {
      success: false
    }
    copy.mockImplementationOnce((params, cb) => {
      cb(dummyError, null)
    })
    try {
      await dynamoDbClient.copyTable(testParams)
      expect(copy.mock.calls[0][0]).toEqual(testParams)
      throw new Error('Should have thrown an error')
    } catch (e) {
      expect(e).toEqual(dummyError)
    }
  })
})
