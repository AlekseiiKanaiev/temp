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
    /* httpClient.get(`/2.0/repositories/${workspace}/${repoSlug}`, function (err, resp, data) {
      try {
        data = JSON.parse(data)

      } catch (e) {
        console.log(e)
        res.status(status.BAD_REQUEST).send({ error: e.message })
      }
    }) */
    httpClient.get('/2.0/user/', function (err, resp, data) {
      try {
        data = JSON.parse(data)
        res.render('snyk-repo-page', {
          title: 'SNYK',
          displayName: data.display_name,
          repoPath: req.query.repoPath,
          username:  useruuid == targetuseruuid ? data.username : '',
          repoOwner: owner,
          repoSlug: repoSlug,
          repoMainBranch: repoMainBranch
        })
      } catch (e) {
        console.log(e)
        res.status(status.BAD_REQUEST).send({ error: e.message })
      }
    })
  }

  pagesAccount (req, res) {
    const { useruuid, targetuseruuid } = req.query
    const httpClient = this.addon.httpClient(req)
    /* const url = `/2.0/user`
    httpClient.asUserByAccountId('ebcab857-c769-4fbd-8ad6-469510a43b87').get(url, function (err, resp, data) {
      try {
        data = JSON.parse(data)

      } catch (e) {
        console.log(e)
        res.status(status.BAD_REQUEST).send({ error: e.message })
      }
    })
    */
    this.addon.settings.get('clientInfo', req.context.clientKey)
      .then((settings) => {
        httpClient.get('/2.0/user/', function (err, resp, data) {
          try {
            data = JSON.parse(data)
            res.render('snyk-account-page', {
              title: 'Account',
              username:  useruuid == targetuseruuid ? data.username : ''
            })
          } catch (e) {
            console.log(e)
            res.status(status.BAD_REQUEST).send({ error: e.message })
          }
        })
      }).catch((err) => {
        logger.error(err)
        res.status(status.BAD_REQUEST).send({ })
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
