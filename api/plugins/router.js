const routes = [].concat(
    require('../app/routes/index')
)

module.exports = {
    plugin: {
        name: 'router',
        register: (server, options) => {
            server.route(routes)
        }
    }
}
