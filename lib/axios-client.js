const axios = require('axios')

const configureTimeout = (options) => {
  if (!options.timeout) {
    options.timeout = isFinite(process.env.AXIOS_TIMEOUT) ? parseInt(process.env.AXIOS_TIMEOUT) : 30000
  }
}

/**
 * Thin wrapper around `axios` API, mainly for convenience. This is not exhaustive, and can be augmented as needed.
 */
const that = module.exports = {
  get: (url, callback, options = {}) => {
    options.transformResponse = callback
    configureTimeout(options)
    return axios.get(url, options)
  },
  getAsStream: (url, callback, options = {}) => {
    options.responseType = 'stream'
    return that.get(url, callback, options)
  },
  /**
   * This method is designed for APIG endpoints with Lambda Proxy Integration, when
   * you just want to pass the request as-is to a 3rd resource, and then get response back
   * and send it to the client.
   */
  passThroughLambdaEvent: async (url, event) => {
    const ret = {}
    try {
      const response = await axios({
        method: event.requestContext.http.method,
        headers: event.headers,
        url: url,
        data: event.body
      })
      ret.body = response.data
      ret.headers = response.headers
      ret.statusCode = response.status
    } catch (e) {
      ret.statusCode = 500
      ret.body = e.message || e
    }
    return ret
  },
  post: (...args) => axios.post(...args)
}
