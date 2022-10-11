const cognitoIdentityServiceProvider = require('../../lib/cognito-identity-service-provider')

describe('cognito-identity-service-provider', () => {
  it('instantiates', async () => {
    expect(cognitoIdentityServiceProvider).toBeDefined()
  })
})
