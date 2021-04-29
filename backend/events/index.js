import { v4 as uuidv4 } from 'uuid';
const { logger } = require('../logger')
const AnalyticsClient = require('../modules/AnalyticsClient')

module.exports = function events (addon) {
    AnalyticsClient.init(addon)
    addon.on('host_settings_saved', function(clientKey, data) {
        let anonymousId = data.principal.uuid ? data.principal.uuid : (
            data.user.uuid ? data.user.uuid : uuidv4()
        )
        anonymousId = anonymousId.replace('{', '').replace('}', '')
        addon.settings.set('snykSettings', {anonymousid: anonymousId}, clientKey)
        .then(() => {
            const eventMessage = {
                anonymousId: anonymousId,
                event: 'connect_app_app_installed',
                    properties: {
                        client_key: clientKey,
                        workspace_name: data.principal.username,
                        workspace_id: data.principal.uuid,
                        bb_user_id: data.actor.uuid
                    }
                }
            AnalyticsClient.sendEvent(eventMessage)
        })
        .catch((err) => {
          logger.error({clientkey: clientKey, message: err})
        })
    });
}