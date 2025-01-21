class AlbumHandler {
    constructor(services, validator) {
        this._service = services;
        this._validator = validator;

        this.getAlbum = this.getAlbum.bind(this);
        this.createAlbum = this.createAlbum.bind(this);
        this.updateAlbum = this.updateAlbum.bind(this);
        this.deleteAlbum = this.deleteAlbum.bind(this);
    }

    async getAlbum(req, res) {
        const id = req.params.id
        const albums = await this._service.getAlbum(id)
        const response = res.response({
            status: 'success',
            data: {
                album: albums
            },
          });
          response.code(200);
          return response;
    }

    async createAlbum(req, res) {
        this._validator.validateCreateEditRequest(req.payload)
            const { name, year } = req.payload

            const albumId = await this._service.createAlbum({ name, year })
            const response = res.response({
                status: 'success',
                data: {
                    albumId,
                },
              });
              response.code(201);
              return response;
    }

    async updateAlbum(req, res) {
        const id = req.params.id
        this._validator.validateCreateEditRequest(req.payload)
        const { name, year } = req.payload

        const albumId = await this._service.editAlbum({ id, name, year })
        const response = res.response({
            status: 'success',
            message: 'Berhasil memperbarui album',
            data: {
                albumId,
            },
          });
          response.code(200);
          return response;
    }

    async deleteAlbum(req, res) {
        const id = req.params.id
        const albumId = await this._service.voidAlbum(id)
        const response = res.response({
            status: 'success',
            message: 'Berhasil menghapus album',
            data: {
                albumId
            },
          });
          response.code(200);
          return response;
    }
}

module.exports = AlbumHandler;