require('dotenv').config();

const Hapi = require('@hapi/hapi')
const album = require('./api/album')
const AlbumService = require('./services/album')
const AlbumValidator = require('./validator/album')
const song = require('./api/song')
const SongService = require('./services/song')
const SongValidator = require('./validator/song')

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();

  const server = Hapi.server({
    port: process.env.PORT ?? 9000,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  await server.register([
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumValidator
      },
    },
    {
      plugin: song,
      options: {
        service: songService,
        validator: SongValidator
      },
    }
  ]);

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

init()
