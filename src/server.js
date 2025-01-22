require('dotenv').config()

const Hapi = require('@hapi/hapi')
const album = require('./api/album')
const AlbumService = require('./services/album')
const AlbumValidator = require('./validator/album')
const song = require('./api/song')
const SongService = require('./services/song')
const SongValidator = require('./validator/song')
const ClientError = require('./exceptions/clientError')

const init = async () => {
  const albumService = new AlbumService()
  const songService = new SongService()

  const server = Hapi.server({
    port: process.env.PORT ? process.env.PORT : 9000,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumValidator
      }
    },
    {
      plugin: song,
      options: {
        service: songService,
        validator: SongValidator
      }
    }
  ])

  // custom global errors
  server.ext('onPreResponse', (request, h) => {
    const { response } = request

    // handle error from client
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

    // handle error from server
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

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

init()
