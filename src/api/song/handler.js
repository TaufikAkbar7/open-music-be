class SongHandler {
    constructor(services, validator) {
        this._service = services;
        this._validator = validator;

        this.getSongs = this.getSongs.bind(this);
        this.getSong = this.getSong.bind(this);
        this.createSong = this.createSong.bind(this);
        this.updateSong = this.updateSong.bind(this);
        this.deleteSong = this.deleteSong.bind(this);
    }

    async getSongs(req, res) {
        const id = req.params.id
        const songs = await this._service.getSongs(id)
        const response = res.response({
            status: 'success',
            data: {
                songs: songs
            },
          });
          response.code(200);
          return response;
    }

    async getSong(req, res) {
        const id = req.params.id
        const song = await this._service.getSong(id)
        const response = res.response({
            status: 'success',
            data: {
                song: song
            },
          });
          response.code(200);
          return response;
    }

    async createSong(req, res) {
        this._validator.validateCreateEditRequest(req.payload)
            const { name, year } = req.payload

            const songId = await this._service.createSong({ name, year })
            const response = res.response({
                status: 'success',
                data: {
                    songId,
                },
              });
              response.code(201);
              return response;
    }

    async updateSong(req, res) {
        const id = req.params.id
        this._validator.validateCreateEditRequest(req.payload)
        const { name, year } = req.payload

        const songId = await this._service.editSong({ id, name, year })
        const response = res.response({
            status: 'success',
            message: 'Berhasil memperbarui lagu',
            data: {
                songId,
            },
          });
          response.code(200);
          return response;
    }

    async deleteSong(req, res) {
        const id = req.params.id
        const songId = await this._service.voidSong(id)
        const response = res.response({
            status: 'success',
            message: 'Berhasil menghapus lagu',
            data: {
                songId
            },
          });
          response.code(200);
          return response;
    }
}

module.exports = SongHandler;