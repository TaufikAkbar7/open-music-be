const { Pool } = require('pg')
const { v4 } = require('uuid')
const bcrypt = require('bcrypt')
const InvariantError = require('../../exceptions/invariantError')

class UserService {
  constructor() {
    this._pool = new Pool()
  }

  async createUser({ username, password, fullname }) {
    await this.verifyNewUsername(username)
    const id = v4()
    const hashedPassword = await bcrypt.hash(password, 10)
    const query = {
      name: 'create-user',
      text: 'INSERT INTO t_album VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('User gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (result.rows.length > 0) {
      throw new InvariantError(
        'Gagal menambahkan user. Username sudah digunakan.'
      )
    }
  }
}

module.exports = UserService
