const redis = require('redis')

class RedisService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER
      }
    })

    this._client.on('error', error => {
      console.error(error)
    })

    this._client.connect()
  }

  async set({ key, value, expirationInSecond = 3600 }) {
    await this._client.set(key, value, {
      EX: expirationInSecond
    })
    console.info(`cache set with key ${key}`)
  }

  async get(key) {
    const result = await this._client.get(key)

    if (result === null) throw new Error('Cache tidak ditemukan')

    return result
  }

  delete(key) {
    console.info(`cache deleted with key ${key}`)
    return this._client.del(key)
  }
}

module.exports = RedisService
