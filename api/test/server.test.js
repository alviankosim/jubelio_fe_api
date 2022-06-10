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

  // testing list product
  lab.test('GET /products successful', async () => {
    const options = {
      method: 'GET',
      url: '/products?page=1'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    Code.expect(response.result?.data).to.be.an.array();
    Code.expect(response.result?.data?.[0]).to.be.an.object();
    Code.expect(response.result?.data?.[0]).to.include(['id', 'name', 'sku', 'price', 'description', 'product_no', 'images']);
  })
})
