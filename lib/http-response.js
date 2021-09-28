const assign = require('lodash.assign')

/**
 * Encapsulate HTTP response.
 *
 */
class HttpResponse {
  /**
   * @param {number} statusCode
   * @param {any} message
   */
  constructor(statusCode, message, additionalInfo = {}) {
    this.statusCode = statusCode
    this.message = message
    assign(this, additionalInfo)
  }

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
  toAwsApiGatewayFormat() {
    return {
      statusCode: this.statusCode,
      isBase64Encoded: false,
      body: JSON.stringify(this, null, ' ')
    }
  }
}

module.exports = HttpResponse
