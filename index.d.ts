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
    copy: (fromBucket: any, fromPath: any, toBucket: any, toPath: any, extraParams?: {}) => Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.CopyObjectOutput, AWSError>>;
    createReadStream: (params: any, callback: any) => import("stream").Readable;
    createWriteStream: (params: any, callback: any, options?: {}) => {
        writeStream: import("stream").PassThrough;
        uploadPromise: Promise<AWS.S3.ManagedUpload.SendData>;
    };
    isFileExists: (bucketName: any, filePath: any) => Promise<{
        exists: boolean;
        Bucket: any;
        Key: any;
        DeleteMarker?: boolean;
        AcceptRanges?: string;
        Expiration?: string;
        Restore?: string;
        ArchiveStatus?: string;
        LastModified?: Date;
        ContentLength?: number;
        ETag?: string;
        MissingMeta?: number;
        VersionId?: string;
        CacheControl?: string;
        ContentDisposition?: string;
        ContentEncoding?: string;
        ContentLanguage?: string;
        ContentType?: string;
        Expires?: Date;
        WebsiteRedirectLocation?: string;
        ServerSideEncryption?: string;
        Metadata?: AWS.S3.Metadata;
        SSECustomerAlgorithm?: string;
        SSECustomerKeyMD5?: string;
        SSEKMSKeyId?: string;
        BucketKeyEnabled?: boolean;
        StorageClass?: string;
        RequestCharged?: string;
        ReplicationStatus?: string;
        PartsCount?: number;
        ObjectLockMode?: string;
        ObjectLockRetainUntilDate?: Date;
        ObjectLockLegalHoldStatus?: string;
        $response: AWS.Response<AWS.S3.HeadObjectOutput, AWSError>;
    } | {
        exists: boolean;
    }>;
    list: (bucketName: any, filePath: any) => Promise<AWS.S3.Object[]>;
    metadata: (bucketName: any, filePath: any) => Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.HeadObjectOutput, AWSError>>;
    put: (params: any, callback: any, options?: {}) => Promise<AWS.S3.ManagedUpload.SendData>;
    tag: (bucketName: any, filePath: any, tagName: any) => Promise<string>;
    tags: (bucketName: any, filePath: any) => Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.GetObjectTaggingOutput, AWSError>>;
    zipObjects: (bucketName: any, folder: any, objects: any) => any;
    zipObjectsToBucket: (fromBucketName: any, fromFolder: any, objects: any, toBucketName: any, toPath: any) => Promise<any>;
    updateClient: (opts: any) => void;
    config: import("aws-sdk/lib/config-base").ConfigBase & import("aws-sdk/lib/service").ServiceConfigurationOptions & import("aws-sdk/lib/config_use_dualstack").UseDualstackConfigOptions & AWS.S3.ClientApiVersions;
    apiVersions: string[];
    endpoint: AWS.Endpoint;
};
export const sqsClient: {
    send: (url: any, message: any, params?: {}) => Promise<import("aws-sdk/lib/request").PromiseResult<SQS.SendMessageResult, AWSError>>;
};
export const utils: {
    isString: (argument: any) => boolean;
    convertContentToJSON: (input: any, transformer?: (str: any) => any) => {};
};
export const HttpResponse: typeof import("./lib/http-response");
export const lambdaClient: {
    invokeLambda: (functionName: any, invocationType: any, payload: any, friendlyName: any, extraParameters?: {}) => Promise<import("aws-sdk/lib/request").PromiseResult<AWS.Lambda.InvocationResponse, AWSError>>;
    updateClient: (opts: any) => void;
    config: import("aws-sdk/lib/config-base").ConfigBase & import("aws-sdk/lib/service").ServiceConfigurationOptions & AWS.Lambda.ClientApiVersions;
    apiVersions: string[];
    endpoint: AWS.Endpoint;
};
export const lambdaWrapper: (lambda: any) => (event: any, context: any) => Promise<any>;
export const redisClient: Record<string, Function>;
