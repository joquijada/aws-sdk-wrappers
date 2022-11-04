const { CloudFormation } = require('aws-sdk')
const cloudFormation = new CloudFormation({
  apiVersion: '2010-05-15'
})

const extensions = {}
Object.assign(cloudFormation, extensions)
module.exports = cloudFormation
