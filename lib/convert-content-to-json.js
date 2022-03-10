const queryString = require('query-string')
const { decode } = require('base-64')
const parse = require('simple-multipart/parse')

/**
 * Takes an input, assumed to be in [AWS APIG Lambda Proxy format](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format)
 * and transforms input.body into a JSON object. Optional transformer function is applied to all properties if the returned JSON.
 */
module.exports = (input, transformer = (str) => str) => {
  let contentType
  if (!input.headers || !(contentType = input.headers['content-type'])) {
    return null
  }

  let body = input.body
  if (input.isBase64Encoded) {
    body = decode(body)
  }
  if (contentType.startsWith('multipart/form-data')) {
    const ret = {}
    for (const field of parse({ body })) {
      ret[transformer(field.name)] = field.content
    }
    return ret
  } else if (contentType.startsWith('application/x-www-form-urlencoded')) {
    const res = queryString.parse(body)
    const ret = {}
    for (const prop of Object.keys(res)) {
      ret[transformer(prop)] = res[prop]
    }
    return ret
  } else if (contentType.startsWith('application/json')) {
    return JSON.parse(body)
  }
  return null
}
