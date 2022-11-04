const { CloudFront } = require('aws-sdk')

const cloudFront = new CloudFront({ apiVersion: '2020-05-31' })

const extensions = {}
Object.assign(cloudFront, extensions)
module.exports = cloudFront
