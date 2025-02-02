class AlbumHandler {
  constructor(services, storageServices, validator) {
    this._service = services
    this._storageServices = storageServices
    this._validator = validator
  }

  async getAlbum(req, res) {
    const { id } = req.params
    const albums = await this._service.getAlbum(id)
    const response = res.response({
      status: 'success',
      data: {
        album: albums
      }
    })
    response.code(200)
    return response
  }

  async createAlbum(req, res) {
    this._validator.validateCreateEditRequest(req.payload)
    const { name, year } = req.payload

    const albumId = await this._service.createAlbum({ name, year })
    const response = res.response({
      status: 'success',
      data: {
        albumId
      }
    })
    response.code(201)
    return response
  }

  async updateAlbum(req, res) {
    const { id } = req.params
    this._validator.validateCreateEditRequest(req.payload)
    const { name, year } = req.payload

    const albumId = await this._service.editAlbum({ id, name, year })
    const response = res.response({
      status: 'success',
      message: 'Berhasil memperbarui album',
      data: {
        albumId
      }
    })
    response.code(200)
    return response
  }

  async deleteAlbum(req, res) {
    const { id } = req.params
    const albumId = await this._service.voidAlbum(id)
    const response = res.response({
      status: 'success',
      message: 'Berhasil menghapus album',
      data: {
        albumId
      }
    })
    response.code(200)
    return response
  }

  async addAlbumCover(req, res) {
    const { id } = req.params
    const { cover } = req.payload

    this._validator.validateCoverAlbumHeader(cover.hapi.headers)
    const filename = await this._storageServices.writeFile(cover, cover.hapi)
    if (filename) {
      await this._service.editCoverAlbum({ coverUrl: filename, id })
      const response = res.response({
        status: 'success',
        message: 'Sampul berhasil diunggah'
      })
      response.code(201)
      return response
    }

    const response = res.response({
      status: 'error',
      message: 'Server error'
    })
    response.code(500)
    return response
  }
}

module.exports = AlbumHandler
