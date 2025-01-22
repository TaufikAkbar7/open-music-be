const { Pool } = require('pg')
const { v4 } = require('uuid')
const { DTOSong, DTOSearchSong } = require('../../dto/song')
const InvariantError = require('../../exceptions/invariantError')
const NotFoundError = require('../../exceptions/notFoundError')

class SongService {
  constructor() {
    this._pool = new Pool()
  }

  async getSongs({ title = '', performer = '' }) {
    const query = {
      name: 'get-all-song',
      text: `SELECT * FROM t_song WHERE LOWER(t_song.title) LIKE $1 AND LOWER(t_song.performer) LIKE $2`,
      values: [`%${title}%`, `%${performer}%`]
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) {
      return []
    }

    return result.rows.map(DTOSearchSong)
  }

  async getSong(id) {
    const query = {
      name: 'get-song',
      text: 'SELECT * FROM t_song WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan')
    }

    return result.rows.map(DTOSong)[0]
  }

  async createSong({ title, year, genre, performer, duration, album_id }) {
    const id = v4()
    const query = {
      name: 'create-song',
      text: 'INSERT INTO t_song VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, album_id, title, genre, performer, duration, year]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async editSong({ title, year, genre, performer, duration, album_id, id }) {
    const query = {
      name: 'edit-song',
      text: 'UPDATE t_song SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, album_id, id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan')
    }

    return result.rows[0].id
  }

  async voidSong(id) {
    const query = {
      name: 'delete-song',
      text: 'DELETE FROM t_song WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan')
    }

    return result.rows[0].id
  }
}

module.exports = SongService
