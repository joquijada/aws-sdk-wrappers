/// <reference types="node" />
import { AWSError } from "aws-sdk/lib/core";
import { SQS } from "aws-sdk/clients/all";
export const axiosClient: {
    get: (url: any, callback: any, options?: {}) => any;
    getAsStream: (url: any, callback: any, options?: {}) => any;
    passThroughLambdaEvent: (url: any, event: any) => Promise<{
        body: any;
        headers: any;
        statusCode: any;
    }>;
};
export const dynamoDbClient: {
    copyTable: (params: any) => Promise<any>;
    delete: (params: any) => Promise<import("aws-sdk/lib/request").PromiseResult<AWS.DynamoDB.DocumentClient.DeleteItemOutput, AWSError>>;
    get: (params: any) => Promise<import("aws-sdk/lib/request").PromiseResult<AWS.DynamoDB.DocumentClient.GetItemOutput, AWSError>>;
    put: (params: any) => Promise<import("aws-sdk/lib/request").PromiseResult<AWS.DynamoDB.DocumentClient.PutItemOutput, AWSError>>;
    query: (params: any) => Promise<import("aws-sdk/lib/request").PromiseResult<AWS.DynamoDB.DocumentClient.QueryOutput, AWSError>>;
    scan: (params: any) => Promise<import("aws-sdk/lib/request").PromiseResult<AWS.DynamoDB.DocumentClient.ScanOutput, AWSError>>;
    update: (params: any) => Promise<import("aws-sdk/lib/request").PromiseResult<AWS.DynamoDB.DocumentClient.UpdateItemOutput, AWSError>>;
};
export const s3Client: {
    copy: (fromBucket: any, fromPath: any, toBucket: any, toPath: any, extraParams?: {}) => Promise<any>;
    createReadStream: (params: any, callback: any) => any;
    createWriteStream: (params: any, callback: any, options?: {}) => {
        writeStream: import("stream").PassThrough;
        uploadPromise: any;
    };
    isFileExists: (bucketName: any, filePath: any) => Promise<any>;
    metadata: (bucketName: any, filePath: any) => Promise<any>;
    put: (params: any, callback: any, options?: {}) => any;
    tag: (bucketName: any, filePath: any, tagName: any) => Promise<any>;
    tags: (bucketName: any, filePath: any) => Promise<any>;
    list: (bucketName: any, filePath: any) => Promise<any[]>;
};
export const sqsClient: {
    send: (url: any, message: any, params?: {}) => Promise<import("aws-sdk/lib/request").PromiseResult<SQS.SendMessageResult, AWSError>>;
};
export const utils: {
    isString: (argument: any) => boolean;
    convertContentToJSON: (input: any, transformer?: (str: any) => any) => {};
};
export const HttpResponse: typeof import("./lib/http-response");
export const lambdaClient: typeof import("./lib/lambda-client");
export const lambdaWrapper: (lambda: any) => (event: any, context: any) => Promise<any>;
export const redisClient: Record<string, Function>;
