const PlaylistHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, { service, songService, validator }) => {
    const playlistHandler = new PlaylistHandler(service, songService, validator)
    server.route(routes(playlistHandler))
  }
}
