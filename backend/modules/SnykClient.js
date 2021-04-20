const ApiClient = require('./ApiClient')

const MOCK_USER = {
  id: 'bd956a95-fc92-446e-a327-0f4c2fd01b8e',
  username: 'sergeys',
  email: 'sergeys@archer-soft.com',
  orgs: [
    {
      name: 'sergeys',
      id: '3b822f66-57be-4811-81b9-d85679f77159',
      group: null
    }
  ],
  token: '218a6305-4a3c-4a52-9e9c-5fdeb9b17747'
}

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

  install (instData) {
    // TODO: replace with real call to Snyk API
    return Promise.resolve(MOCK_USER)
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
