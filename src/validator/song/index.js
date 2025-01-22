const ClientError = require('../../exceptions/clientError');
const { CreateEditSongSchema } = require('./schema');
 
const SongValidator = {
  validateCreateEditRequest: (payload) => {
    const validationResult = CreateEditSongSchema.validate(payload);
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message);
    }
  },
};
 
module.exports = SongValidator;