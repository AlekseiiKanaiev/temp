const Analytics = require('analytics-node');
const {logger} = require('../logger')

class AnalyticsClient {
    constructor() {
    }

    init(addon) {
        const {snykAnalyticsKey} = addon.config.snyk()
        this.analytics = new Analytics(snykAnalyticsKey);
        this.addon = addon
    }

    sendEvent(eventMessage) {
        logger.info(eventMessage)
        /*this.analytics.track(
            eventMessage, (err, data) => {
                if (err) {
                    logger.error({clientkey: eventMessage.properties.client_key, message: err})
                }
            })
            */
    }

    sendIdentify(identMessage) {
        logger.info(`ident: ${JSON.stringify(identMessage)}`)
        /*this.analytics.identify(
            eventMessage, (err, data) => {
                if (err) {
                    logger.error({clientkey: eventMessage.properties.client_key, message: err})
                }
            })
            */
    }

    async getEventProperties(clientKey) {
        const clientSettings = await this.addon.settings.get('clientInfo', clientKey)
        const snykSettings = await this.addon.settings.get('snykSettings', clientKey)
        const workspaceName = clientSettings.principal.username
        const workspaceId = clientSettings.principal.uuid
        const bbUserId = clientSettings.actor.uuid
        const snykUserId = snykSettings.snykUserId
        const snykOrgId = snykSettings.orgid
        return {workspaceName: workspaceName, 
                workspaceId: workspaceId,
                bbUserId: bbUserId,
                snykUserId: snykUserId,
                snykOrgId: snykOrgId}
    }
}
module.exports = new AnalyticsClient();