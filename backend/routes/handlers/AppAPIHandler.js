const status = require('http-status')
const { logger } = require('../../logger')
const TokenService = require('../../modules/TokenService')

class AppAPIHandler {
  constructor (addon) {
    this.addon = addon
  }

  static newInstance (addon) {
    return new AppAPIHandler(addon)
  }

  getOrg (req, res) {
    this.addon.settings.get('snykSettings', req.context.clientKey)
      .then((settings) => {
        if (settings && settings.orgid) {
          return res.status(200).send({ org: true, orgname: settings.orgname })
        } else {
          return res.status(200).send({ org: false })
        }
      })
      .catch((err) => {
        logger.error(err)
        return res.status(status.BAD_REQUEST).send('')
      })
  }

  getToken (req, res) {
    this.addon.settings.get('snykSettings', req.context.clientKey)
      .then((settings) => {
        if (settings && settings.apitoken) {
          return res.status(200).send({ token: true })
        } else {
          return res.status(200).send({ token: false })
        }
      })
      .catch((err) => {
        logger.error(err)
        return res.status(status.BAD_REQUEST).send('')
      })
  }

  oauth (req, res) {
    const { state, code } = req.query
    const tokenService = new TokenService(this.addon, req.context.clientKey)
    const redirectUri = tokenService.getRedirectUri(this.addon.config.localBaseUrl())
    tokenService.saveSnykApiToken(redirectUri, code, state)
      .then((snykApiTokenBody) => {
        if (snykApiTokenBody.error) {
          return res.status(status.BAD_REQUEST).send(snykApiTokenBody.error)
        }
        return res.status(200).send({ snykApiTokenBody: snykApiTokenBody })
      })
  }

  restartIntegration (req, res) {
    this.addon.settings.del('snykSettings', req.context.clientKey)
      .then(() => res.status(200).send({ status: 'restarted' }))
      .catch((err) => res.status(status.BAD_REQUEST).send(err))
  }

  setState (req, res) {
    const tokenService = new TokenService(this.addon, req.context.clientKey)
    const redirectUri = tokenService.getRedirectUri(this.addon.config.localBaseUrl())
    tokenService.generateNewToken()
      .then((state) => {
        if (state === '') {
          return res.status(status.BAD_REQUEST).send('')
        }
        res.status(200).send({ token: state, clientid: this.addon.config.clientId(), url: redirectUri })
      })
      .catch((err) => {
        logger.error(err)
        return res.status(status.BAD_REQUEST).send('')
      })
  }

  saveOrg (req, res) {
    this.addon.settings.get('snykSettings', req.context.clientKey)
      .then((settings) => {
        settings.orgid = req.body.id
        settings.orgname = req.body.name
        this.addon.settings.set('snykSettings', settings, req.context.clientKey)
          .then(() => res.status(201).send({ id: settings.orgid, name: settings.orgname }))
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
module.exports = AppAPIHandler
