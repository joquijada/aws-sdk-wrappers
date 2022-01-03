declare const _exports: {
    invokeLambda: (functionName: any, invocationType: any, payload: any, friendlyName: any, extraParameters?: {}) => Promise<import("aws-sdk/lib/request").PromiseResult<Lambda.InvocationResponse, AWS.AWSError>>;
    updateClient: (opts: any) => void;
    config: import("aws-sdk/lib/config-base").ConfigBase & import("aws-sdk/lib/service").ServiceConfigurationOptions & Lambda.ClientApiVersions;
    apiVersions: string[];
    endpoint: AWS.Endpoint;
};
export = _exports;
import { Lambda } from "aws-sdk/clients/all";
