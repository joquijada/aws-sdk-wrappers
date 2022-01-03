const MOCK_RESULT = { success: true }
const mockInvokePromise = jest.fn()
const mockInvoke = jest.fn(() => ({ promise: mockInvokePromise }))

/*
 * Ensure 'aws-sdk' gets mocked just in time, because 'invoke-lambda' uses it at the module root, and we need
 * to mutate this module for the various tests, for instance the 'aws-sdk.Lambda.invoke' function to simulate
 * success/failure events.
 */
jest.mock('aws-sdk', () => ({
  Lambda: jest.fn(() => ({
    invoke: mockInvoke
  }))
}))

const lambdaClient = require('../../lib/lambda-client')
const FRIENDLY_NAME = 'friendlyName'
const EXPECTED_ARGUMENTS = {
  FunctionName: 'testFunctionName',
  InvocationType: 'invocationType',
  Payload: { payloadProp: 'payloadVal' },
  extraParam1: 'extraVal1'
}

describe('LambdaClient', () => {
  it('updates client', () => {
    lambdaClient.updateClient({})
  })

  it('sets local properties', () => {
    const prevStage = process.env.SHO_AWS_STAGE
    process.env.SHO_AWS_STAGE = 'local'
    let copyLambdaClient
    jest.isolateModules(() => {
      copyLambdaClient = require('../../lib/lambda-client')
    })
    console.log(copyLambdaClient)
    process.env.SHO_AWS_STAGE = prevStage
  })

  describe('invokeLambda', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      mockInvokePromise.mockResolvedValue(MOCK_RESULT)
    })
    describe('when AWS Lambda SDK invocation succeeds', () => {
      it('returns Lambda results', async () => {
        const mockConsoleInfo = jest.spyOn(console, 'info').mockImplementation(() => {
        })
        process.env.SHO_AWS_STAGE = 'bogus'

        try {
          const rs = await lambdaClient.invokeLambda(EXPECTED_ARGUMENTS.FunctionName, EXPECTED_ARGUMENTS.InvocationType, EXPECTED_ARGUMENTS.Payload,
            FRIENDLY_NAME, { extraParam1: EXPECTED_ARGUMENTS.extraParam1 })
          expect(rs).toEqual(MOCK_RESULT)
          expect(mockInvoke).toHaveBeenCalledWith(EXPECTED_ARGUMENTS)
          expect(mockConsoleInfo.mock.calls[0][0]).toContain(FRIENDLY_NAME)
        } catch (e) {
          console.error(`Problem running the test: ${e}`)
          expect(e).toBeUndefined()
        }
      })
    })

    describe('when AWS Lambda SDK invocation fails', () => {
      it('returns rejected promise', async () => {
        process.env.SHO_AWS_STAGE = 'bogus'
        const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {
        })
        const MOCK_ERROR_MESSAGE = 'test failure message'
        mockInvokePromise.mockRejectedValue(MOCK_ERROR_MESSAGE)

        try {
          const rs = await lambdaClient.invokeLambda(EXPECTED_ARGUMENTS.FunctionName, EXPECTED_ARGUMENTS.InvocationType, EXPECTED_ARGUMENTS.Payload, FRIENDLY_NAME)
          expect(rs).toBeUndefined()
        } catch (e) {
          expect(e).toBeDefined()
          expect(e).toBeInstanceOf(Error)
          expect(e.message).toContain(MOCK_ERROR_MESSAGE)
          expect(mockConsoleError.mock.calls[0][0]).toContain(FRIENDLY_NAME)
        }
      })
    })

    describe('when a lambda is invoked in local mode mode', () => {
      it('throws error if invoked locally w/o sls offline plugin installed', async () => {
        process.env.SHO_AWS_STAGE = 'local'
        try {
          await lambdaClient.invokeLambda(EXPECTED_ARGUMENTS.FunctionName, EXPECTED_ARGUMENTS.InvocationType, EXPECTED_ARGUMENTS.Payload,
            FRIENDLY_NAME, { extraParam1: EXPECTED_ARGUMENTS.extraParam1 })
        } catch (e) {
          expect(e).toBeDefined()
          expect(e.message).toContain("Plugin 'serverless-offline' needs be running. See the developer guide on how to configure it.")
        }
      })

      it('proceeds w/o error if invoked locally and sls offline plugin is installed', async () => {
        process.env.SHO_AWS_STAGE = 'local'
        process.env.IS_OFFLINE = true
        try {
          await lambdaClient.invokeLambda(EXPECTED_ARGUMENTS.FunctionName, EXPECTED_ARGUMENTS.InvocationType, EXPECTED_ARGUMENTS.Payload,
            FRIENDLY_NAME, { extraParam1: EXPECTED_ARGUMENTS.extraParam1 })
        } catch (e) {
          console.error('Problem running the test:', e)
          expect(e).toBeUndefined()
        }
      })
    })
  })
})
