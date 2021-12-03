import { DynamoDB } from "aws-sdk/clients/all";
export declare function _delete(params: any): Promise<import("aws-sdk/lib/request").PromiseResult<DynamoDB.DocumentClient.DeleteItemOutput, AWS.AWSError>>;
export { _delete as delete };
export declare function get(params: any): Promise<import("aws-sdk/lib/request").PromiseResult<DynamoDB.DocumentClient.GetItemOutput, AWS.AWSError>>;
export declare function put(params: any): Promise<import("aws-sdk/lib/request").PromiseResult<DynamoDB.DocumentClient.PutItemOutput, AWS.AWSError>>;
export declare function query(params: any): Promise<import("aws-sdk/lib/request").PromiseResult<DynamoDB.DocumentClient.QueryOutput, AWS.AWSError>>;
export declare function scan(params: any): Promise<import("aws-sdk/lib/request").PromiseResult<DynamoDB.DocumentClient.ScanOutput, AWS.AWSError>>;
export declare function update(params: any): Promise<import("aws-sdk/lib/request").PromiseResult<DynamoDB.DocumentClient.UpdateItemOutput, AWS.AWSError>>;
