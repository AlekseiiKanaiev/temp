const status = require('http-status')
const util = require('util')

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
    const httpClient = this.addon.httpClient(req)

    httpClient.get('/2.0/user/', function (err, resp, data) {
      try {
        data = JSON.parse(data)
        res.render('connect-example', {
          title: 'Atlassian Connect',
          displayName: data.display_name,
          repoPath: req.query.repoPath
        })
      } catch (e) {
        console.log(e)
        res.status(status.BAD_REQUEST).send({ error: e.message })
      }
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
