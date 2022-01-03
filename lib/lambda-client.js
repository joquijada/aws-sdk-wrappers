const { Lambda } = require('aws-sdk')

const lambdaProperties = {
  apiVersion: '2015-03-31'
}

if (process.env.SHO_AWS_STAGE === 'local') {
  lambdaProperties.endpoint = 'http://localhost:3002'
}

const lambdaClient = new Lambda(lambdaProperties)

module.exports = lambdaClient

module.exports.invokeLambda = async (functionName, invocationType, payload, friendlyName, extraParameters = {}) => {
  const invokeParams = {
    FunctionName: functionName,
    InvocationType: invocationType,
    Payload: payload,
    ...extraParameters
  }

  try {
    console.debug(`Invoking ${friendlyName}: ${invokeParams.FunctionName}`)
    const rs = await lambdaClient.invoke(invokeParams).promise()
    console.info(`${friendlyName} invocation succeeded: ${JSON.stringify(rs)}`)
    return rs
  } catch (e) {
    const errorMessage = `Failed to invoke ${friendlyName} [${invokeParams.FunctionName}]`
    console.error(`${errorMessage}`, e)
    // "Re-throw the exception" so calling code has a chance to handle as it pleases
    return Promise.reject(new Error(`${errorMessage}: ${e}`))
  }
}
