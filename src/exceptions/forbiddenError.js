const ClientError = require('./clientError')

class ForbiddenError extends ClientError {
  constructor(message) {
    super(message, 403)
    this.name = 'ForbiddenError'
  }
}

module.exports = ForbiddenError
