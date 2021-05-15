const status = require('http-status')
const { logger } = require('../../logger')


class BitbucketAPIHandler {
  constructor (addon) {
    this.addon = addon
  }

  static newInstance (addon) {
    return new BitbucketAPIHandler(addon)
  }

  pipe (req, res) {
    const httpClient = this.addon.httpClient(req)
    const url = req.path.replace('/bb', '')

    httpClient[req.method.toLowerCase()](url, (err, resp, data) => {
      try {
        const parsed = JSON.parse(data)
        res.status(status.OK).send(parsed)
      } catch (err) {
        logger.error({ message: err.toString(), clientkey: req.context.clientKey})
        res.status(status.BAD_REQUEST).send('')
      }
    })
  }
}

module.exports = BitbucketAPIHandler
