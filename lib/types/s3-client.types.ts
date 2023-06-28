import { S3 } from 'aws-sdk'
import { PromiseResult } from 'aws-sdk/lib/request'
import { AWSError } from 'aws-sdk/lib/error'
import { PassThrough, Readable } from 'stream'
import { ManagedUpload, ObjectList } from 'aws-sdk/clients/s3'

export type S3Client = S3 & {
  copy: (fromBucket: string, fromPath: string, toBucket: string, toPath, extraParams?: S3.Types.CopyObjectRequest) => Promise<PromiseResult<S3.Types.CopyObjectOutput, AWSError>>
  createReadStream: (params: S3.Types.GetObjectRequest, callback?: (err: AWSError, data: S3.Types.GetObjectOutput) => void) => Readable
  createWriteStream: (params: S3.Types.PutObjectRequest, callback?: (err: Error, data: ManagedUpload.SendData) => void, options?: ManagedUpload.ManagedUploadOptions) => { writeStream: PassThrough, uploadPromise: ManagedUpload }
  isFileExists: (bucketName: string, filePath: string) => Promise<{
    exists: boolean | undefined
    metadata: PromiseResult<S3.Types.HeadObjectOutput, AWSError>
    params: {
      Bucket: string
      Key: string
    }
  }>
  list: (bucketName, folder) => Promise<ObjectList>
  listAsStream: (bucketName, folder) => Readable
  metadata: (bucketName: string, filePath: string) => Promise<PromiseResult<S3.Types.HeadObjectOutput, AWSError>>
  put: (params: S3.Types.PutObjectRequest, callback?: (err: Error, data: ManagedUpload.SendData) => void, options?: ManagedUpload.ManagedUploadOptions) => Promise<ManagedUpload.SendData>
  sync: (params: {
    fromS3Client: S3Client,
    fromBucket: string,
    fromPath: string,
    toS3Client: S3Client,
    toBucket: string,
    toPath: string
  }) => Promise<void>
  tag: (bucketName: string, filePath: string, tagName: string) => Promise<null | S3.Value>
  tags: (bucketName: string, filePath: string) => Promise<PromiseResult<S3.Types.GetObjectTaggingOutput, AWSError>>
  zipObjects: (bucketName: string, folder: string, objects: string[]) => unknown
  zipObjectsToBucket: (fromBucketName: string, fromFolder: string, objects: string[], toBucketName: string, toPath: string) => Promise<unknown>
  updateClient: (options?: S3.Types.ClientConfiguration) => void
  buildNewClient: (options?: S3.Types.ClientConfiguration) => S3
}
