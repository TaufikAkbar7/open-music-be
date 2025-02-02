const routes = require('./routes')

module.exports = {
  name: 'upload',
  version: '1.0.0',
  register: async server => {
    server.route(routes())
  }
}
