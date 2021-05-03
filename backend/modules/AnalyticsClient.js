const Analytics = require('analytics-node')
const { logger } = require('../logger')

class AnalyticsClient {
  init (addon) {
    const { snykAnalyticsKey } = addon.config.snyk()
    this.analytics = new Analytics(snykAnalyticsKey)
    this.addon = addon
  }

  async sendEvent (clientKey, eventMessage) {
    const eventMessageToSend = await this.replaceTemplateVariables(clientKey, eventMessage)
    logger.info(eventMessageToSend)
    this.analytics.track(
      eventMessageToSend, (err, data) => {
        if (err) {
          logger.error({ clientkey: clientKey, message: err })
        }
      })
  }

  async sendIdentify (clientKey, identMessage) {
    const identMessageToSend = await this.replaceTemplateVariables(clientKey, identMessage)

    logger.info(`ident: ${JSON.stringify(identMessageToSend)}`)
    this.analytics.identify(
      identMessageToSend, (err, data) => {
        if (err) {
          logger.error({ clientkey: clientKey, message: err })
        }
      })
  }

  async getEventProperties (clientKey) {
    const clientSettings = await this.addon.settings.get('clientInfo', clientKey)
    const snykSettings = await this.addon.settings.get('snykSettings', clientKey)
    const workspaceName = snykSettings.workspacename
    const workspaceId = clientSettings.principal.uuid
    const bbUserId = clientSettings.actor.uuid
    const snykUserId = snykSettings.snykuserid
    const snykOrgId = snykSettings.orgid
    const anonymousId = snykSettings.anonymousid
    return {
      workspaceName: workspaceName,
      workspaceId: workspaceId,
      bbUserId: bbUserId,
      snykUserId: snykUserId,
      snykOrgId: snykOrgId,
      anonymousId: anonymousId
    }
  }

  async replaceTemplateVariables (clientKey, eventMessage) {
    const eventProperties = await this.getEventProperties(clientKey)
    let eventMessageString = JSON.stringify(eventMessage)
    eventMessageString = eventMessageString.replace(/{clientkey}/g, clientKey)
    if (eventProperties.workspaceName) {
      eventMessageString = eventMessageString.replace(/{workspacename}/g, eventProperties.workspaceName)
    }
    if (eventProperties.workspaceId) {
      eventMessageString = eventMessageString.replace(/{workspaceid}/g, eventProperties.workspaceId)
    }
    if (eventProperties.bbUserId) {
      eventMessageString = eventMessageString.replace(/{bbuserid}/g, eventProperties.bbUserId)
    }
    if (eventProperties.snykUserId) {
      eventMessageString = eventMessageString.replace(/{snykuserid}/g, eventProperties.snykUserId)
    }
    if (eventProperties.snykOrgId) {
      eventMessageString = eventMessageString.replace(/{snykorgid}/g, eventProperties.snykOrgId)
    }
    if (eventProperties.anonymousId) {
      eventMessageString = eventMessageString.replace(/{anonymousid}/g, eventProperties.anonymousId)
    }
    return JSON.parse(eventMessageString)
  }
}
module.exports = new AnalyticsClient()
