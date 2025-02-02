const ClientError = require('../../exceptions/clientError')

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

  async getAlbumLikeCount(req, res) {
    const { id } = req.params

    const { data, source } = await this._service.getCountLikeAlbum(id)

    if (source === 'cache') {
      const response = res
        .response({
          status: 'success',
          data: {
            likes: data
          }
        })
        .header('X-Data-Source', 'cache')
      response.code(200)

      return response
    }

    const response = res.response({
      status: 'success',
      data: {
        likes: data
      }
    })
    response.code(200)

    return response
  }

  async addAlbumLike(req, res) {
    const { id } = req.params
    const { id: credentialId } = req.auth.credentials

    if (!id) {
      throw new ClientError('Required params album id')
    }

    await this._service.verifyLikeAlbum({ userId: credentialId, albumId: id })
    await this._service.postLikeAlbum({ userId: credentialId, albumId: id })

    const response = res.response({
      status: 'success',
      message: 'Like berhasil ditambahkan ke album'
    })
    response.code(201)

    return response
  }

  async deleteAlbumLike(req, res) {
    const { id } = req.params
    const { id: credentialId } = req.auth.credentials

    if (!id) {
      throw new ClientError('Required params album id')
    }

    await this._service.voidLikeAlbum({ userId: credentialId, albumId: id })

    const response = res.response({
      status: 'success',
      message: 'Like berhasil dihapus dari album'
    })
    response.code(200)

    return response
  }
}

module.exports = AlbumHandler
