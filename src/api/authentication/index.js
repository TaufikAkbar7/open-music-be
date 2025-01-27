const AuthHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'auth',
  version: '1.0.0',
  register: async (
    server,
    { authenticationsService, usersService, tokenManager, validator }
  ) => {
    const authenticationsHandler = new AuthHandler(
      authenticationsService,
      usersService,
      tokenManager,
      validator
    )
    server.route(routes(authenticationsHandler))
  }
}
