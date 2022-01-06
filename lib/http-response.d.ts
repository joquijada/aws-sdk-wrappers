export = HttpResponse;
/**
 * Encapsulate HTTP response. Can be converted to an APIG Lambda proxy integration response object by invoking
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
     * Serializes to the format <a href="https://aws.amazon.com/premiumsupport/knowledge-center/malformed-502-api-gateway/">that AWS API Gateway proxies want Lambda proxy integrations to return, namely:</a>
     *
     * <pre>
     {
      "isBase64Encoded": true|false,
      "statusCode": httpStatusCode,
      "headers": { "headerName": "headerValue", ... },
      "cookies": ["cookie1", "cookie2", ... ]
      "body": "..."
     }
     * </pre>
     * See <a href="https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format">this page</a> for the full APIG/Lambda integration output format spec.
     * <br/>This method extracts out the APIG/Lambda proxy integration properties
     * (['statusCode', 'headers', 'cookies', 'isBase64Encoded', 'body']) from this object if any were defined,
     * and produce a response object made up of those properties. If property
     * 'body' is not found, this method will set one in the response generated, making the value be an object of all the properties
     * found in <strong>this</strong> object, minus the APIG/Lambda proxy integration properties listed above.<br/><br/>
     * If the logic looks weird is because we wanted to maintain backwards compatibility with clients
     * that already relied on the usual constructor(), else the constructor would accept arguments similar to the
     * props found in APIG/Lambda event response object.
     */
    toAwsApiGatewayFormat(): {
        body: any;
    };
}
