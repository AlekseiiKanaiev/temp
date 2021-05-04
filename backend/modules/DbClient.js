const { logger } = require('../logger')

class DbClient {
    static async getClientInfo(addon, clientKey) {
        return await addon.settings.get('clientInfo', clientKey)
    }
}

module.exports = DbClient

