'use strict';

// require dotenv
require('dotenv').config();

const Hapi = require('@hapi/hapi'),
      routes = require('./app/routes'),
      { initProduct } = require('./lib/elevenia'),
      path = require('path'),
      Inert = require('@hapi/inert');


// fetching product from elevenia API
initProduct();

const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: 'localhost',
    routes: {
        cors: true,
        files: {
            relativeTo: path.join(__dirname, 'public')
        }
    }
});

// file base directory
server.app.baseDirectory = __dirname;

// routes
server.route(routes);

// start server
const init = async () => {

    await server.register(Inert);

    // public files
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true
            }
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

// on error rejection
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();