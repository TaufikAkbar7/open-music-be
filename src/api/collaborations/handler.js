class CollaborationHandler {
  constructor(playlistsService, services, validator) {
    this._playlistsService = playlistsService
    this._service = services
    this._validator = validator
  }

  async addCollaboration(req, res) {
    const { playlistId } = req.payload
    const { id: credentialId } = req.auth.credentials
    this._validator.validateRequestPayload(req.payload)

    await this._playlistsService.verifyPlaylistOwner({
      playlistId,
      owner: credentialId
    })
    const id = await this._service.addCollab(req.payload)
    const response = res.response({
      status: 'success',
      data: {
        collaborationId: id
      }
    })
    response.code(201)
    return response
  }

  async deleteCollaboration(req, res) {
    const { playlistId } = req.payload
    const { id: credentialId } = req.auth.credentials
    this._validator.validateRequestPayload(req.payload)

    await this._playlistsService.verifyPlaylistOwner({
      playlistId,
      owner: credentialId
    })
    await this._service.voidCollab(req.payload)
    const response = res.response({
      status: 'success',
      message: 'Berhasil menghapus user dari playlist collab'
    })
    response.code(200)
    return response
  }
}

module.exports = CollaborationHandler
