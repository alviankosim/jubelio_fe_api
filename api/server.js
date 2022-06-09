'use strict'

// require dotenv
require('dotenv').config()

const Hapi = require('@hapi/hapi')
const { initProduct } = require('./lib/elevenia')
const path = require('path')

// fetching product from elevenia API
// initProduct();

// start server
const createServer = async () => {

    const server = Hapi.server({
        port: process.env.PORT || 8080,
        host: 'localhost',
        routes: {
            cors: true,
            files: {
                relativeTo: path.join(__dirname, 'public')
            }
        }
    })

    // file base directory
    server.app.baseDirectory = __dirname

    // plugins
    await server.register(require('@hapi/inert'))
    await server.register(require('blipp'))
    await server.register(require('./plugins/router'))

    return server
}

// on error rejection
createServer()
    .then(server => {
        server.start()
        console.log(`Server running at: ${server.info.uri}`)
    })
    .catch(err => {
        console.log(err)
        process.exit(1)
    })

module.exports = createServer
