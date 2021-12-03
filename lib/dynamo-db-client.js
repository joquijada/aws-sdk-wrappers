const { DynamoDB } = require('aws-sdk')

const client = new DynamoDB.DocumentClient()

module.exports = {
  delete: (params) => client.delete(params).promise(),
  get: (params) => client.get(params).promise(),
  put: (params) => client.put(params).promise(),
  query: (params) => client.query(params).promise(),
  scan: (params) => client.scan(params).promise(),
  update: (params) => client.update(params).promise()
}
