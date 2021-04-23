const status = require('http-status')
const util = require('util')
const { logger } = require('../../logger')

class WebhookHandler {
  constructor (addon) {
    this.addon = addon
  }

  static newInstance (addon) {
    return new WebhookHandler(addon)
  }

  root (req, res) {
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
  }

  pages (req, res) {
    if (req.url.startsWith('/pages/repo')) { this.pagesRepo(req, res) }
    if (req.url.startsWith('/pages/account')) { this.pagesAccount(req, res) }
  }

  pagesRepo (req, res) {
    const httpClient = this.addon.httpClient(req)
    const { workspaceSlug, repoSlug, repoMainBranch, repoOwner, useruuid, targetuseruuid } = req.query
    const owner = repoOwner === '{repository.owner.username}' ? workspaceSlug : repoOwner
    const clientKey = req.context.clientKey
    /* httpClient.get(`/2.0/repositories/${workspace}/${repoSlug}`, function (err, resp, data) {
      try {
        data = JSON.parse(data)

      } catch (e) {
        console.log(e)
        res.status(status.BAD_REQUEST).send({ error: e.message })
      }
    }) */
    httpClient.get('/2.0/user/', function (err, resp, data) {
      let username = ''
      try {
        if (err) {
          logger.warn({ message: err, clientkey: clientKey })
        } else {
          data = JSON.parse(data)
          username = data.username
        }
      } catch (e) {
        logger.warn({ message: e.toString(), clientkey: clientKey })
      }
      res.render('snyk-repo-page', {
        title: 'SNYK',
        displayName: data.display_name,
        repoPath: req.query.repoPath,
        username: useruuid === targetuseruuid ? username : '',
        repoOwner: owner,
        repoSlug: repoSlug,
        repoMainBranch: repoMainBranch
      })
    }).catch((err) => {
      logger.error({ message: err.toString(), clientkey: clientKey })
      res.status(status.BAD_REQUEST).send({})
    }
    )
  }

  pagesAccount (req, res) {
    const { useruuid, targetuseruuid } = req.query
    const httpClient = this.addon.httpClient(req)
    const clientKey = req.context.clientKey
    /* const url = `/users/${useruuid}`
    httpClient.get(url, function (err, resp, data) {
      try {
        data = JSON.parse(data)

      } catch (e) {
        console.log(e)
        res.status(status.BAD_REQUEST).send({ error: e.message })
      }
    }) */

    this.addon.settings.get('clientInfo', clientKey)
      .then((settings) => {
        httpClient.get('/2.0/user/', function (err, resp, data) {
          let username = ''
          try {
            if (err) {
              logger.warn({ message: err, clientkey: clientKey })
            } else {
              data = JSON.parse(data)
              username = data.username
            }
          } catch (e) {
            logger.warn({ message: e.toString(), clientkey: clientKey })
          }
          res.render('snyk-account-page', {
            title: 'Account',
            username: useruuid === targetuseruuid ? username : ''
          })
        })
      }).catch((err) => {
        logger.error({ message: err.toString(), clientkey: clientKey })
        res.status(status.BAD_REQUEST).send({})
      })
  }

  handle (req, res) {
    console.log(util.inspect(req.body, {
      colors: true,
      depth: null
    }))
    res.send(status.ACCEPTED)
  }
}
module.exports = WebhookHandler
