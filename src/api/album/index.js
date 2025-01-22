const AlbumHandler = require('./handler')
const routes = require('./routes')
const ClientError = require('../../exceptions/clientError')

module.exports = {
  name: 'album',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const albumHandler = new AlbumHandler(service, validator)
    server.route(routes(albumHandler))

    server.ext('onPreResponse', (request, h) => {
      const { response } = request

      if (response instanceof ClientError || response.isClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        })
        newResponse.code(response.statusCode)
        return newResponse
      }

      // handle if params id not uuid
      if (
        response.routine === 'string_to_uuid' &&
        response.severity === 'ERROR'
      ) {
        const newResponse = h.response({
          status: 'fail',
          message: 'Data tidak ditemukan'
        })
        newResponse.code(404)
        return newResponse
      }

      // handle error message on server
      if (response instanceof Error) {
        const newResponse = h.response({
          status: 'error',
          message: response.message
        })
        newResponse.code(500)
        return newResponse
      }

      return h.continue
    })
  }
}
