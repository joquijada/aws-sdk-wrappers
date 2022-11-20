import { Lambda } from 'aws-sdk'
import { _Blob, InvocationType } from 'aws-sdk/clients/lambda'
import { AWSError } from 'aws-sdk/lib/error'
import { PromiseResult } from 'aws-sdk/lib/request'

export type LambdaClient = Lambda & {
  invokeLambda: (functionName: string, invocationType: InvocationType, payload: _Blob, friendlyName: string, extraParameters?: Lambda.Types.InvocationRequest) => Promise<PromiseResult<Lambda.Types.InvocationResponse, AWSError>>
  updateClient: (options?: Lambda.Types.ClientConfiguration) => void
}
