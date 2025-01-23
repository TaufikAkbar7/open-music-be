const routes = handler => [
  {
    method: 'POST',
    path: '/albums',
    handler: (request, h) => handler.createAlbum(request, h)
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (request, h) => handler.getAlbum(request, h)
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (request, h) => handler.updateAlbum(request, h)
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (request, h) => handler.deleteAlbum(request, h)
  }
]

module.exports = routes
