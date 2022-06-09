const { addProduct } = require('../../controllers/api/product/addProduct')
const { deleteProduct } = require('../../controllers/api/product/deleteProduct')
const { deleteProductImage } = require('../../controllers/api/product/deleteProductImage')
const { editProduct } = require('../../controllers/api/product/editProduct')
const { productDetail } = require('../../controllers/api/product/productDetail')
const { productList } = require('../../controllers/api/product/productList')

module.exports = [
  { method: 'GET', path: '/products', config: productList },
  { method: 'POST', path: '/products', config: addProduct },
  { method: 'GET', path: '/products/{id}', config: productDetail },
  { method: 'PUT', path: '/products/{id}', config: editProduct },
  { method: 'DELETE', path: '/products/{id}', config: deleteProduct },
  { method: 'DELETE', path: '/products/images/{id}', config: deleteProductImage }
]
