const sesClient = require('../../lib/ses-client')

describe('ses-client', () => {
  it('instantiates', async () => {
    expect(sesClient).toBeDefined()
  })
})
