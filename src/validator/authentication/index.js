const ClientError = require('../../exceptions/clientError')
const { LoginSchema, RefreshTokenSchema } = require('./schema')

const AuthValidator = {
  validateLoginRequest: payload => {
    const validationResult = LoginSchema.validate(payload)
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message)
    }
  },
  validateRefreshTokenRequest: payload => {
    const validationResult = RefreshTokenSchema.validate(payload)
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message)
    }
  }
}

module.exports = AuthValidator
