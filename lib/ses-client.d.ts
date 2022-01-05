declare const _exports: {
    config: import("aws-sdk/lib/config-base").ConfigBase & import("aws-sdk/lib/service").ServiceConfigurationOptions & SES.ClientApiVersions;
    apiVersions: string[];
    endpoint: AWS.Endpoint;
};
export = _exports;
import { SES } from "aws-sdk/clients/all";
