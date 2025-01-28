const Joi = require('joi')

const ReqPayloadCollabSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required()
})

module.exports = { ReqPayloadCollabSchema }
