const jest = {
  automock: false,
  collectCoverage: true,
  coveragePathIgnorePatterns: [],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  // setupFilesAfterEnv: ["jest-extended"],
  verbose: true,
  setupFilesAfterEnv: [ './tests/jest-test-setup.js' ]
}

module.exports = jest
