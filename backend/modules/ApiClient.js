const util = require('util')
const request = require('request')
const PERM_HEADERS = ['Authorization']

class ApiClient {
  constructor () {
    this.get = util.promisify(request.get)
    this.post = util.promisify(request.post)
    this.put = util.promisify(request.put)
    this.delete = util.promisify(request.delete)
    this.req = request.defaults()
    this.baseUrl = null
  }

  static extractHeaders (req) {
    return req.rawHeaders
      .reduce((res, item, index) => {
        if ((index & 1) === 0) { res.push([item]) } else { res[res.length - 1].push(item) }
        return res
      }, [])
      .filter((pair) => PERM_HEADERS.indexOf(pair[0]) > -1)
      .reduce((res, pair) => {
        res[pair[0]] = pair[1] || null
        return res
      }, { Origin: req.app.locals.url })
  }

  setBaseUrl (url) {
    this.baseUrl = url.trim().replace(/\/$/, '')
    this.req = this.req.defaults({ baseUrl: this.baseUrl })
    return this
  }

  pipe (url, req, res) {
    if (this.req == null) { throw new Error('No defaults have been set') }
    const options = {
      method: req.method.toUpperCase(),
      headers: ApiClient.extractHeaders(req),
      json: true
    }
    options.headers.Authorization = req.headers.authorization
    if (req.body != null) { options.body = req.body }
    this.req(url, options).pipe(res)
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
