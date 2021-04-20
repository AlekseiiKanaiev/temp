const util = require('util')
const status = require('http-status')
const { logger } = require('../../logger')
const TokenService = require('../../modules/TokenService')

class SnykAPIHandler {
  constructor (factory, addon) {
    this.factory = factory
    this.addon = addon
    this.tokenService = new TokenService(addon, undefined)
  }

  static newInstance (factory, addon) {
    return new SnykAPIHandler(factory, addon)
  }

  pipe (req, res) {
    console.log(util.inspect(req.context, {
      colors: true,
      depth: null
    }))
    this.addon.settings.get('snykSettings', req.context.clientKey)
      .then((settings) => {
        this.tokenService.getToken(req.context.clientKey)
          .then((token) => {
            const client = this.factory(req.context, token)
            return client.pipe(req.path.replace('/snyk', '').replace('orgid', settings.orgid), req, res)
          })
          .catch((err) => {
            logger.error(err)
            return res.status(status.BAD_REQUEST).send('')
          })
      }).catch((err) => {
        logger.error(err)
        return res.status(status.BAD_REQUEST).send('')
      })
  }
}

module.exports = SnykAPIHandler
