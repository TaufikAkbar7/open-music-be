const routes = handler => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.createSong
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getSongs
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getSong
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.updateSong
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteSong
  }
]

module.exports = routes
