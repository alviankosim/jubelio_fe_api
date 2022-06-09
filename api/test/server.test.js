const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const createServer = require('../server')

lab.experiment('API test', () => {
  let server

  // Create server before each test
  lab.before(async () => {
    server = await createServer()
  })

  lab.test('GET /products successful', async () => {
    const options = {
      method: 'GET',
      url: '/products'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(500)
    // Code.expect(response.result).to.equal({ hello: 'world' })
  })
})
