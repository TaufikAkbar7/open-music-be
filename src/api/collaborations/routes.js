const routes = handler => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (request, h) => handler.addCollaboration(request, h),
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (request, h) => handler.deleteCollaboration(request, h),
    options: {
      auth: 'openmusic_jwt'
    }
  }
]

module.exports = routes
