class AlbumHandler {
    constructor(services) {
        this._service = services;

        this.getAlbums = this.getAlbums.bind(this);
        this.getAlbum = this.getAlbum.bind(this);
        this.createAlbum = this.createAlbum.bind(this);
        this.updateAlbum = this.updateAlbum.bind(this);
        this.deleteAlbum = this.deleteAlbum.bind(this);
    }

    getAlbums(req, res) {

    }

    getAlbum(req, res) {

    }

    createAlbum(req, res) {

    }

    updateAlbum(req, res) {

    }

    deleteAlbum(req, res) {

    }
}

module.exports = AlbumHandler;