const ClientError = require('../../exceptions/clientError')

class PlaylistsHandler {
  constructor(services, songService, validator) {
    this._service = services
    this._songService = songService
    this._validator = validator
  }

  async addPlaylist(req, res) {
    this._validator.validateCreateRequest(req.payload)
    const { name } = req.payload
    const { id: credentialId } = req.auth.credentials

    const id = await this._service.addPlaylist({ name, ownerId: credentialId })
    const response = res.response({
      status: 'success',
      data: {
        playlistId: id
      }
    })
    response.code(201)
    return response
  }

  async addSongToPlaylist(req, res) {
    const { songId } = req.payload
    const { id } = req.params
    const { id: credentialId } = req.auth.credentials

    if (!id) {
      throw new ClientError('Required params playlist id')
    }
    this._validator.validateAddSongRequest(req.payload)

    await this._songService.getSong(songId)
    await this._service.verifyPlaylistCollab({
      playlistId: id,
      owner: credentialId
    })
    await this._service.addSongOnPlaylist({ playlistId: id, songId })
    await this._service.addPlaylistActivity({
      playlistId: id,
      songId,
      userId: credentialId,
      action: 'add'
    })
    const response = res.response({
      status: 'success',
      message: 'Berhasil menambahkan lagu dari playlist'
    })
    response.code(201)
    return response
  }

  async getAllPlaylists(req, res) {
    const { id: credentialId } = req.auth.credentials
    const data = await this._service.getPlaylists(credentialId)
    const response = res.response({
      status: 'success',
      data: {
        playlists: data
      }
    })
    response.code(200)
    return response
  }

  async getSongByPlaylists(req, res) {
    const { id } = req.params
    const { id: credentialId } = req.auth.credentials
    if (!id) {
      throw new ClientError('Required params playlist id')
    }

    await this._service.verifyPlaylistCollab({
      playlistId: id,
      owner: credentialId
    })
    const data = await this._service.getSongOnPlaylist(id)
    const response = res.response({
      status: 'success',
      data: {
        playlist: data
      }
    })
    response.code(200)
    return response
  }

  async voidPlaylist(req, res) {
    const { id } = req.params
    const { id: credentialId } = req.auth.credentials
    if (!id) {
      throw new ClientError('Required params playlist id')
    }

    await this._service.verifyPlaylistOwner({
      playlistId: id,
      owner: credentialId
    })
    await this._service.deletePlaylist(id)
    const response = res.response({
      status: 'success',
      message: 'Berhasil delete playlist'
    })
    response.code(200)
    return response
  }

  async voidSongByPlaylists(req, res) {
    const { songId } = req.payload
    const { id } = req.params
    const { id: credentialId } = req.auth.credentials
    if (!id) {
      throw new ClientError('Required params playlist id')
    }
    this._validator.validateAddSongRequest(req.payload)

    await this._songService.getSong(songId)
    await this._service.verifyPlaylistCollab({
      playlistId: id,
      owner: credentialId
    })
    await this._service.deleteSongOnPlaylist({ songId, playlistId: id })
    await this._service.addPlaylistActivity({
      playlistId: id,
      songId,
      userId: credentialId,
      action: 'delete'
    })
    const response = res.response({
      status: 'success',
      message: 'Berhasil delete lagu dari playlist'
    })
    response.code(200)
    return response
  }

  async getPlaylistsActivities(req, res) {
    const { id } = req.params
    const { id: credentialId } = req.auth.credentials

    await this._service.verifyPlaylistCollab({
      playlistId: id,
      owner: credentialId
    })
    const data = await this._service.getPlaylistsActivity(id)
    const response = res.response({
      status: 'success',
      data
    })
    response.code(200)
    return response
  }
}

module.exports = PlaylistsHandler
