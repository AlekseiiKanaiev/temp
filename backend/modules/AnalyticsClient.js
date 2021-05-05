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
    const workspaceId = clientSettings.principal.uuid.replace('{', '').replace('}', '')
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
      anonymousId: anonymousId,
      clientKey: clientKey
    }
  }

  async replaceTemplateVariables (clientKey, eventMessage) {
    const eventProperties = await this.getEventProperties(clientKey)
    let eventMessageString = JSON.stringify(await this.addAttributesToEventMessage(eventProperties, eventMessage, clientKey))
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

  async addAttributesToEventMessage (eventProperties, eventMessage, clientKey) {
    const eventMessageCopy = eventMessage
    if (eventProperties.anonymousId) {
      eventMessageCopy.anonymousId = eventProperties.anonymousId
    }
    if (eventMessage.properties) {
      eventMessageCopy.properties.connect_app_client_key = eventProperties.clientKey
    } else {
      eventMessageCopy.properties = { connect_app_client_key: eventProperties.clientKey }
    }
    if (eventProperties.workspaceName) {
      eventMessageCopy.properties.workspace_name = eventProperties.workspaceName
    }
    if (eventProperties.workspaceId) {
      eventMessageCopy.properties.workspace_id = eventProperties.workspaceId
    }
    if (eventProperties.snykUserId) { eventMessageCopy.userId = eventProperties.snykUserId }
    if (eventMessageCopy.properties.bb_user_id) {
      eventMessageCopy.properties.bb_user_id = eventMessageCopy.properties.bb_user_id.replace('{', '').replace('}', '')
      const bbUserRole = await this.getUserRoleInWorkspace(eventProperties.workspaceId, eventMessageCopy.properties.bb_user_id, clientKey)
      eventMessageCopy.properties.bb_user_role = bbUserRole
    }
    // if (eventProperties.bbUserId) {
    //  eventMessageCopy.properties.bb_user_id = eventProperties.bbUserId
    // }
    if (eventProperties.snykOrgId) {
      eventMessageCopy.properties.snyk_org_id = eventProperties.snykOrgId
    }
    return eventMessageCopy
  }

  async getUserRoleInWorkspace (workspaceId, userUuid, clientKey) {
    const httpClient = this.addon.httpClient({ clientKey })
    return new Promise((resolve, reject) => {
    //  httpClient.get(`/2.0/workspaces/{${workspaceId}}/members/{${userUuid}}`, function (err, resp, data) {
      httpClient.get({ url: `/2.0/workspaces/{${workspaceId}}/permissions`, qs: { q: encodeURIComponent(`user.uuid=${userUuid}`) } }, function (err, resp, data) {
        if (err) {
          logger.warn({ message: err, clientkey: clientKey })
          resolve('')
        } else {
          const body = JSON.parse(data)
          resolve('')
        }
      })
    })
  }
}
module.exports = new AnalyticsClient()
