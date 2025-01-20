const Joi = require('joi');
 
const CreateEditAlbumSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required()
});
 
module.exports = { CreateEditAlbumSchema };