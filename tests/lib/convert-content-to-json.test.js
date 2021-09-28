const convertContentToJSON = require('../../lib/convert-content-to-json')
const cloneDeep = require('lodash.clonedeep')

const testMultiPartFormContent = {
  headers: { 'content-type': 'multipart/form-data; boundary=--------------------------902535600354793971983507' },
  body: multiPartFormData(),
  isBase64Encoded: true
}

const testUrlEncodedContent = {
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: 'Zmlyc3RfbmFtZT1Kb3NlJmxhc3RfbmFtZT1RdWlqYWRhJmFkZHJlc3MxPTY3MCUyMFN1bGxpdmFuJTIwVHJhaWwmY2l0eT1Mb25nJTIwUG9uZCZzdGF0ZT1QQSZwb3N0YWxfY29kZT0xODMzNCZjb3VudHJ5PVVTJm51bWJlcj00MTExMTExMTExMTExMTExJm1vbnRoPTA1JnllYXI9MjAyNSZjdnY9MTIzJmtleT1ld3IxLWp4VFpDVldzYjlBMHlsellOVlNEb1gmaW5zdGFuY2VJZD1TUzVEaGdYQmZEU3U3YWJr',
  isBase64Encoded: true
}

const expectedOutput = {
  first_name: 'Jose',
  last_name: 'Quijada',
  address1: '670 Sullivan Trail',
  city: 'Long Pond',
  state: 'PA',
  postal_code: '18334',
  country: 'US',
  number: '4111111111111111',
  month: '05',
  year: '2025',
  cvv: '123',
  key: 'ewr1-jxTZCVWsb9A0ylzYNVSDoX',
  instanceId: 'SS5DhgXBfDSu7abk'
}

describe('convert-content-to-json', () => {
  it('converts multipart/form-data content', () => {
    expect(convertContentToJSON(testMultiPartFormContent)).toEqual(expectedOutput)
  })

  it('converts application/x-www-form-urlencoded content', () => {
    expect(convertContentToJSON(testUrlEncodedContent)).toEqual(expectedOutput)
  })

  it('returns null if content type is not recognized', () => {
    const inputCopy = cloneDeep(testUrlEncodedContent)
    inputCopy.headers['content-type'] = 'text-plain'
    expect(convertContentToJSON(inputCopy)).toBeNull()
  })

  it('handles non-encoded content correctly', () => {
    const inputCopy = cloneDeep(testUrlEncodedContent)
    inputCopy.isBase64Encoded = false
    inputCopy.body = 'first_name=Jose&last_name=Quijada&address1=670%20Sullivan%20Trail&city=Long%20Pond&state=PA&postal_code=18334&country=US&number=4111111111111111&month=05&year=2025&cvv=123&key=ewr1-jxTZCVWsb9A0ylzYNVSDoX&instanceId=SS5DhgXBfDSu7abk'
    expect(convertContentToJSON(inputCopy)).toEqual(expectedOutput)
  })

  it('returns null when headers is absent', () => {
    const inputCopy = cloneDeep(testUrlEncodedContent)
    delete inputCopy.headers
    expect(convertContentToJSON(inputCopy)).toBeNull()
  })

  it('applies property transformer callback', () => {
    const expected = {}
    for (const prop of Object.keys(expectedOutput)) {
      expected[prop.toUpperCase()] = expectedOutput[prop]
    }
    expect(convertContentToJSON(testUrlEncodedContent, (str) => str.toUpperCase())).toEqual(expected)
  })
})

function multiPartFormData() {
  return 'LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTkwMjUzNTYwMDM1NDc5Mzk3MTk4MzUwNw0KQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPSJmaXJzdF9uYW1lIg0KDQpKb3NlDQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tOTAyNTM1NjAwMzU0NzkzOTcxOTgzNTA3DQpDb250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9Imxhc3RfbmFtZSINCg0KUXVpamFkYQ0KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTkwMjUzNTYwMDM1NDc5Mzk3MTk4MzUwNw0KQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPSJhZGRyZXNzMSINCg0KNjcwIFN1bGxpdmFuIFRyYWlsDQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tOTAyNTM1NjAwMzU0NzkzOTcxOTgzNTA3DQpDb250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9ImNpdHkiDQoNCkxvbmcgUG9uZA0KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTkwMjUzNTYwMDM1NDc5Mzk3MTk4MzUwNw0KQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPSJzdGF0ZSINCg0KUEENCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS05MDI1MzU2MDAzNTQ3OTM5NzE5ODM1MDcNCkNvbnRlbnQtRGlzcG9zaXRpb246IGZvcm0tZGF0YTsgbmFtZT0icG9zdGFsX2NvZGUiDQoNCjE4MzM0DQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tOTAyNTM1NjAwMzU0NzkzOTcxOTgzNTA3DQpDb250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9ImNvdW50cnkiDQoNClVTDQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tOTAyNTM1NjAwMzU0NzkzOTcxOTgzNTA3DQpDb250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9Im51bWJlciINCg0KNDExMTExMTExMTExMTExMQ0KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTkwMjUzNTYwMDM1NDc5Mzk3MTk4MzUwNw0KQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPSJtb250aCINCg0KMDUNCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS05MDI1MzU2MDAzNTQ3OTM5NzE5ODM1MDcNCkNvbnRlbnQtRGlzcG9zaXRpb246IGZvcm0tZGF0YTsgbmFtZT0ieWVhciINCg0KMjAyNQ0KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTkwMjUzNTYwMDM1NDc5Mzk3MTk4MzUwNw0KQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPSJjdnYiDQoNCjEyMw0KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTkwMjUzNTYwMDM1NDc5Mzk3MTk4MzUwNw0KQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPSJrZXkiDQoNCmV3cjEtanhUWkNWV3NiOUEweWx6WU5WU0RvWA0KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTkwMjUzNTYwMDM1NDc5Mzk3MTk4MzUwNw0KQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPSJpbnN0YW5jZUlkIg0KDQpTUzVEaGdYQmZEU3U3YWJrDQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tOTAyNTM1NjAwMzU0NzkzOTcxOTgzNTA3LS0NCg=='
}
