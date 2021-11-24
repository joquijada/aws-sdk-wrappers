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
    const clone = {}
    assign(clone, this)
    if (!clone.message) {
      delete clone.message
    }

    const res = {}
    const awsApiGatwayProps = ['statusCode', 'headers', 'cookies', 'isBase64Encoded']
    for (const prop of awsApiGatwayProps) {
      if (clone[prop] !== undefined) {
        res[prop] = clone[prop]
      }
      delete clone[prop]
    }

    res.body = JSON.stringify(clone, null, ' ')

    return res
  }
}

module.exports = HttpResponse
