const { Pool } = require('pg')
const { v4 } = require('uuid')
const bcrypt = require('bcrypt')
const InvariantError = require('../../exceptions/invariantError')
const AuthenticationError = require('../../exceptions/authenticationError')

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
      text: 'INSERT INTO t_users VALUES($1, $2, $3, $4) RETURNING id',
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
      text: 'SELECT username FROM t_users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (result.rows.length > 0) {
      throw new InvariantError(
        'Gagal menambahkan user. Username sudah digunakan.'
      )
    }
  }

  async login({ username, password }) {
    const query = {
      text: 'SELECT id, password FROM t_users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah')
    }

    const { id, password: hashedPassword } = result.rows[0]

    const match = await bcrypt.compare(password, hashedPassword)

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah')
    }
    return id
  }
}

module.exports = UserService
