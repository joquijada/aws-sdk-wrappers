import { PassThrough } from "stream";
export function copy(fromBucket: any, fromPath: any, toBucket: any, toPath: any, extraParams?: {}): Promise<any>;
export function createReadStream(params: any, callback: any): any;
export function createWriteStream(params: any, callback: any, options?: {}): {
    writeStream: PassThrough;
    uploadPromise: any;
};
export function isFileExists(bucketName: any, filePath: any): Promise<any>;
export function list(bucketName: any, filePath: any): Promise<any[]>;
export function metadata(bucketName: any, filePath: any): Promise<any>;
export function put(params: any, callback: any, options?: {}): any;
export function tag(bucketName: any, filePath: any, tagName: any): Promise<any>;
export function tags(bucketName: any, filePath: any): Promise<any>;
export function zipObjects(bucketName: any, folder: any, objects: any): any;
export function zipObjectsToBucket(fromBucketName: any, fromFolder: any, objects: any, toBucketName: any, toPath: any): any;
