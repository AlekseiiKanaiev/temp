const ApiClient = require('./ApiClient')

class BBClient extends ApiClient {
  constructor (addon) {
    super()
    this.addon = addon
  }

  static newInstance (baseUrl, addon) {
    const client = new BBClient(addon)
    return client.setBaseUrl()
  }

  async pipe (url, req, res) {
    const client = this.addon.httpClient(req)
    const clientRequest = await client[req.method.toLowerCase()](url, (err) => { throw err })
    req.pipe(clientRequest).pipe(res)
  }
}

module.exports = BBClient
