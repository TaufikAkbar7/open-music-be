const { Pool } = require('pg')
const { v4 } = require('uuid')
const InvariantError = require('../../exceptions/invariantError')
const NotFoundError = require('../../exceptions/notFoundError')

class AlbumService {
  constructor() {
    this._pool = new Pool()
  }

  async getAlbum(id) {
    const query = {
      name: 'get-album',
      text: 'SELECT * FROM t_album WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan')
    }

    return result.rows[0]
  }

  async createAlbum({ name, year }) {
    const id = v4()
    const query = {
      name: 'create-album',
      text: 'INSERT INTO t_album VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async editAlbum({ id, name, year }) {
    const query = {
      name: 'edit-album',
      text: 'UPDATE t_album SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan')
    }

    return result.rows[0].id
  }

  async voidAlbum(id) {
    const query = {
      name: 'delete-album',
      text: 'DELETE FROM t_album WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan')
    }

    return result.rows[0].id
  }
}

module.exports = AlbumService
