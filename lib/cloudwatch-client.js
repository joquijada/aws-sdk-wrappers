const { CloudWatch } = require('aws-sdk')
const cloudwatch = new CloudWatch({
  apiVersion: '2010-08-01',
  region: process.env.AWS_REGION
})

const extensions = {}
Object.assign(cloudwatch, extensions)
module.exports = cloudwatch
