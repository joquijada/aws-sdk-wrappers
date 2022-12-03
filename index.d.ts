import { AWSError } from 'aws-sdk/lib/core'
import { SQS } from 'aws-sdk/clients/all'
import * as AWS from 'aws-sdk'
import { S3Client } from './lib/types/s3-client.types'
import { LambdaClient } from './lib/types/lambda-client.types'
import { RedisClient } from './lib/types/redis-client.types'

export const axiosClient: {
  get: (url: any, callback: any, options?: {}) => any;
  getAsStream: (url: any, callback: any, options?: {}) => any;
  passThroughLambdaEvent: (url: any, event: any) => Promise<{
    body: any;
    headers: any;
    statusCode: any;
  }>;
  post: (...args: any[]) => any;
}
export const cognitoIdentityServiceProviderClient: AWS.CognitoIdentityServiceProvider
export const dynamoDbClient: {
  copyTable: (params: any) => Promise<any>;
  delete: (params: any) => Promise<import('aws-sdk/lib/request').PromiseResult<AWS.DynamoDB.DocumentClient.DeleteItemOutput, AWSError>>;
  get: (params: any) => Promise<import('aws-sdk/lib/request').PromiseResult<AWS.DynamoDB.DocumentClient.GetItemOutput, AWSError>>;
  put: (params: any) => Promise<import('aws-sdk/lib/request').PromiseResult<AWS.DynamoDB.DocumentClient.PutItemOutput, AWSError>>;
  query: (params: any) => Promise<import('aws-sdk/lib/request').PromiseResult<AWS.DynamoDB.DocumentClient.QueryOutput, AWSError>>;
  scan: (params: any) => Promise<import('aws-sdk/lib/request').PromiseResult<AWS.DynamoDB.DocumentClient.ScanOutput, AWSError>>;
  update: (params: any) => Promise<import('aws-sdk/lib/request').PromiseResult<AWS.DynamoDB.DocumentClient.UpdateItemOutput, AWSError>>;
}
export const s3Client: S3Client
export const sqsClient: {
  send: (url: any, message: any, params?: {}) => Promise<import('aws-sdk/lib/request').PromiseResult<SQS.SendMessageResult, AWSError>>;
}
export const utils: {
  isString: (argument: any) => boolean;
  convertContentToJSON: (input: any, transformer?: (str: any) => any) => any;
}
export const HttpResponse: typeof import('./lib/http-response')
export const lambdaClient: LambdaClient
export const lambdaWrapper: (lambda: any) => (event: any, context: any) => Promise<any>
export const redisClient: RedisClient
export const sesClient: AWS.SES
export const cloudWatchClient: AWS.CloudWatch
export const cloudFrontClient: AWS.CloudFront
export const cloudFormationClient: AWS.CloudFormation
