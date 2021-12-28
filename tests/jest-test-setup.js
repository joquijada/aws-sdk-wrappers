const mockStream = jest.requireActual('stream')
const mockUtil = jest.requireActual('util')

jest.mock('stream', () => {
  mockStream.PassThrough = jest.fn(() => ({
    transform: jest.fn()
  }))
  return mockStream
})

global.promisifiedPipelineMock = jest.fn()

jest.mock('util', () => {
  const origPromisifyFunc = mockUtil.promisify
  mockUtil.promisify = jest.fn(module => {
    if (module.name === 'pipeline') {
      return global.promisifiedPipelineMock
    } else {
      return origPromisifyFunc(module)
    }
  })
  return mockUtil
})
