class ListenerService {
  constructor(playlistService, mailtrapService) {
    this._playlistService = playlistService
    this._mailtrapService = mailtrapService

    this.getMessagePlaylist = this.getMessagePlaylist.bind(this)
  }

  async getMessagePlaylist(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString())

      const playlists =
        await this._playlistService.getSongOnPlaylist(playlistId)
      await this._mailtrapService.sendEmail(
        targetEmail,
        JSON.stringify(playlists)
      )
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = ListenerService
