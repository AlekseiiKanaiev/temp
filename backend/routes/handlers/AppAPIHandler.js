const status = require('http-status')
const { logger } = require('../../logger')
const TokenService = require('../../modules/TokenService')
const AnalyticsClient = require('../../modules/AnalyticsClient')

class AppAPIHandler {
  constructor (addon, app) {
    this.addon = addon
    this.app = app
  }

  static newInstance (addon, app) {
    return new AppAPIHandler(addon, app)
  }

  getOrg (req, res) {
    const clientKey = req.context.clientKey
    this.addon.settings.get('snykSettings', clientKey)
      .then((settings) => {
        if (settings && settings.orgid) {
          return res.status(200).send({ org: true, orgname: settings.orgname, orgslug: settings.orgslug })
        } else {
          return res.status(200).send({ org: false })
        }
      })
      .catch((err) => {
        logger.error({ message: err.toString(), clientkey: clientKey })
        return res.status(status.BAD_REQUEST).send('')
      })
  }

  deleteOrg (req, res) {
    const clientKey = req.context.clientKey
    this.addon.settings.get('snykSettings', clientKey)
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
        this.addon.settings.set('snykSettings', settings, clientKey)
          .then(() => res.status(200).send({ message: 'success' }))
          .catch((err) => {
            logger.error({ message: err.toString(), clientkey: clientKey })
            return res.status(status.BAD_REQUEST).send('')
          })
      })
      .catch((err) => {
        logger.error({ message: err.toString(), clientkey: clientKey })
        return res.status(status.BAD_REQUEST).send('')
      })
  }

  deleteToken (req, res) {
    const clientKey = req.context.clientKey
    this.addon.settings.get('snykSettings', clientKey)
      .then((settings) => {
        if (settings && settings.apitoken) {
          delete settings.apitoken
        }
        if (settings && settings.refresh_token) {
          delete settings.refresh_token
        }
        if (settings && settings.snykuserid) {
          delete settings.snykuserid
        }
        this.addon.settings.set('snykSettings', settings, clientKey)
          .then(() => res.status(200).send({ message: 'success' }))
          .catch((err) => {
            logger.error({ message: err.toString(), clientkey: clientKey })
            return res.status(status.BAD_REQUEST).send('')
          })
      })
      .catch((err) => {
        logger.error({ message: err.toString(), clientkey: clientKey })
        return res.status(status.BAD_REQUEST).send('')
      })
  }

  getToken (req, res) {
    const clientKey = req.context.clientKey
    this.addon.settings.get('snykSettings', clientKey)
      .then((settings) => {
        if (settings && settings.apitoken) {
          return res.status(200).send({ token: true })
        } else {
          return res.status(200).send({ token: false })
        }
      })
      .catch((err) => {
        logger.error({ message: err.toString(), clientkey: clientKey })
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
        // res.redirect(307, 'https://bitbucket.org/alex1mmmcprime/workspace/settings/addon/admin/snyk-bb-app-test/snyk-account-page');
        // res.render('snyk-redirect-page', {})
        return this.app.get('env') === 'development'
          ? res.status(200).send({ code: code, snykApiTokenBody: snykApiTokenBody })
          : res.status(200).send({ message: 'you can close the tab' })
      })
  }

  restartIntegration (req, res) {
    const {clientKey} = req.context
    const bbUserId = JSON.stringify(req.body).currentuserid
    AnalyticsClient.getEventProperties(clientKey)
    .then((eventProperties) => {
    const eventMessage = {
      userId: eventProperties.snykUserId,
      event: 'connect_app_app_uninstalled',
          properties: {
              client_key: clientKey,
              workspace_name: eventProperties.workspaceName,
              workspace_id: eventProperties.workspaceId,
              bb_user_id: bbUserId,
              snyk_user_id: eventProperties.snykUserId,
              snyk_org_id: eventProperties.snykOrgId
          }
      }
    AnalyticsClient.sendEvent(eventMessage)
    this.addon.settings.get('snykSettings', clientKey)
      .then((settings) => {
        if (settings && settings.anonymousid) {
          this.addon.settings.set('snykSettings',{anonymousid: settings.anonymousid} ,clientKey)
          .then (() => res.status(200).send({ status: 'restarted' }))
        } else {
          this.addon.settings.del('snykSettings',clientKey)
          .then (() => res.status(200).send({ status: 'restarted' }))
        }        
      })
     
    }).catch((err) => {
      logger.error({clientkey: clientKey, message: err.toString()})
      res.status(status.BAD_REQUEST).send(err)
    })
  }

  setState (req, res) {
    const clientKey = req.context.clientKey
    const tokenService = new TokenService(this.addon, clientKey)
    const redirectUri = tokenService.getRedirectUri(this.addon.config.localBaseUrl())
    tokenService.generateNewToken()
      .then((state) => {
        if (state === '') {
          return res.status(status.BAD_REQUEST).send('')
        }
        res.status(200).send({ token: state, clientid: this.addon.config.clientId(), url: redirectUri })
      })
      .catch((err) => {
        logger.error({ message: err.toString(), clientkey: clientKey })
        return res.status(status.BAD_REQUEST).send('')
      })
  }

  saveOrg (req, res) {
    const clientKey = req.context.clientKey
    this.addon.settings.get('snykSettings', clientKey)
      .then((settings) => {
        settings.orgid = req.body.id
        settings.orgname = req.body.name
        settings.orgslug = req.body.slug
        this.addon.settings.set('snykSettings', settings, clientKey)
          .then(() => res.status(201).send({ id: settings.orgid, name: settings.orgname }))
          .catch((err) => {
            logger.error({ message: err.toString(), clientkey: clientKey })
            return res.status(status.BAD_REQUEST).send('')
          })
      }).catch((err) => {
        logger.error({ message: err.toString(), clientkey: clientKey })
        return res.status(status.BAD_REQUEST).send('')
      })
  }
}
module.exports = AppAPIHandler
