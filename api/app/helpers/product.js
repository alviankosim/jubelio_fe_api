const path = require('path'),
      { DateTime } = require("luxon"),
      fsp = require('fs/promises'),
      mime = require('mime/lite'),
      { PROD_IMG_PREFIX } = require('../../config/constants');

exports.handleDeleteImage = async (images, baseDirectory) => {
    try {
        for (const key in images) {
            if (Object.hasOwnProperty.call(images, key)) {
                const image = images[key];

                let filename = extractFileNameFromURL(image);
                let deleting = await fsp.unlink(path.join(baseDirectory, 'public/uploads', filename));
            }
        }

        return true;
    } catch (error) {
        return error?.message;
    }
}

const extractFileNameFromURL = (url) => {
    
    const segments = new URL(url).pathname.split('/');
    const last = segments.pop() || segments.pop(); // Handle potential trailing slash
    
    return last;
}

exports.handleMoveImage = async (request) => {
    let imagesList = [];
    let moving = [];

    if (Array.isArray(request.payload.images)) {
        imagesList = request.payload.images.map(img => ({ path: img.path, type: img.headers['content-type'] }));
    } else {
        if (request.payload?.images?.path) {
            imagesList = [{ path: request.payload.images.path, type: request.payload.images.headers['content-type'] }];
        }
    }

    moving = await moveImage(imagesList, path.join(request.server.app.baseDirectory, 'public/uploads'));
    
    return moving;
}

const moveImage =  async (images, destination) => {
    let allowedExtension = ['jpg', 'jpeg', 'png'];

    try {
        // checking for the extensions
        images.forEach(singleImage => {
            let extension = mime.getExtension(singleImage.type);
            if (!allowedExtension.includes(extension)) {
                throw new Error('Please choose jpg or png image type.')
            }
        });

        // copying
        let results = [];
        for (const key in images) {
            if (Object.hasOwnProperty.call(images, key)) {
                const singleImage = images[key];
                let fileName = `${PROD_IMG_PREFIX}${(DateTime.now().toMillis())}.${mime.getExtension(singleImage.type)}`;
                let copying = await fsp.copyFile(singleImage.path, path.join(destination, fileName));

                results = [...results, fileName];
            }
        }

        return results;
    } catch (error) {
        return error?.message;
    }
}