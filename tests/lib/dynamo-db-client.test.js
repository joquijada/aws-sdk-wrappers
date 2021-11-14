const mockPromise = jest.fn().mockResolvedValue()
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

/*
 * Must provide mock factories for `aws-sdk` so that our mock is already set up as opposed to the default Jest mock
 * before `dynamo-db-client.js` goes to use it, which is pretty early on actually (I.e. outside of the modules.export... statement)
 */
jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      get: mockGet,
      put: mockPut,
      query: mockQuery,
      update: mockUpdate,
      delete: mockDelete
    }))
  }
}))
const dynamoDbClient = require('../../lib/dynamo-db-client')
const testParams = {
  param1: 'value1'
}
describe('DynamoDbClient', () => {
  it('invokes DynamoDB "get" correctly', () => {
    try {
      const res = dynamoDbClient.get(testParams)
      expect(res).toEqual(mockPromise)
      expect(mockGet.mock.calls[0][0]).toEqual(testParams)
    } catch (e) {
      console.error(`Problem running the test: ${e}`)
      expect(e).toBeUndefined()
    }
  })

  it('invokes DynamoDB "put" correctly', () => {
    try {
      const res = dynamoDbClient.put(testParams)
      expect(res).toEqual(mockPromise)
      expect(mockPut.mock.calls[0][0]).toEqual(testParams)
    } catch (e) {
      console.error(`Problem running the test: ${e}`)
      expect(e).toBeUndefined()
    }
  })

  it('invokes DynamoDB "query" correctly', () => {
    try {
      const res = dynamoDbClient.query(testParams)
      expect(res).toEqual(mockPromise)
      expect(mockQuery.mock.calls[0][0]).toEqual(testParams)
    } catch (e) {
      console.error(`Problem running the test: ${e}`)
      expect(e).toBeUndefined()
    }
  })

  it('invokes DynamoDB "update" correctly', () => {
    try {
      const res = dynamoDbClient.update(testParams)
      expect(res).toEqual(mockPromise)
      expect(mockUpdate.mock.calls[0][0]).toEqual(testParams)
    } catch (e) {
      console.error(`Problem running the test: ${e}`)
      expect(e).toBeUndefined()
    }
  })

  it('invokes DynamoDB "delete" correctly', () => {
    try {
      const res = dynamoDbClient.delete(testParams)
      expect(res).toEqual(mockPromise)
      expect(mockDelete.mock.calls[0][0]).toEqual(testParams)
    } catch (e) {
      console.error(`Problem running the test: ${e}`)
      expect(e).toBeUndefined()
    }
  })
})
