const HttpResponse = require('./http-response')

/**
 * Function that wraps a lambda, mainly to catch any unexpected problem, those not explicitly coded for in the application
 * and return a response as appropriate, namely a 500 {@link HttpResponse}. When things are successful the lambda response is
 * just simply passed through, returned back to the caller exactly as-is.
 */
module.exports = (lambda) => {
  return function (event, context) {
    return Promise.resolve()
      // Run the Lambda
      .then(() => lambda(event, context))
      // On success just return the response as-is
      .then((responseBody) => {
        if (!responseBody) {
          // build a generic response if the passed in Lambda function did not generate one
          return new HttpResponse(200, 'Operation successful')
        }
        return responseBody
      })
      // Catch-all for when there's an unexpected failure
      .catch((error) => {
        // Test if we're dealing with an Exception object
        const res = new HttpResponse(500, error.message || error)
        // Log the error so that fire-and-fudgetaboutit scenarios don't silently fail
        console.error(`Problem invoking Lambda function ${lambda.name}`, error)
        return res
      })
      // Finally return response, success or failure thereof
      .then((body) => {
        const response = body.toAwsApiGatewayFormat ? body.toAwsApiGatewayFormat() : body
        console.debug(`LambdaWrapper: ${JSON.stringify(response)}`)
        return response
      })
  }
}
