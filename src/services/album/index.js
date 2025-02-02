const { Pool } = require('pg')
const { v4 } = require('uuid')
const DTOAlbumSongs = require('../../dto/album')
const ClientError = require('../../exceptions/clientError')
const InvariantError = require('../../exceptions/invariantError')
const NotFoundError = require('../../exceptions/notFoundError')

class AlbumService {
  constructor(redisService) {
    this._pool = new Pool()
    this._redisService = redisService
  }

  async getAlbum(id) {
    const query = {
      name: 'get-album',
      text: `
        SELECT
          album.id AS album_id,
          album.name AS album_name,
          album.year AS album_year,
          album.cover_url AS album_cover_url,
          song.id AS song_id,
          song.title AS song_title,
          song.performer AS song_performer
        FROM t_album AS album 
          LEFT JOIN t_song AS song ON album.id = song.album_id
        WHERE album.id = $1
      `,
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan')
    }

    return DTOAlbumSongs(result.rows)
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

  async editCoverAlbum({ coverUrl, id }) {
    const query = {
      name: 'edit-cover-album',
      text: 'UPDATE t_album SET cover_url = $1 WHERE id = $2 RETURNING id, name, year, cover_url',
      values: [coverUrl, id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan')
    }

    return result.rows[0].id
  }

  async getCountLikeAlbum(id) {
    try {
      const result = await this._redisService.get(`albums:${id}`)

      return {
        data: JSON.parse(result),
        source: 'cache'
      }
    } catch (error) {
      const query = {
        name: 'get-count-album-likes',
        text: 'SELECT COUNT(tual.id) FROM t_user_album_likes AS tual WHERE tual.album_id = $1',
        values: [id]
      }

      const data = await this._pool.query(query)

      if (!data.rows.length) {
        throw new NotFoundError('Album tidak ditemukan')
      }

      const count = Number(data.rows[0].count)
      await this._redisService.set({
        key: `albums:${id}`,
        value: JSON.stringify(count),
        expirationInSecond: 1800
      })

      return {
        data: count,
        source: 'database'
      }
    }
  }

  async verifyLikeAlbum({ userId, albumId }) {
    const query = {
      name: 'verify-user-album-likes',
      text: 'SELECT * FROM t_user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId]
    }

    const result = await this._pool.query(query)

    if (result.rows.length) {
      throw new ClientError('Anda sudah memberikan like pada album ini')
    }
  }

  async postLikeAlbum({ userId, albumId }) {
    const id = v4()
    const query = {
      name: 'create-user-album-likes',
      text: 'INSERT INTO t_user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Like gagal ditambahkan')
    }

    await this._redisService.delete(`albums:${albumId}`)

    return result.rows[0].id
  }

  async voidLikeAlbum({ userId, albumId }) {
    const query = {
      name: 'void-user-album-likes',
      text: 'DELETE FROM t_user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Like gagal dihapus. Id tidak ditemukan')
    }

    await this._redisService.delete(`albums:${albumId}`)

    return result.rows[0].id
  }
}

module.exports = AlbumService
