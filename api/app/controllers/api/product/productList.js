const { getAllProduct } = require("../../../models/product");

exports.productList = {
    description: 'Product List API',
    auth: false,
    handler: async (request, h) => {
        let data = {
            status : false,
            code   : 'ERR',
            message: 'Something is error'
        };
        
        let { page } = request.query;

        try {
            let products = await getAllProduct(page);
            let productsNext = await getAllProduct(parseInt(page) + 1, true);
            
            data = {
                status : true,
                code   : 'SUCCESS',
                message: 'Successfully fetch product',
                data   : products,
                hasMore: (productsNext.length > 0 ? true : false)
            }

            return data;
        } catch (error) {
            return h.response(data).code(500)
        }
    },
    tags: ['api']
};