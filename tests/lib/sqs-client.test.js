const mockSendMessagePromise = jest.fn().mockResolvedValue('successfully sent')
const mockSendMessage = jest.fn((params) => ({
  promise: mockSendMessagePromise
}))
jest.mock('aws-sdk', () => ({
  SQS: jest.fn(() => ({
    sendMessage: mockSendMessage
  }))
}))

const sqs = require('../../lib/sqs-client')

const MOCK_QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/009633205895/my-stupid-queue'
const MOCK_MESSAGE = 'my stupid message'

describe('sqs-client', () => {
  beforeEach(() => {
    mockSendMessage.mockClear()
  })
  it('sends message to AWS SQS', async () => {
    const mockOtherParams = { param1: 'val1', param2: 'val2' }
    try {
      await sqs.send(MOCK_QUEUE_URL, MOCK_MESSAGE, mockOtherParams)
      expect(mockSendMessage).toHaveBeenCalledTimes(1)
      expect(mockSendMessage.mock.calls[0][0]).toEqual({
        MessageBody: MOCK_MESSAGE,
        QueueUrl: MOCK_QUEUE_URL,
        ...mockOtherParams
      })
    } catch (e) {
      console.error('Problem running the test:', e)
      expect(e).toBeUndefined()
    }
  })

  it('sends message to AWS SQS as JSON', async () => {
    const mockOtherParams = { param1: 'val1', param2: 'val2' }
    try {
      await sqs.send(MOCK_QUEUE_URL, { message: MOCK_MESSAGE }, mockOtherParams)
      expect(mockSendMessage).toHaveBeenCalledTimes(1)
      expect(mockSendMessage.mock.calls[0][0]).toEqual({
        MessageBody: JSON.stringify({ message: MOCK_MESSAGE }),
        QueueUrl: MOCK_QUEUE_URL,
        ...mockOtherParams
      })
    } catch (e) {
      console.error('Problem running the test:', e)
      expect(e).toBeUndefined()
    }
  })

  it('sends message to AWS SQS with default other params', async () => {
    try {
      await sqs.send(MOCK_QUEUE_URL, MOCK_MESSAGE)
      expect(mockSendMessage).toHaveBeenCalledTimes(1)
      expect(mockSendMessage.mock.calls[0][0]).toEqual({ MessageBody: MOCK_MESSAGE, QueueUrl: MOCK_QUEUE_URL })
    } catch (e) {
      console.error('Problem running the test:', e)
      expect(e).toBeUndefined()
    }
  })
})
