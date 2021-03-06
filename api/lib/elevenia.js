const Product = require('../app/models/product')
const { PG_UNIQUE_EXIST } = require('../config/constants')
const axios = require('axios').default
const { ELEVENIA_API_KEY, ELEVENIA_API_BASE_URL } = process.env
const parseString = require('xml2js').parseString

const sleep = ms => new Promise(r => setTimeout(r, ms))

const parseStringAwait = async (response) => {
  const json = await new Promise((resolve, reject) => {
    parseString(response.data, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })

  return json
}

const initProduct = async () => {
  // doing fetch until its limit reached
  let needFetch = true
  const timeDelay = 5
  let ii = 1
  const defaultLimit = 50

  while (needFetch && ii <= defaultLimit) {
    const fetchStatus = await fetchProduct(ii)
    if (!fetchStatus) {
      needFetch = false
    }
    ii++

    await sleep(timeDelay * 1000)
  }
}
module.exports.initProduct = initProduct

const fetchProduct = async (pageNo) => {
  const config = {
    headers: {
      openapikey: ELEVENIA_API_KEY
    }
  }

  try {
    const response = await axios.get(`${ELEVENIA_API_BASE_URL}rest/prodservices/product/listing?page=${pageNo}`, config)
    const result = await parseStringAwait(response)

    const prodResult = result?.Products?.product
    if (Array.isArray(prodResult)) {
      prodResult.forEach(item => {
        fetchProductDetail(item?.prdNo?.[0])
      })
      return true
    } else {
      console.log('Not array of product')
      return false
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

// fetch detail and insert to db
const fetchProductDetail = async (productNo) => {
  const config = {
    headers: {
      openapikey: ELEVENIA_API_KEY
    }
  }

  try {
    const response = await axios.get(`${ELEVENIA_API_BASE_URL}rest/prodservices/product/details/${productNo}`, config)
    const result = await parseStringAwait(response)

    const parsedProduct = result?.Product

    const singleProduct = {
      product_no: parsedProduct?.prdNo[0],
      name: parsedProduct?.prdNm[0],
      sku: parsedProduct?.sellerPrdCd[0],
      price: parsedProduct?.selPrc[0],
      description: parsedProduct?.htmlDetail[0],
      images: []
    }

    // checking 5 images existence
    for (let index = 1; index <= 5; index++) {
      if (parsedProduct?.[`prdImage0${index}`]?.[0]) {
        const daImg = parsedProduct?.[`prdImage0${index}`]?.[0]
        singleProduct.images = [...singleProduct.images, daImg]
      }
    }

    if (Product.isValidProduct(singleProduct, { product_no: true, images: true })) {
      //  inserting to database
      insertProductToDB(singleProduct)
    }
  } catch (error) {
    console.log(error)
  }
}

const insertProductToDB = async (singleProduct) => {
  try {
    const product = new Product(singleProduct)
    const result = await product.createProduct()
  } catch (error) {
    const errorToThrow = new Error()
    switch (error?.code) {
      // unique error response from postgres
      case PG_UNIQUE_EXIST:
        errorToThrow.message = 'Product already exists'
        console.log('sku duplikat:' + singleProduct.sku)
        break
      default:
    }

    // just input to console, without interrupting anything
    console.log(errorToThrow)
  }
}
