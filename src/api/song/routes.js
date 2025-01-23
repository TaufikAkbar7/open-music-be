const routes = handler => [
  {
    method: 'POST',
    path: '/songs',
    handler: (request, h) => handler.createSong(request, h)
  },
  {
    method: 'GET',
    path: '/songs',
    handler: (request, h) => handler.getSongs(request, h)
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: (request, h) => handler.getSong(request, h)
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: (request, h) => handler.updateSong(request, h)
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: (request, h) => handler.deleteSong(request, h)
  }
]

module.exports = routes
