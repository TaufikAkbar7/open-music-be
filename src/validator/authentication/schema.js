const Joi = require('joi')

const LoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
})

const RefreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
})

module.exports = { LoginSchema, RefreshTokenSchema }
