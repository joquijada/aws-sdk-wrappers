const lambdaWrapper = require('../../lib/lambda-wrapper')

const lambdaMock = jest.fn()

describe('LambdaWrapper', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('when Lambda executes successfully', () => {
    it('returns the response as a promise', async () => {
      const MOCK_OUTPUT = 'Lambda invocation successful'
      lambdaMock.mockImplementation(async (event, context) => MOCK_OUTPUT)
      const wrappedLambda = lambdaWrapper(lambdaMock)
      const result = await wrappedLambda()
      expect(result).toEqual(MOCK_OUTPUT)
    })
  })

  describe('when Lambda execution fails', () => {
    it('returns an HTTP 500 error as a promise that contains the error message of what went wrong', async () => {
      const MOCK_ERROR = '*** THIS IS A TEST ERROR MESSAGE *** Lambda invocation failed'
      lambdaMock.mockRejectedValue(MOCK_ERROR)
      const wrappedLambda = lambdaWrapper(lambdaMock)
      const result = await wrappedLambda()
      expect(result).toBeDefined()
      expect(result.statusCode).toBe(500)
      const body = JSON.parse(result.body)
      expect(body.message).toBe(MOCK_ERROR)
      expect(body.statusCode).toBe(500)
    })
  })

  describe('when Lambda execution succeeds and does not return a value', () => {
    it('generates default response', async () => {
      lambdaMock.mockImplementation(async (event, context) => {
      })
      const wrappedLambda = lambdaWrapper(lambdaMock)
      const result = await wrappedLambda()
      expect(result).toBeDefined()
      expect(result.statusCode).toBe(200)
      const body = JSON.parse(result.body)
      expect(body.message).toBe('Operation successful')
      expect(body.statusCode).toBe(200)
    })
  })
})
