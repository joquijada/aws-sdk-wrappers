const cloudFrontClient = require('../../lib/cloudfront-client')

describe('cloudfront-client', () => {
  it('instantiates', async () => {
    expect(cloudFrontClient).toBeDefined()
  })
})
