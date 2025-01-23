const ClientError = require('../../exceptions/clientError')
const { CreateUserSchema } = require('./schema')

const UserValidator = {
  validateCreateUserRequest: payload => {
    const validationResult = CreateUserSchema.validate(payload)
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message)
    }
  }
}

module.exports = UserValidator
