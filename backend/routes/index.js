const status = require('http-status')
const RouteUtils = require('./RouteUtils')
const { WebhookHandler, SnykAPIHandler, BitbucketAPIHandler, AppAPIHandler } = require('./handlers/index')
const { SnykClient } = require('./../modules')
const AnalyticsClient = require('../modules/AnalyticsClient')
const { logger } = require('../logger')

module.exports = function routes (app, addon) {
  const { baseUrl } = addon.config.snyk()
  const snykApiHandler = SnykAPIHandler.newInstance(SnykClient.newInstance.bind(null, baseUrl), addon)
  const bbApiHandler = BitbucketAPIHandler.newInstance(addon)
  const webhookHander = WebhookHandler.newInstance(addon)
  const appAPIHandler = AppAPIHandler.newInstance(addon, app)

  // healthcheck route used by micros to ensure the addon is running.
  app.get('/healthcheck', RouteUtils.sendOK)

  // Root route. This route will redirect to the add-on descriptor: `atlassian-connect.json`.
  app.get('/', function (req, res) {
    res.format({
      // If the request content-type is text-html, it will decide which to serve up
      'text/html': () => {
        res.redirect('/atlassian-connect.json')
      },
      // This logic is here to make sure that the `atlassian-connect.json` is always
      // served up when requested by the host
      'application/json': () => {
        res.redirect('/atlassian-connect.json')
      }
    })
  })

  app.post('/uninstalled', addon.authenticate(), function (req, res) {
    logger.info(req.body)
    const { clientKey } = req.context
    addon.settings.get('clientInfo', clientKey)
    .then((settings) => {
      const workspaceName = settings.principal.username
      const workspaceId = settings.principal.uuid
      const bbUserId = req.body.user.uuid
      addon.settings.del('clientInfo', clientKey)
        .then(() => {
          
              addon.settings.del('token', clientKey)
                .then(() => {
                  addon.settings.get('snykSettings', clientKey)
                  .then((settings) => {
                    if (settings && settings.snykuserid) {
                      const eventMessage = {
                        userId: settings.snykuserid,
                        event: 'connect_app_app_uninstalled',
                            properties: {
                                client_key: clientKey,
                                workspace_name: workspaceName,
                                workspace_id: workspaceId,
                                bb_user_id: bbUserId
                            }
                        }
                      AnalyticsClient.sendEvent(eventMessage)
                    } else {
                      if (settings && settings.anonymousid) {
                        const eventMessage = {
                            anonymousId: settings.anonymousid,
                            event: 'connect_app_app_uninstalled',
                                properties: {
                                    client_key: clientKey,
                                    workspace_name: workspaceName,
                                    workspace_id: workspaceId,
                                    bb_user_id: bbUserId
                                }
                            }
                        AnalyticsClient.sendEvent(eventMessage)
                      } else {
                        logger.error({clientkey: clientKey, message: "anonymousid and snykuserid not found in db on uninstall"})
                      }
                    }
                    addon.settings.del('snykSettings', clientKey)
                    .then(() => {
                      res.status(status.OK).send()
                    })
                  })
                })
            
        })
    }).catch((err) => {
      logger.info({clientkey: clientKey, message: err.toString()})
      res.status(status.BAD_REQUEST).send(err)
    })
  })

  app.post('/app/org', addon.checkValidToken(), appAPIHandler.saveOrg.bind(appAPIHandler))
  app.get('/app/org', addon.checkValidToken(), appAPIHandler.getOrg.bind(appAPIHandler))
  app.delete('/app/org', addon.checkValidToken(), appAPIHandler.deleteOrg.bind(appAPIHandler))
  app.get('/app/token', addon.checkValidToken(), appAPIHandler.getToken.bind(appAPIHandler))
  app.delete('/app/token', addon.checkValidToken(), appAPIHandler.deleteToken.bind(appAPIHandler))
  app.get('/app/oauth', appAPIHandler.oauth.bind(appAPIHandler))
  app.post('/app/state', addon.checkValidToken(), appAPIHandler.setState.bind(appAPIHandler))
  app.post('/app/integration', addon.checkValidToken(), appAPIHandler.restartIntegration.bind(appAPIHandler))
  app.get('/pages*', addon.authenticate(), webhookHander.pages.bind(webhookHander))

  // This route will handle webhooks from repositories this add-on is installed for.
  // Webhook subscriptions are managed in the `modules.webhooks` section of
  // `atlassian-connect.json`

  app.post('/webhook', addon.authenticate(), webhookHander.handle)
  app.all('/snyk/*', addon.checkValidToken(), snykApiHandler.pipe.bind(snykApiHandler))
  app.all('/bb/*', addon.authenticate(), bbApiHandler.pipe.bind(bbApiHandler))
}
