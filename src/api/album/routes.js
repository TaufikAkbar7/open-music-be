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
  },
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: (request, h) => handler.addAlbumCover(request, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        parse: true,
        maxBytes: 1000 * 1000 * 5
      }
    }
  }
]

module.exports = routes
