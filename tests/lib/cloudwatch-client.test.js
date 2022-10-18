const cloudWatchClient = require('../../lib/cloudwatch-client')

describe('cloudwatch-client', () => {
  it('instantiates', async () => {
    expect(cloudWatchClient).toBeDefined()
  })
})
