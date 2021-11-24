export = HttpResponse;
/**
 * Encapsulate HTTP response. Can be converted to an APIG Lambda response object by invoking
 * HttpResponse.toAwsApiGatewayFormat.
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
     * If the logic looks weird is because we wanted to maintain backwards compatibility with clients
     * that already relied on the usual constructor(), and didn't opt to overload constructor.
     */
    toAwsApiGatewayFormat(): {
        body: string;
    };
}
