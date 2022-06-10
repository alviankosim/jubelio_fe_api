const webapi = require('./webApi')

const staticFiles = {
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true
        }
    }
};

module.exports = [].concat(webapi, staticFiles)