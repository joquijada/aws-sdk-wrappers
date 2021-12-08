const assign = require('lodash.assign')

/**
 * Encapsulate HTTP response. Can be converted to an APIG Lambda proxy integration response object by invoking
 * HttpResponse.toAwsApiGatewayFormat.
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
   * If the logic looks weird is because we wanted to maintain backwards compatibility with clients
   * that already relied on the usual constructor(), else the constructor would accept arguments similar to the
   * props found in APIG/Lambda event response object.
   */
  toAwsApiGatewayFormat() {
    const clone = {}
    assign(clone, this)
    if (!clone.message) {
      delete clone.message
    }

    const res = {}
    const awsApiGatewayProps = ['statusCode', 'headers', 'cookies', 'isBase64Encoded', 'body']
    for (const prop of awsApiGatewayProps) {
      if (clone[prop] !== undefined) {
        res[prop] = clone[prop]
      }
      delete clone[prop]
    }

    // If caller didn't define 'body' explicitly, generate on, setting value to serialization
    // of all props of this object, minutes the APIG/Lambda proxy integration props above.
    if (!res.body) {
      res.body = JSON.stringify(clone, null, ' ')
    }

    return res
  }
}

module.exports = HttpResponse
