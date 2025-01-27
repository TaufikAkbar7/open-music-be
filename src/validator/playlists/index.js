const ClientError = require('../../exceptions/clientError')
const { CreatePlaylistSchema, AddSongPlaylistSchema } = require('./schema')

const PlaylistsValidator = {
  validateCreateRequest: payload => {
    const validationResult = CreatePlaylistSchema.validate(payload)
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message)
    }
  },
  validateAddSongRequest: payload => {
    const validationResult = AddSongPlaylistSchema.validate(payload)
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message)
    }
  }
}

module.exports = PlaylistsValidator
