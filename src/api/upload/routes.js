const path = require('path')

const routes = () => [
  {
    method: 'GET',
    path: '/upload/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, '../../assets/uploads/images')
      }
    }
  }
]

module.exports = routes
