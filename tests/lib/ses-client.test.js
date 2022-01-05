const sesClient = require('../../lib/ses-client')

jest.mock('aws-sdk', () => ({
  SES: jest.fn(() => ({
    sendEmail: jest.fn()
  }))
}))

describe('sqs-client', () => {
  it('instantiates', async () => {
    expect(sesClient).toBeDefined()
  })
})
