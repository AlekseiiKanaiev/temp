import { v4 as uuidv4 } from 'uuid';
const { logger } = require('../logger')
const AnalyticsClient = require('../modules/AnalyticsClient')

module.exports = function events(addon) {
    AnalyticsClient.init(addon)
    addon.on('host_settings_saved', function(clientKey, data) {
        handleHostSettingsSaved(addon, clientKey, data)
        .then(() => {})        
        .catch((err) => {
            logger.error({clientkey: clientKey, message: err})
          });
    })
    

    async function handleHostSettingsSaved(addon, clientKey, data) {
        let anonymousId = data.principal.uuid ? data.principal.uuid : (
            data.user.uuid ? data.user.uuid : uuidv4()
        )
        anonymousId = anonymousId.replace('{', '').replace('}', '')
        let workspaceName = ''
        if (data.principal.username) {
            workspaceName = data.principal.username
        } else {
            workspaceName = await getUserName(addon, clientKey)
            
        }
        await saveSettings(anonymousId, workspaceName, clientKey)
        await sendAppInstalledEvent(anonymousId, workspaceName, clientKey, data)
    }

    async function saveSettings(anonymousId, workspaceName, clientKey) {
        await addon.settings.set('snykSettings', {anonymousid: anonymousId, workspacename: workspaceName}, clientKey)
    }

    async function sendAppInstalledEvent(anonymousId, workspaceName, clientKey, data) {
        const eventMessage = {
                anonymousId: anonymousId,
                event: 'connect_app_app_installed',
                    properties: {
                        workspace_name: workspaceName,
                        workspace_id: data.principal.uuid.replace('{','').replace('}',  ''),
                        bb_user_id: data.actor.uuid
                    }
                }
        await AnalyticsClient.sendEvent(clientKey, eventMessage)
    }

    async function getUserName(addon, clientKey) {
        const httpClient = addon.httpClient({
            clientKey: clientKey  
          })
          return ((resolve, reject) => {new Promise
                 httpClient.get('/2.0/user/', function (err, resp, data) {
                let username = ''
                try {
                  if (err) {
                    logger.warn({ message: err, clientkey: clientKey })
                  } else {
                    data = JSON.parse(data)
                    username = data.username
                  }
                } catch (e) {
                  logger.warn({ message: e.toString(), clientkey: clientKey })
                }
                return resolve(username)
              })
            })
    }
}