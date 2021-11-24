const HttpResponse = require('../../lib/http-response')
describe('http-response', () => {
  it('generates correct AWS APIG format', () => {
    const res = new HttpResponse(200, 'my message', { name: 'value' })
    expect(res.toAwsApiGatewayFormat()).toEqual({
      statusCode: 200,
      body: JSON.stringify({ message: 'my message', name: 'value' }, null, ' ')
    })
  })

  it('excludes "message" property when emppty', () => {
    const res = new HttpResponse(200, '', { name: 'value' })
    expect(res.toAwsApiGatewayFormat()).toEqual({
      statusCode: 200,
      body: JSON.stringify({ name: 'value' }, null, ' ')
    })
  })

  it('includes "headers" and "cookies" if present and set', () => {
    const res = new HttpResponse(200, '', { name: 'value', headers: { hdr1: 'hdr val' }, cookies: ['cookie 1'] })
    expect(res.toAwsApiGatewayFormat()).toEqual({
      statusCode: 200,
      headers: { hdr1: 'hdr val' },
      cookies: ['cookie 1'],
      body: JSON.stringify({ name: 'value' }, null, ' ')
    })
  })
})
