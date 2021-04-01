const util = require('util')
const { BBInstallationContext } = require('./../../entities')

class SnykAPIHandler {
  constructor (factory, addon) {
    this.factory = factory
    this.addon = addon
  }

  static newInstance (factory, addon) {
    return new SnykAPIHandler(factory, addon)
  }

  pipe (req, res) {
    console.log(util.inspect(req.context, {
      colors: true,
      depth: null
    }))
    const client = this.factory(req.context)
    return client.pipe(req.path.replace('/snyk', ''), req, res)
  }
}

module.exports = SnykAPIHandler
