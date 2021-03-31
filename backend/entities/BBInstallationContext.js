const Serializable = require('./Serializable')
const BBUser = require('./BBUser')
const BBActor = require('./BBActor')

const map = [
  ['productType', 'productType'],
  ['principal', ['principal', BBUser.newInstance]],
  ['eventType', 'eventType'],
  ['baseUrl', 'baseUrl'],
  ['actor', ['actor', BBActor.newInstance]],
  ['publicKey', 'publicKey'],
  ['user', ['user', BBUser.newInstance]],
  ['key', 'key'],
  ['baseApiUrl', 'baseApiUrl'],
  ['clientKey', 'clientKey'],
  ['sharedSecret', 'sharedSecret'],
  ['snykUser', 'snykUser']
]
class BBInstallationContext extends Serializable {
  constructor () {
    super(map)
  }

  static newInstance (data) {
    const inst = new BBInstallationContext()
    if (data != null) {
      inst.setProperties(data)
    }
    return inst
  }

  setProperties (data) {
    super.setProperties(data)
    // it comes from atlassian-connect
    this.baseUrl = this.baseApiUrl
    return this
  }
}
module.exports = BBInstallationContext
