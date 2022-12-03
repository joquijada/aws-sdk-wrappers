const cognitoIdentityServiceProviderClient = require('../../lib/cognito-identity-service-provider-client')

describe('cognito-identity-service-provider-client', () => {
  it('instantiates', async () => {
    expect(cognitoIdentityServiceProviderClient).toBeDefined()
  })
})
