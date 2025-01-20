const { CreateEditAlbumSchema } = require('./schema');
 
const AlbumValidator = {
  validateCreateEditRequest: (payload) => {
    const validationResult = CreateEditAlbumSchema.validate(payload);
    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  },
};
 
module.exports = AlbumValidator;