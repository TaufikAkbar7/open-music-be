const { Pool } = require('pg')
const { v4 } = require('uuid')
const InvariantError = require('../../exceptions/invariantError')
const NotFoundError = require('../../exceptions/notFoundError')

class CollaborationService {
    constructor() {
        this._pool = new Pool()
    }

    async addCollab({ playlistId, userId }) {
        const id = v4()
        const query = {
            name: 'add-collab',
            text: 'INSERT INTO t_collaborations VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, userId]
        }

        const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('User gagal ditambahkan')
    }

    return result.rows[0].id
    }

    async voidCollab({ playlistId, userId }) {
        const query = {
            name: 'delete-collab',
            text: 'DELETE FROM t_collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
            values: [playlistId, userId]
          }
      
          const result = await this._pool.query(query)
      
          if (!result.rows.length) {
            throw new NotFoundError('User gagal dihapus. Id tidak ditemukan')
          }
      
          return result.rows[0].id
    }
}

module.exports = CollaborationService