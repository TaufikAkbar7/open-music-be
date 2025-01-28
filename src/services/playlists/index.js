const { Pool } = require('pg')
const { v4 } = require('uuid')
const InvariantError = require('../../exceptions/invariantError')
const NotFoundError = require('../../exceptions/notFoundError')
const ForbiddenError = require('../../exceptions/forbiddenError')
const { DTOSongsPlaylist, DTOPlaylistActivity } = require('../../dto/playlists')

class PlaylistsService {
  constructor() {
    this._pool = new Pool()
  }

  async getPlaylists(id) {
    const query = {
      name: 'get-playlists',
      text: `
        SELECT
          tp.id AS id,
          tp.name AS name,
          tu.username AS username
        FROM t_playlists AS tp
          LEFT JOIN t_users AS tu ON tp.owner = tu.id
          LEFT JOIN t_collaborations tc on tc.playlist_id = tp.id
        WHERE tp.owner = $1 OR tc.user_id = $1
      `,
      values: [id]
    }

    const result = await this._pool.query(query)
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

    return DTOSongsPlaylist(result.rows)
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
    const data = result.rows[0]

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }
    if (data.owner !== owner) {
      throw new ForbiddenError('Anda tidak berhak mengakses resource ini')
    }
  }

  async verifyPlaylistCollab({ playlistId, owner }) {
    const query = {
      text: `
      SELECT 
        tc.user_id as user_collab_id,
        tp.owner as owner_id
      FROM t_playlists AS tp 
        LEFT JOIN t_collaborations AS tc ON tp.id = tc.playlist_id
        WHERE tp.id = $1
      `,
      values: [playlistId]
    }
    
    const result = await this._pool.query(query)
    const data = result.rows[0]

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }

    if (data.owner_id !== owner && data.user_collab_id !== owner) {
      throw new ForbiddenError('Anda tidak berhak mengakses resource ini')
    }
  }

  async getPlaylistsActivity(id) {
    const query = {
      name: 'get-playlists-activities',
      text: `
        SELECT
          tpsa.playlist_id AS playlist_id,
          tu.username AS username,
          ts.title AS title,
          tpsa.action AS action,
          tpsa.time AS time
        FROM t_playlists_song_activities AS tpsa
          INNER JOIN t_song AS ts ON tpsa.song_id = ts.id
          INNER JOIN t_users AS tu ON tpsa.user_id = tu.id
        WHERE tpsa.playlist_id = $1
        ORDER BY tpsa.time ASC
      `,
      values: [id]
    }

    const result = await this._pool.query(query)
    return DTOPlaylistActivity(result.rows)
  }

  async addPlaylistActivity({ playlistId, songId, userId, action }) {
    const id = v4()
    const time = new Date().toISOString()
    const query = {
      name: 'create-playlist-activities',
      text: 'INSERT INTO t_playlists_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Activities gagal ditambahkan')
    }

    return result.rows[0].id
  }
}

module.exports = PlaylistsService
