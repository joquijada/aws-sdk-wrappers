import { SQS } from 'aws-sdk/clients/all'
import { AWSError } from 'aws-sdk/lib/core'
export function send(url: any, message: any, params?: {}): Promise<import('aws-sdk/lib/request').PromiseResult<SQS.SendMessageResult, AWSError>>;
