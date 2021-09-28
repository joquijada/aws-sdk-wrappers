jest.mock('axios')

const axios = require('axios')
const { Readable } = require('stream')
const axiosClient = require('../../lib/axios-client.js')

const mockUrl = 'http://www.foobar.com/resources/1234'
const mockCallback = jest.fn()
const mockAxiosResponse = { data: 'the goods' }
const mockAxiosStreamResponse = new Readable()

const AXIOS_DEFAULT_TIMEOUT = 30000
describe('AxiosClient', () => {
  afterEach(() => {
    process.env.AXIOS_TIMEOUT = AXIOS_DEFAULT_TIMEOUT
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  describe('when get() method gets invoked', () => {
    it('returns response payload', () => {
      axios.get.mockReturnValue(mockAxiosResponse)
      try {
        const res = axiosClient.get(mockUrl, mockCallback)
        expect(res).toEqual(mockAxiosResponse)
        expect(axios.get.mock.calls[0][0]).toBe(mockUrl)
        expect(axios.get.mock.calls[0][1]).toEqual({
          transformResponse: mockCallback,
          timeout: AXIOS_DEFAULT_TIMEOUT
        })
      } catch (e) {
        console.error(`Problem running the test: ${e}`)
        expect(e).toBeUndefined()
      }
    })

    it('passes correct options', () => {
      axios.get.mockReturnValue(mockAxiosResponse)
      const mockOptions = { myOpt: 'val' }
      try {
        const res = axiosClient.get(mockUrl, mockCallback, mockOptions)
        expect(res).toEqual(mockAxiosResponse)
        expect(axios.get.mock.calls[0][0]).toBe(mockUrl)
        expect(axios.get.mock.calls[0][1]).toEqual({
          transformResponse: mockCallback,
          timeout: AXIOS_DEFAULT_TIMEOUT,
          ...mockOptions
        })
      } catch (e) {
        console.error(`Problem running the test: ${e}`)
        expect(e).toBeUndefined()
      }
    })

    it('configures default timeout when not explicitly specified', () => {
      axios.get.mockReturnValue(mockAxiosResponse)
      process.env.AXIOS_TIMEOUT = 50000
      try {
        const res = axiosClient.get(mockUrl, mockCallback)
        expect(res).toEqual(mockAxiosResponse)
        expect(axios.get.mock.calls[0][0]).toBe(mockUrl)
        expect(axios.get.mock.calls[0][1]).toEqual({
          transformResponse: mockCallback,
          timeout: 50000
        })
      } catch (e) {
        console.error(`Problem running the test: ${e}`)
        expect(e).toBeUndefined()
      }
    })

    it('configures timeout when explicitly specified', () => {
      axios.get.mockReturnValue(mockAxiosResponse)
      process.env.AXIOS_TIMEOUT = 50000
      try {
        const res = axiosClient.get(mockUrl, mockCallback, { timeout: 7777 })
        expect(res).toEqual(mockAxiosResponse)
        expect(axios.get.mock.calls[0][0]).toBe(mockUrl)
        expect(axios.get.mock.calls[0][1]).toEqual({
          transformResponse: mockCallback,
          timeout: 7777
        })
      } catch (e) {
        console.error(`Problem running the test: ${e}`)
        expect(e).toBeUndefined()
      }
    })
  })

  describe('when getAsStream() method gets invoked', () => {
    it('returns response payload as a stream', () => {
      axios.get.mockReturnValue(mockAxiosStreamResponse)
      const res = axiosClient.getAsStream(mockUrl, mockCallback)
      expect(res).toEqual(mockAxiosStreamResponse)
      expect(axios.get.mock.calls[0][0]).toBe(mockUrl)
      expect(axios.get.mock.calls[0][1]).toEqual({
        responseType: 'stream',
        transformResponse: mockCallback,
        timeout: AXIOS_DEFAULT_TIMEOUT
      })
    })
  })

  describe('when passthrough functionality gets invoked', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })
    it('sends request and returns response as-is', async () => {
      const axiosRespponse = {
        headers: {
          'content-type': 'multipart/form-data'
        },
        data: 'Sam I am',
        status: 200
      }
      axios.mockResolvedValue(axiosRespponse)
      const event = {
        headers: { 'content-type': 'mickey/mouse' },
        body: 'I am Sam',
        requestContext: {
          http: {
            method: 'POST'
          }
        }
      }
      const res = await axiosClient.passThroughLambdaEvent(mockUrl, event)
      expect(axios.mock.calls[0][0]).toEqual({
        method: event.requestContext.http.method,
        headers: event.headers,
        url: mockUrl,
        data: event.body
      })
      expect(res).toEqual({
        body: axiosRespponse.data,
        headers: axiosRespponse.headers,
        statusCode: axiosRespponse.status
      })
    })

    it('handles unexpected errors', async () => {
      const errMsg = 'TEST: This is a fake error message'
      axios.mockRejectedValue(errMsg)
      const res = await axiosClient.passThroughLambdaEvent(mockUrl, {
        requestContext: {
          http: {}
        }
      })
      expect(res).toEqual({
        body: errMsg,
        statusCode: 500
      })
    })
  })
})
