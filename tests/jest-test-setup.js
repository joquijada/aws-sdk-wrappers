// Below are the real deal, hence reagrd them as such despite the deceiving prefix. Jest requires 'mock' prefix, else
// variables get rejected inside jest.mock() because of var un-init concerns on Jest part's.
const mockRealStream = jest.requireActual('stream')

// We do this to store a reference to the current Readable object in order to have
// a 'this' context that can be bound to the NodeJS Readable Stream API methods when mocking, spying, etc.
class mockReadable extends mockRealStream.Readable {
  constructor(opts) {
    super(opts)
    global.Readable = this
  }
}

global.writableCallback = jest.fn(() => {})

// To invoke our Jest mock and the Writeable API callback as ewell
const callbackWrapper = (cb) => {
  return () => {
    global.writableCallback()
    cb && cb()
  }
}

// Rig the Writable with a Jest mock to count number of
// calls to the Writable OOTB callback
class mockWritable extends mockRealStream.Writable {
  write(chunk, encoding, cb) {
    super.write(chunk, encoding, callbackWrapper(cb))
  }
}

global.PassThrough = {
  transform: jest.fn()
}
jest.mock('stream', () => {
  mockRealStream.PassThrough = jest.fn(() => global.PassThrough)
  mockRealStream.Readable = mockReadable
  mockRealStream.Writable = mockWritable
  return mockRealStream
})
