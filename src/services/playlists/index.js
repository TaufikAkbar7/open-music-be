const { Pool } = require('pg')
const { v4 } = require('uuid')
const InvariantError = require('../../exceptions/invariantError')
const NotFoundError = require('../../exceptions/notFoundError')
const ForbiddenError = require('../../exceptions/forbiddenError')

class PlaylistsService {
  constructor() {
    this._pool = new Pool()
  }

  async getPlaylists() {
    const query = {
      name: 'get-playlists',
      text: `
        SELECT
          tp.id AS id,
          tp.name AS name,
          tu.username AS username
        FROM t_playlists AS tp
          INNER JOIN t_users AS tu ON tp.owner = tu.id
      `
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlists tidak ditemukan')
    }

    return result.rows
  }

  async getSongOnPlaylist(id) {
    const query = {
      name: 'get-song-on-playlist',
      text: `
        SELECT 
          tp.id as id,
          tp."name" as name,
          tu.username  as username,
          ts.title as song_title,
          ts.performer as song_performer,
          ts.id as song_id
        FROM t_playlist_songs AS tps
          INNER JOIN t_playlists AS tp ON tps.playlist_id = tp.id
          INNER JOIN t_song AS ts ON tps.song_id = ts.id
          INNER JOIN t_users AS tu ON tp.owner = tu.id
        WHERE tp.id = $1;
      `,
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Lagu berdasarkan playlist tidak ditemukan')
    }

    const mappingResults = result.rows.reduce((acc, item) => {
      let obj = acc
      if (!obj) {
        obj = {
          id: item.id,
          name: item.name,
          username: item.username,
          songs: []
        }
      }
      if (item.song_id && item.song_title && item.song_performer) {
        obj.songs.push({
          id: item.song_id,
          title: item.song_title,
          performer: item.song_performer
        })
      }
      return obj
    }, null)

    return mappingResults
  }

  async addPlaylist({ name, ownerId }) {
    const id = v4()
    const query = {
      name: 'create-playlist',
      text: 'INSERT INTO t_playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, ownerId]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async addSongOnPlaylist({ playlistId, songId }) {
    const id = v4()
    const query = {
      name: 'create-song-on-playlist',
      text: 'INSERT INTO t_playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan dari playlist')
    }

    return result.rows[0].id
  }

  async deletePlaylist(id) {
    const query = {
      name: 'delete-playlist',
      text: 'DELETE FROM t_playlists WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus')
    }

    return result.rows[0].id
  }

  async deleteSongOnPlaylist({ songId, playlistId }) {
    const query = {
      name: 'delete-song-on-playlist',
      text: 'DELETE FROM t_playlist_songs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
      values: [songId, playlistId]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal dihapus dari playlist')
    }

    return result.rows[0].id
  }

  async verifyPlaylistOwner({ playlistId, owner }) {
    const query = {
      text: 'SELECT * FROM t_playlists WHERE id = $1',
      values: [playlistId]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }
    const data = result.rows[0]
    if (data.owner !== owner) {
      throw new ForbiddenError('Anda tidak berhak mengakses resource ini')
    }
  }
}

module.exports = PlaylistsService
