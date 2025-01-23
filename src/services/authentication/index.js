const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const AuthenticationError = require('../../exceptions/authenticationError')
const InvariantError = require('../../exceptions/invariantError')

class AuthService {
  constructor() {
    this._pool = new Pool()
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO t_auth VALUES($1)',
      values: [token]
    }

    await this._pool.query(query)
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM t_auth WHERE token = $1',
      values: [token]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid')
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM t_auth WHERE token = $1',
      values: [token]
    }
    await this._pool.query(query)
  }

  async login(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
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

module.exports = AuthService
