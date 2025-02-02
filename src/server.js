require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const amqp = require('amqplib')
const Inert = require('@hapi/inert')
const path = require('path')
const ClientError = require('./exceptions/clientError')

const album = require('./api/album')
const AlbumService = require('./services/album')
const AlbumValidator = require('./validator/album')

const song = require('./api/song')
const SongService = require('./services/song')
const SongValidator = require('./validator/song')

const users = require('./api/user')
const UsersService = require('./services/user')
const UsersValidator = require('./validator/user')

const auth = require('./api/authentication')
const AuthService = require('./services/authentication')
const AuthValidator = require('./validator/authentication')
const TokenManager = require('./tokenize/TokenManager')

const playlists = require('./api/playlists')
const PlaylistsService = require('./services/playlists')
const PlaylistsValidator = require('./validator/playlists')

const collaborations = require('./api/collaborations')
const CollaborationsService = require('./services/collaborations')
const CollaborationsValidator = require('./validator/collaborations')

const _exports = require('./api/exports')
const ProducerService = require('./services/rabbitmq/producterService')
const ExportsValidator = require('./validator/exports')

const ListenerService = require('./services/rabbitmq/listenerService')
const MailtrapService = require('./services/mailtrap')

const uploads = require('./api/upload')
const StorageService = require('./services/storage')

const init = async () => {
  const albumService = new AlbumService()
  const songService = new SongService()
  const usersService = new UsersService()
  const authService = new AuthService()
  const playlistsService = new PlaylistsService()
  const collaborationsService = new CollaborationsService()
  const mailtrapService = new MailtrapService()
  const listenerService = new ListenerService(playlistsService, mailtrapService)
  const storageService = new StorageService(
    path.resolve(__dirname, 'assets/uploads/images')
  )

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

  // register plugin eksternal
  await server.register([
    {
      plugin: Jwt
    },
    {
      plugin: Inert
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
        storageService,
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
    },
    {
      plugin: playlists,
      options: {
        songService,
        service: playlistsService,
        validator: PlaylistsValidator
      }
    },
    {
      plugin: collaborations,
      options: {
        playlistsService,
        service: collaborationsService,
        validator: CollaborationsValidator
      }
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        playlistService: playlistsService,
        validator: ExportsValidator
      }
    },
    {
      plugin: uploads
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

    // handle error authentication
    if (
      response instanceof Error &&
      response.output &&
      response.output.statusCode === 401
    ) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message
      })
      newResponse.code(401)
      return newResponse
    }

    // handle error from server
    if (
      response instanceof Error &&
      response.output &&
      response.output.statusCode === 500
    ) {
      const newResponse = h.response({
        status: 'error',
        message: response.message
      })
      newResponse.code(500)
      return newResponse
    }

    return h.continue
  })

  // listener mq
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER)
  const channel = await connection.createChannel()

  await channel.assertQueue('export:playlists', {
    durable: true
  })

  channel.consume('export:playlists', listenerService.getMessagePlaylist, {
    noAck: true
  })

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

init()
