const Joi = require('joi')

const CreatePlaylistSchema = Joi.object({
  name: Joi.string().required()
})

const AddSongPlaylistSchema = Joi.object({
  songId: Joi.string().required()
})

module.exports = { CreatePlaylistSchema, AddSongPlaylistSchema }
