const Product = require('../../../models/product')

const HapiUrl = require('hapi-url')

const { UPLOAD_ERROR } = require('../../../../config/constants')
const { handleMoveImage, handleDeleteImage } = require('../../../helpers/product')
const { getErrorMessage } = require('../../../../lib/database')

exports.deleteProductImage = {
  description: 'Delete Product Image API',
  auth: false,
  handler: async (request, h) => {
    let data = {
      status: false,
      code: 'ERR',
      message: 'Something is error'
    }

    try {
      const productID = request.params.id

      await deleteProductImageFromDB(productID, request)

      data = {
        status: true,
        code: 'SUCCESS',
        message: 'Successfully delete product image',
        data: productID
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

const deleteProductImageFromDB = async (imageID, request) => {
  try {
    const result = await Product.deleteProductImageByID(imageID)

    // delete returning list image names
    if (result?.[0]?.images) {
      const imagesList = result[0].images
      await handleDeleteImage(imagesList, request.server.app.baseDirectory)
    }
  } catch (error) {
    const errorToThrow = new Error()
    errorToThrow.message = getErrorMessage(error?.code)

    throw errorToThrow
  }
}
