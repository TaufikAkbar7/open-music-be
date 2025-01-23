class AuthHandler {
  constructor(authServices, usersService, tokenManager, validator) {
    this._service = authServices
    this._validator = validator
    this._usersService = usersService
    this._tokenManager = tokenManager
  }

  async authLogin(req, res) {
    this._validator.validateLoginRequest(req.payload)
    const { username, password } = req.payload

    const id = await this._service.login({
      username,
      password
    })
    const accessToken = this._tokenManager.generateAccessToken({ id })
    const refreshToken = this._tokenManager.generateRefreshToken({ id })

    await this._service.addRefreshToken(refreshToken)

    const response = res.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken
      }
    })
    response.code(201)
    return response
  }

  async authRefreshToken(req, res) {
    this._validator.validateRefreshTokenRequest(req.payload)
    const { refreshToken } = req.payload

    await this._service.verifyRefreshToken(refreshToken)
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken)

    const accessToken = this._tokenManager.generateAccessToken({ id })
    const response = res.response({
      status: 'success',
      data: {
        accessToken
      }
    })
    response.code(200)
    return response
  }

  async authDeleteRefreshToken(req, res) {
    this._validator.validateRefreshTokenRequest(req.payload)
    const { refreshToken } = req.payload

    await this._service.verifyRefreshToken(refreshToken)
    await this._service.deleteRefreshToken(refreshToken)

    const response = res.response({
      status: 'success',
      message: 'Refresh token berhasil dihapus'
    })
    response.code(200)
    return response
  }
}

module.exports = AuthHandler
