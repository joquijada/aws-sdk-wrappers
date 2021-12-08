const { copy } = require('copy-dynamodb-table')
const { DynamoDB } = require('aws-sdk')

const client = new DynamoDB.DocumentClient()

module.exports = {
  copyTable: (params) => {
    return new Promise((resolve, reject) => {
      copy(params, function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  },
  delete: (params) => client.delete(params).promise(),
  get: (params) => client.get(params).promise(),
  put: (params) => client.put(params).promise(),
  query: (params) => client.query(params).promise(),
  scan: (params) => client.scan(params).promise(),
  update: (params) => client.update(params).promise()
}
