const routes = handler => [
  {
    method: 'POST',
    path: '/users',
    handler: (request, h) => handler.createUser(request, h)
  }
]

module.exports = routes
