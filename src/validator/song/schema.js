const Joi = require('joi')

const CreateEditSongSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  albumId: Joi.string().required(),
  duration: Joi.number().required()
})

module.exports = { CreateEditSongSchema }
