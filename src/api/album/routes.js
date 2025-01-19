const routes = [
    {
      method: 'POST',
      path: '/books',
      handler: createEditBooks
    },
    {
      method: 'GET',
      path: '/books',
      handler: getBooks
    },
    {
      method: ['GET', 'PUT', 'DELETE'],
      path: '/books/{bookId}',
      handler: (req, h) => {
        switch (req.method) {
          case 'get':
            return getBooks(req, h)
          case 'put':
            return createEditBooks(req, h)
          case 'delete':
            return deleteBooks(req, h)
          default:
            return
        }
      }
    }
  ]
  
  module.exports = routes