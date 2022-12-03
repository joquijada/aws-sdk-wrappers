const { CognitoIdentityServiceProvider: CognitoIdentityServiceProviderClient } = require('aws-sdk')

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProviderClient({ apiVersion: '2016-04-18' })

const extensions = {}
Object.assign(cognitoIdentityServiceProvider, extensions)
module.exports = cognitoIdentityServiceProvider
