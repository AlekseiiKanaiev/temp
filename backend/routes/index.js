const util = require('util')
const status = require('http-status')
const RouteUtils = require('./RouteUtils')
const { WebhookHandler, SnykAPIHandler, BitbucketAPIHandler } = require('./handlers/index')
const { SnykClient } = require('./../modules')

module.exports = function routes (app, addon) {
  const { baseUrl } = addon.config.snyk()
  const snykApiHandler = SnykAPIHandler.newInstance(SnykClient.newInstance.bind(null, baseUrl), addon)
  const bbApiHandler = BitbucketAPIHandler.newInstance(addon)
  const webhookHander = WebhookHandler.newInstance(addon)

  // healthcheck route used by micros to ensure the addon is running.
  app.get('/healthcheck', RouteUtils.sendOK)

  // Root route. This route will redirect to the add-on descriptor: `atlassian-connect.json`.
  app.get('/', function (req, res) {
    console.log('ROOT ENDPOINT')
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
    const { clientKey } = req.context
    addon.settings.del('clientInfo', clientKey)
      .then(() => {addon.settings.del('snykToken', clientKey)
                  .then(() => res.status(status.OK).send())
                  .catch((err) => res.status(status.BAD_REQUEST).send(err))
                  
      })
      .catch((err) => res.status(status.BAD_REQUEST).send(err))
  })

  app.get('/pages*', addon.authenticate(), webhookHander.pages.bind(webhookHander))

  // This route will handle webhooks from repositories this add-on is installed for.
  // Webhook subscriptions are managed in the `modules.webhooks` section of
  // `atlassian-connect.json`

  app.post('/webhook', addon.authenticate(), webhookHander.handle)
  app.all('/snyk/*', addon.authenticate(), snykApiHandler.pipe.bind(snykApiHandler))
  app.all('/bb/*', addon.authenticate(), bbApiHandler.pipe.bind(bbApiHandler))
}
