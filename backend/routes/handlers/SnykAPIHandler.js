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
    const clientKey = req.context.clientKey
    this.addon.settings.get('snykSettings', clientKey)
      .then((settings) => {
        this.tokenService.getToken(clientKey)
          .then((token) => {
            if (this.isRequestValid(req)) {
              const client = this.factory(req.context, token)
              return client.pipe(req.path.replace('/snyk', '').replace('orgid', settings.orgid).replace('orgslug', settings.orgslug), req, res)
            } else {
              return res.status(status.BAD_REQUEST).send('')
            }
          })
      }).catch((err) => {
        logger.error({ message: err.toString(), clientkey: clientKey })
        return res.status(status.BAD_REQUEST).send('')
      })
  }

  isRequestValid (req) {
    const validRequests = [
      { method: 'GET', path: /^\/snyk\/orgs$/ },
      { method: 'GET', path: /^\/snyk\/org$/ },
      { method: 'GET', path: /^\/snyk\/user\/me$/ },
      { method: 'POST', path: /^\/snyk\/org\/orgid\/integrations\/(.*)\/import$/ },
      { method: 'POST', path: /^\/snyk\/org\/orgid\/integrations$/ },
      { method: 'GET', path: /^\/snyk\/org\/orgid\/integrations$/ },
      { method: 'POST', path: /^\/snyk\/org\/orgid\/projects$/ },
      { method: 'POST', path: /^\/snyk\/org\/orgid\/project\/(.*)\/aggregated-issues$/ },
      { method: 'GET', path: /^\/snyk\/org\/(.*)\/integrations\/(.*)\/import/ }
    ]
    return validRequests.filter((request) => req.method === request.method && request.path.test(req.path)).length > 0
  }
}

module.exports = SnykAPIHandler
