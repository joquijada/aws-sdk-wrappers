const { Lambda } = require('aws-sdk')

const LAMBDA_CLIENTS_PER_STAGE = {
  local: new Lambda({
    apiVersion: '2015-03-31',
    endpoint: 'http://localhost:3002'
  }),
  default: new Lambda({
    apiVersion: '2015-03-31'
  })
}
const lambdaClient = () => {
  let stage = process.env.SHO_AWS_STAGE
  /* istanbul ignore next */
  if (!stage && process.env.IS_OFFLINE) {
    stage = 'local'
  }

  if (stage === 'local' && !process.env.IS_OFFLINE) {
    throw new Error("Plugin 'serverless-offline' needs be running. See the developer guide on how to configure it.")
  }
  return LAMBDA_CLIENTS_PER_STAGE[stage] || LAMBDA_CLIENTS_PER_STAGE.default
}

module.exports.invokeLambda = async (functionName, invocationType, payload, friendlyName, extraParameters = {}) => {
  const invokeParams = {
    FunctionName: functionName,
    InvocationType: invocationType,
    Payload: payload,
    ...extraParameters
  }

  try {
    console.debug(`Invoking ${friendlyName}: ${invokeParams.FunctionName}`)
    const rs = await lambdaClient().invoke(invokeParams).promise()
    console.info(`${friendlyName} invocation succeeded: ${JSON.stringify(rs)}`)
    return rs
  } catch (e) {
    const errorMessage = `Failed to invoke ${friendlyName} [${invokeParams.FunctionName}]`
    console.error(`${errorMessage}`, e)
    // "Re-throw the exception" so calling code has a chance to handle as it pleases
    return Promise.reject(new Error(`${errorMessage}: ${e}`))
  }
}
module.exports.updateLocalClient = (options) => {
  LAMBDA_CLIENTS_PER_STAGE.local = new Lambda({
    apiVersion: '2015-03-31',
    ...options
  })
}
