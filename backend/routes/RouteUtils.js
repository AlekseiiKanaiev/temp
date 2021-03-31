const status = require('http-status')

class RouteUtils {
  static sendOK (req, res) {
    res.status(status.OK).send()
  }

  static sendUnauthorized (req, res) {
    res.status(status.UNAUTHORIZED).send()
  }

  static sendNotImplemented (req, res) {
    res.status(status.NOT_IMPLEMENTED).send()
  }

  static sendMethodNotAllowed (req, res) {
    res.status(status.METHOD_NOT_ALLOWED).send()
  }

  static transformBaseUrl (req, res, next) {
    req.body.baseUrl = req.body.baseApiUrl
    next()
  }
}
module.exports = RouteUtils
