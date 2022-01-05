// eslint-disable-next-line no-unused-vars
const { AWSError, SQS } = require('aws-sdk') // Added these to prevent error in tsc-generated type declaration
module.exports = {
  axiosClient: require('./lib/axios-client'),
  dynamoDbClient: require('./lib/dynamo-db-client'),
  s3Client: require('./lib/s3-client'),
  sqsClient: require('./lib/sqs-client'),
  utils: require('./lib/utils'),
  HttpResponse: require('./lib/http-response'),
  lambdaClient: require('./lib/lambda-client'),
  lambdaWrapper: require('./lib/lambda-wrapper'),
  redisClient: require('./lib/redis-client'),
  sesClient: require('./lib/ses-client')
}
