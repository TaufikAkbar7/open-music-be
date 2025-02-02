const ClientError = require('../../exceptions/clientError')
const { CreateEditAlbumSchema, CoverAlbumSchema } = require('./schema')

const AlbumValidator = {
  validateCreateEditRequest: payload => {
    const validationResult = CreateEditAlbumSchema.validate(payload)
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message)
    }
  },
  validateCoverAlbumHeader: header => {
    const validationResult = CoverAlbumSchema.validate(header)
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message)
    }
  }
}

module.exports = AlbumValidator
