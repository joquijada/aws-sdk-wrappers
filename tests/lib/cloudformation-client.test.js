const cloudFormation = require('../../lib/cloudformation-client')

describe('cloudformation-client', () => {
  it('instantiates', async () => {
    expect(cloudFormation).toBeDefined()
  })
})
