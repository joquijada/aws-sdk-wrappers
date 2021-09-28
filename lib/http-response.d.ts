export = HttpResponse;
/**
 * Encapsulate HTTP response.
 *
 */
declare class HttpResponse {
    /**
     * @param {number} statusCode
     * @param {any} message
     */
    constructor(statusCode: number, message: any, additionalInfo?: {});
    statusCode: number;
    message: any;
    /**
     * Serializes to the format <a href="https://aws.amazon.com/premiumsupport/knowledge-center/malformed-502-api-gateway/">that AWS API Gateway proxies like:</a>
     *
     * <pre>
     {
      "isBase64Encoded": true|false,
      "statusCode": httpStatusCode,
      "headers": { "headerName": "headerValue", ... },
      "body": "..."
     }
     * </pre>
     */
    toAwsApiGatewayFormat(): {
        statusCode: number;
        isBase64Encoded: boolean;
        body: string;
    };
}
