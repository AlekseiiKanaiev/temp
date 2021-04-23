const ApiClient = require('./ApiClient')

class SnykClient extends ApiClient {
  constructor () {
    super()
    this.token = null
  }

  static newInstance (baseUrl, context, apitoken) {
    const client = new SnykClient()
    client.setBaseUrl(baseUrl)
    if (context != null) {
      client.setToken(apitoken)
    }
    return client
  }

  get authHeader () {
    return `Bearer ${this.token}`
  }

  setToken (token) {
    this.token = token
    this.req = this.req.defaults({ headers: this.authHeader })
    return this
  }

  pipe (url, req, res) {
    if (this.token == null) {
      throw new Error('')
    }
    req.headers.authorization = this.authHeader
    super.pipe(url, req, res)
  }
}

module.exports = SnykClient
