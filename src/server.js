require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')

const album = require('./api/album')
const AlbumService = require('./services/album')
const AlbumValidator = require('./validator/album')
const song = require('./api/song')
const SongService = require('./services/song')
const SongValidator = require('./validator/song')
const ClientError = require('./exceptions/clientError')
const users = require('./api/user')
const UsersService = require('./services/user')
const UsersValidator = require('./validator/user')
const auth = require('./api/authentication')
const AuthService = require('./services/authentication')
const AuthValidator = require('./validator/authentication')
const TokenManager = require('./tokenize/TokenManager')

const init = async () => {
  const albumService = new AlbumService()
  const songService = new SongService()
  const usersService = new UsersService()
  const authService = new AuthService()

  // init server
  const server = Hapi.server({
    port: process.env.PORT ? process.env.PORT : 9000,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  // register plugin jwt
  await server.register([
    {
      plugin: Jwt
    }
  ])

  // setup auth strategy
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: artifacts => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

  // register custom plugins
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
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator
      }
    },
    {
      plugin: auth,
      options: {
        usersService,
        authenticationsService: authService,
        tokenManager: TokenManager,
        validator: AuthValidator
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
