const routes = handler => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (request, h) => handler.addPlaylist(request, h),
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.addSongToPlaylist(request, h),
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (request, h) => handler.getAllPlaylists(request, h),
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.getSongByPlaylists(request, h),
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: (request, h) => handler.voidPlaylist(request, h),
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.voidSongByPlaylists(request, h),
    options: {
      auth: 'openmusic_jwt'
    }
  }
]

module.exports = routes
