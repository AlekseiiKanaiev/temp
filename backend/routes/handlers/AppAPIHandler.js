const status = require('http-status')
const { logger } = require('../../logger')
const TokenService = require('../../modules/TokenService')

class AppAPIHandler {
  constructor (addon, app) {
    this.addon = addon
    this.app = app
  }

  static newInstance (addon, app) {
    return new AppAPIHandler(addon, app)
  }

  getOrg (req, res) {
    this.addon.settings.get('snykSettings', req.context.clientKey)
      .then((settings) => {
        if (settings && settings.orgid) {
          return res.status(200).send({ org: true, orgname: settings.orgname, orgslug: settings.orgslug })
        } else {
          return res.status(200).send({ org: false })
        }
      })
      .catch((err) => {
        logger.error(err)
        return res.status(status.BAD_REQUEST).send('')
      })
  }

  deleteOrg (req, res) {
    this.addon.settings.get('snykSettings', req.context.clientKey)
      .then((settings) => {
        if (settings && settings.orgid) {
            delete settings.orgid
        }
        if (settings && settings.orgname) {
          delete settings.orgname
        }
        if (settings && settings.orgslug) {
          delete settings.orgslug
        }
        this.addon.settings.set('snykSettings', settings, req.context.clientKey)
        .then (() => res.status(200).send({ message: "success" }))
        .catch((err) => {
          logger.error(err)
          return res.status(status.BAD_REQUEST).send('')
        })
      })
      .catch((err) => {
        logger.error(err)
        return res.status(status.BAD_REQUEST).send('')
      })
  }

  deleteToken (req, res) {
    this.addon.settings.del('snykSettings', req.context.clientKey)
      .then((settings) => {
          return res.status(200).send({ message: "success" })        
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
        return this.app.get('env') === 'development' ?
          res.status(200).send({code: code,  snykApiTokenBody: snykApiTokenBody }) :
          res.status(200).send({message : "you can close the tab" })
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
        settings.orgslug = req.body.slug
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
