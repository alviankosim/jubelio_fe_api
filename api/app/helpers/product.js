const path = require('path')
const { DateTime } = require('luxon')
const fsp = require('fs/promises')
const mime = require('mime/lite')
const { PROD_IMG_PREFIX } = require('../../config/constants')

exports.handleDeleteImage = async (images, baseDirectory) => {
  try {
    for (const key in images) {
      if (Object.hasOwnProperty.call(images, key)) {
        const image = images[key]

        const filename = extractFileNameFromURL(image)
        const deleting = await fsp.unlink(path.join(baseDirectory, 'public/uploads', filename))
      }
    }

    return true
  } catch (error) {
    return error?.message
  }
}

const extractFileNameFromURL = (url) => {
  const segments = new URL(url).pathname.split('/')
  const last = segments.pop() || segments.pop() // Handle potential trailing slash

  return last
}

exports.handleMoveImage = async (request) => {
  let imagesList = []
  let moving = []

  if (Array.isArray(request.payload.images)) {
    imagesList = request.payload.images.map(img => ({ path: img.path, type: img.headers['content-type'] }))
  } else {
    if (request.payload?.images?.path) {
      imagesList = [{ path: request.payload.images.path, type: request.payload.images.headers['content-type'] }]
    }
  }

  moving = await moveImage(imagesList, path.join(request.server.app.baseDirectory, 'public/uploads'))

  return moving
}

const moveImage = async (images, destination) => {
  const allowedExtension = ['jpg', 'jpeg', 'png']

  try {
    // checking for the extensions
    images.forEach(singleImage => {
      const extension = mime.getExtension(singleImage.type)
      if (!allowedExtension.includes(extension)) {
        throw new Error('Please choose jpg or png image type.')
      }
    })

    // copying
    let results = []
    for (const key in images) {
      if (Object.hasOwnProperty.call(images, key)) {
        const singleImage = images[key]
        const fileName = `${PROD_IMG_PREFIX}${(DateTime.now().toMillis())}.${mime.getExtension(singleImage.type)}`
        const copying = await fsp.copyFile(singleImage.path, path.join(destination, fileName))

        results = [...results, fileName]
      }
    }

    return results
  } catch (error) {
    return error?.message
  }
}
