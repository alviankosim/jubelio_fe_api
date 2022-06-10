const { getProductByID } = require('../../../models/product')

exports.productDetail = {
  description: 'Product Detail API',
  auth: false,
  handler: async (request, h) => {
    let data = {
      status: false,
      code: 'ERR',
      message: 'Something is error'
    }

    const id = request.params.id
    if (!id) {
      data.message = 'ID is required'
      throw new Error('Error')
    }

    try {
      const product = await getProductByID(id)
      data = {
        status: true,
        code: 'SUCCESS',
        message: 'Successfully fetch product',
        data: product?.[0]
      }

      return data
    } catch (error) {
      return h.response(data).code(500)
    }
  },
  tags: ['api']
}
