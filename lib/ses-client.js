const { SES } = require('aws-sdk')
var ses = new SES({ apiVersion: '2010-12-01' })

const extensions = {}
Object.assign(ses, extensions)
module.exports = ses
