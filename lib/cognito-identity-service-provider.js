const { CognitoIdentityServiceProvider } = require('aws-sdk')

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' })

const extensions = {}
Object.assign(cognitoIdentityServiceProvider, extensions)
module.exports = cognitoIdentityServiceProvider
