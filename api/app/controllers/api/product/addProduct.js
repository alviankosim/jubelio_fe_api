const Product = require("../../../models/product");

const HapiUrl = require('hapi-url');

const { UPLOAD_ERROR } = require("../../../../config/constants");
const { handleMoveImage } = require("../../../helpers/product");
const { getErrorMessage } = require("../../../../lib/database");

exports.addProduct = {
    description: 'Add New Product API',
    auth: false,
    payload: {
        maxBytes: 5 * 1048576,//5MB
        output: 'file',
        parse: true,
        multipart: true
    },
    handler: async (request, h) => {
        let data = {
            status: false,
            code: 'ERR',
            message: 'Something is error'
        };

        try {
            // moving to main directory, returning arr of images
            let moving = await handleMoveImage(request);
            if (typeof moving == 'string') {
                data.code = UPLOAD_ERROR;
                data.message = moving;

                throw new Error('Error');
            }

            let imgLocation = HapiUrl.resolve(request, "uploads");
            let singleProduct = {
                name       : request.payload?.name,
                sku        : request.payload?.sku,
                price      : request.payload?.price,
                description: request.payload?.description,
                images     : moving.map(singleImage => (`${imgLocation}/${singleImage}`)),
            };

            let insertedProduct = singleProduct;
            if (Product.isValidProduct(singleProduct, {images: true})) {
                // inserting to database
                const inserting = await insertProductToDB(singleProduct);
                fetchInsertedProduct = await Product.getProductByID(inserting[0].id);
                if (fetchInsertedProduct[0]?.images) {
                    insertedProduct = fetchInsertedProduct[0];
                }
            } else {
                data.message = 'Please make sure all the data is valid';
            }

            data = {
                status : true,
                code   : 'SUCCESS',
                message: 'Successfully add new product',
                data   : singleProduct
            }

            return data;

        } catch (error) {
            if (error?.message) {
                data.message = error.message;
            }
            return h.response(data).code(500);
        }
    },
    tags: ['api']
};

const insertProductToDB = async (singleProduct) => {
    try {
        const product = new Product(singleProduct);
        const result = await product.createProduct();

        return result;

    } catch (error) {
        const errorToThrow = new Error();
        errorToThrow.message = getErrorMessage(error?.code);

        throw errorToThrow;
    }
}