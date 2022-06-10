const { getAllProduct } = require('../../../models/product')

exports.productList = {
  description: 'Product List API',
  auth: false,
  handler: async (request, h) => {
    let data = {
      status: false,
      code: 'ERR',
      message: 'Something is error'
    }

    const { page } = request.query

    try {
      const products = await getAllProduct(page)
      const productsNext = await getAllProduct(parseInt(page) + 1, true)

      data = {
        status: true,
        code: 'SUCCESS',
        message: 'Successfully fetch product',
        data: products,
        hasMore: (productsNext.length > 0)
      }

      return data
    } catch (error) {
      return h.response(data).code(500)
    }
  },
  tags: ['api']
}
