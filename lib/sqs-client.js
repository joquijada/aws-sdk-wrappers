// eslint-disable-next-line no-unused-vars
const { SQS, AWSError } = require('aws-sdk')
const { isString } = require('./utils')
const sqs = new SQS({ apiVersion: '2012-11-05' })

module.exports = {
  send: (url, message, params = {}) => sqs.sendMessage({
    QueueUrl: url,
    MessageBody: isString(message) ? message : JSON.stringify(message),
    ...params
  }).promise()
}
