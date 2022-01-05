const { SES } = require('aws-sdk')
var ses = new SES({ apiVersion: '2010-12-01' })

module.exports = {
  ...ses
}
