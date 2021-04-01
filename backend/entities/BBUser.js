const Serializable = require('./Serializable')

const map = [
  ['has_2fa_enabled', 'tfaEnabled'],
  ['display_name', 'name'],
  ['uuid', 'uuid'],
  ['links', 'links'],
  ['type', 'type'],
  ['zoneinfo', 'zoneinfo'],
  ['account_status', 'status'],
  ['created_on', 'created'],
  ['is_staff', 'isStaff'],
  ['location', 'location'],
  ['department', 'department'],
  ['organization', 'organization'],
  ['job_title', 'jobTitle'],
  ['nickname', 'nickname'],
  ['properties', 'properties'],
  ['account_id', 'id']
]
class BBUser extends Serializable {
  constructor () {
    super(map)
    this.tfaEnabled = false
    this.name = null
    this.uuid = null
    this.links = null
    this.type = null
    this.zoneinfo = null
    this.status = null
    this.created = null
    this.isStaff = false
    this.location = null
    this.department = null
    this.organization = null
    this.jobTitle = null
    this.nickname = null
    this.properties = null
    this.id = null
  }

  static newInstance (data) {
    const inst = new BBUser()
    if (data != null) {
      inst.setProperties(data)
    }
    return inst
  }
}
module.exports = BBUser
