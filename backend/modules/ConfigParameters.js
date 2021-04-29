
const { logger } = require('../logger')

class ConfigParameters {

    allParametersExist(addon) {
        const {snykAnalyticsKey} = addon.config.snyk()
        let errorMessage = ''
        if (snykAnalyticsKey === '$SNYKANALYTICSKEY') {
            errorMessage += 'snykAnaliticsKey '
        }
        if (addon.config.clientId() === '$CLIENTID') {
            errorMessage += 'clientId '
        }
        if (addon.config.clientSecret() === '$CLIENTSECRET') {
            errorMessage += 'clientSecret '
        }
        if (addon.config.localBaseUrl() === '$APP_URL') {
            errorMessage += 'localBaseUrl '
        }
        if (errorMessage) {
            logger.error({clientkey: 'app', message:`parameters ${errorMessage} not provided in config.json`})
            return false
        }
        return true
        
    }
}
module.exports = new ConfigParameters();