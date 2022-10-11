const sesClient = require('../../lib/ses-client')

describe('sqs-client', () => {
  it('instantiates', async () => {
    expect(sesClient).toBeDefined()
  })
})
