const util = require('util')
const { BBInstallationContext } = require('./../../entities')
const {logger} = require('../../logger')

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
    this.addon.settings.get("snykSettings", req.context.clientKey) 
    .then((settings)=> {
      const client = this.factory(req.context, settings.apitoken)
      return client.pipe(req.path.replace('/snyk', '').replace("orgid", settings.orgid), req, res)
    }).catch((err) => {
      logger.error(err)
      return res.status(status.BAD_REQUEST).send("")
    })

    
  }
}

module.exports = SnykAPIHandler
