class UserHandler {
  constructor(services, validator) {
    this._service = services
    this._validator = validator
  }

  async createUser(req, res) {
    this._validator.validateCreateEditRequest(req.payload)
    const { username, password, fullname } = req.payload

    const userId = await this._service.createUser({
      username,
      password,
      fullname
    })
    const response = res.response({
      status: 'success',
      data: {
        userId
      }
    })
    response.code(201)
    return response
  }
}

module.exports = UserHandler
