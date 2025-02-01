class ExportsHandler {
  constructor(service, playlistService, validator) {
    this._service = service
    this._playlistService = playlistService
    this._validator = validator
  }

  async postExportPlaylist(req, res) {
    const { id } = req.params
    const { targetEmail } = req.payload
    const { id: credentialId } = req.auth.credentials
    this._validator.validateExportNotesPayload(req.payload)

    const message = {
      targetEmail,
      userId: credentialId,
      playlistId: id
    }

    await this._playlistService.verifyPlaylistCollab({
      playlistId: id,
      owner: credentialId
    })
    await this._service.sendMessage('export:playlists', JSON.stringify(message))

    const response = res.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean'
    })
    response.code(201)
    return response
  }
}

module.exports = ExportsHandler
