const Product = require('../../../models/product')

const HapiUrl = require('hapi-url')

const { UPLOAD_ERROR } = require('../../../../config/constants')
const { handleMoveImage } = require('../../../helpers/product')
const { getErrorMessage } = require('../../../../lib/database')

exports.editProduct = {
  description: 'Edit Product API',
  auth: false,
  payload: {
    maxBytes: 5 * 1048576, // 5MB
    output: 'file',
    parse: true,
    multipart: true
  },
  handler: async (request, h) => {
    let data = {
      status: false,
      code: 'ERR',
      message: 'Something is error'
    }

    try {
      const productID = request.params.id

      // handle new images, moving to main directory, returning arr of images
      const moving = await handleMoveImage(request)
      if (typeof moving === 'string') {
        data.code = UPLOAD_ERROR
        data.message = moving

        throw new Error('Error')
      }

      const imgLocation = HapiUrl.resolve(request, 'uploads')
      const singleProduct = {
        name: request.payload?.name,
        sku: request.payload?.sku,
        price: request.payload?.price,
        description: request.payload?.description,
        images: moving.map(singleImage => (`${imgLocation}/${singleImage}`))
      }

      let updatedProduct = singleProduct;
      if (Product.isValidProduct(singleProduct)) {
          // inserting to database
          await updateProductToDB(singleProduct, productID);
          fetchUpdatedProduct = await Product.getProductByID(productID);
          if (fetchUpdatedProduct[0]?.images) {
              updatedProduct = fetchUpdatedProduct[0];
          }
      }

      data = {
          status : true,
          code   : 'SUCCESS',
          message: 'Successfully edit product',
          data   : updatedProduct
      }

      return data
    } catch (error) {
      if (error?.message) {
        data.message = error.message
      }
      return h.response(data).code(500)
    }
  },
  tags: ['api']
}

const updateProductToDB = async (singleProduct, productID) => {
  try {
    const result = await Product.updateProduct(singleProduct, productID)
    console.log({ result })
  } catch (error) {
    const errorToThrow = new Error()
    errorToThrow.message = getErrorMessage(error?.code)

    throw errorToThrow
  }
}
