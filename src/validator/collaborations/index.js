const ClientError = require('../../exceptions/clientError')
const { ReqPayloadCollabSchema } = require('./schema')

const CollaborationValidator = {
  validateRequestPayload: payload => {
    const validationResult = ReqPayloadCollabSchema.validate(payload)
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message)
    }
  }
}

module.exports = CollaborationValidator
