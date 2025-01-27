const routes = handler => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (request, h) => handler.authLogin(request, h)
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: (request, h) => handler.authRefreshToken(request, h)
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: (request, h) => handler.authDeleteRefreshToken(request, h)
  }
]

module.exports = routes
