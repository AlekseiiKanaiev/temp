const util = require('util')
const request = require('request')

class ApiClient {
  constructor () {
    this.get = util.promisify(request.get)
    this.post = util.promisify(request.post)
    this.put = util.promisify(request.put)
    this.delete = util.promisify(request.delete)
    this.req = null
    this.baseUrl = null
  }

  setBaseUrl (url) {
    this.req = request.defaults({
      baseUrl: url.trim().replace(/\/$/, ''),
      uri: '/'
    })
    return this
  }

  pipe (url, req, res) {
    if (this.req == null) { throw new Error('No defaults have been set') }

    req.pipe(this.req(url)).pipe(res)
  }

  send (opts) {
    return new Promise((resolve, reject) => {
      if (this.req == null) { reject(new Error('No defaults have been set')) }
      this.req.defaults(opts)(opts.url, (err, response, body) => {
        if (err) {
          reject(err)
        } else if (Math.floor(response.statusCode / 100) !== 2) {
          reject(response)
        } else {
          resolve(response)
        }
      })
    })
  }
}

module.exports = ApiClient
