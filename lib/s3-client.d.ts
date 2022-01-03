/// <reference types="node" />
declare const _exports: {
    copy: (fromBucket: any, fromPath: any, toBucket: any, toPath: any, extraParams?: {}) => Promise<import("aws-sdk/lib/request").PromiseResult<S3.CopyObjectOutput, AWS.AWSError>>;
    createReadStream: (params: any, callback: any) => import("stream").Readable;
    createWriteStream: (params: any, callback: any, options?: {}) => {
        writeStream: PassThrough;
        uploadPromise: Promise<S3.ManagedUpload.SendData>;
    };
    /**
     * If file exists on the S3 bucket specified, return its metadata along with the file path and bucket name. Else
     * return false.
     */
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
        Metadata?: S3.Metadata;
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
        $response: AWS.Response<S3.HeadObjectOutput, AWS.AWSError>;
    } | {
        exists: boolean;
    }>;
    list: (bucketName: any, filePath: any) => Promise<S3.Object[]>;
    /**
     * Retrieves the metadata associated with an object in S3.
     * Note: Caller is responsible for catching any errors! This simply awaits for the promise to resolve and returns that. Caller
     *       should check in a try/catch or similar if the promise rejected for example if the file did not exist.
     */
    metadata: (bucketName: any, filePath: any) => Promise<import("aws-sdk/lib/request").PromiseResult<S3.HeadObjectOutput, AWS.AWSError>>;
    put: (params: any, callback: any, options?: {}) => Promise<S3.ManagedUpload.SendData>;
    tag: (bucketName: any, filePath: any, tagName: any) => Promise<string>;
    tags: (bucketName: any, filePath: any) => Promise<import("aws-sdk/lib/request").PromiseResult<S3.GetObjectTaggingOutput, AWS.AWSError>>;
    zipObjects: (bucketName: any, folder: any, objects: any) => any;
    zipObjectsToBucket: (fromBucketName: any, fromFolder: any, objects: any, toBucketName: any, toPath: any) => Promise<any>;
    config: import("aws-sdk/lib/config-base").ConfigBase & import("aws-sdk/lib/service").ServiceConfigurationOptions & import("aws-sdk/lib/config_use_dualstack").UseDualstackConfigOptions & S3.ClientApiVersions;
    apiVersions: string[];
    endpoint: Endpoint;
};
export = _exports;
import { S3 } from "aws-sdk/clients/all";
import { PassThrough } from "stream";
import { Endpoint } from "aws-sdk/lib/core";
