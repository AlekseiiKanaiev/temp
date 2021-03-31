const Serializable = require('./Serializable')

const map = [
  ['type', 'type'],
  ['uuid', 'uuid'],
  ['account_id', 'accid']
]
class BBActor extends Serializable {
  constructor () {
    super(map)
  }

  static newInstance (data) {
    const inst = new BBActor()
    if (data != null) {
      inst.setProperties(data)
    }
    return inst
  }
}
module.exports = BBActor
