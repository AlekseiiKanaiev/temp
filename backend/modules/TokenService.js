const request = require('request')
const jwtDecode = require('jwt-decode')
const { logger } = require('../logger')
const BitbucketUser = require('./BitbucketUser')
const AnalyticsClient = require('../modules/AnalyticsClient')

class TokenService {
  constructor (addon, clientKey) {
    this.addon = addon
    this.clientKey = clientKey
  }

  async generateNewToken () {
    const token = await this.generateUniqueToken()
    await this.updateCurrentTokenForClient(token)
    return token
  }

  async updateCurrentTokenForClient (token) {
    await this.addon.settings.set('token', { clientKey: this.clientKey, token: token }, this.clientKey)
  }

  async generateUniqueToken () {
    const token = this.generateToken(64)
    const clientKey = await this.findClientKeyForToken(token)
    return clientKey === '' ? token : await this.generateUniqueToken()
  }

  async findClientKeyForToken (token) {
    return await this.addon.settings._get({ key: 'token' })
      .then((settings) => {
        const clientKeys = settings.filter((element) => element.token === token).map((element) => element.clientKey)
        return clientKeys.length === 0 ? '' : clientKeys[0]
      }).catch((err) => {
        logger.error({ message: err.toString(), clientkey: this.clientKey })
        return ''
      })
  }

  getRedirectUri (localBaseUrl) {
    return `${localBaseUrl}/app/oauth`
  }

  generateToken (count) {
    const _sym = 'abcdefghijklmnopqrstuvwxyz1234567890'
    let str = ''

    for (let i = 0; i < count; i++) {
      str += _sym[parseInt(Math.random() * (_sym.length))]
    }
    return str
  }

  async saveSnykApiToken (redirectUri, code, state) {
    const clientId = this.addon.config.clientId()
    const clientSecret = this.addon.config.clientSecret()
    const { snykOauthUrl } = this.addon.config.snyk()
    const clientKey = await this.findClientKeyForToken(state)
    if (clientKey === '') {
      return { error: `client key for ${state} not found` }
    }

    // const bitbucketUsername = await BitbucketUser.getUsernameByToken(code)

    const snykApiTokenBody = await this.getSnykApiToken(clientId, clientSecret, redirectUri, code, snykOauthUrl)
    if (!(snykApiTokenBody.access_token && snykApiTokenBody.refresh_token) && !snykApiTokenBody.error) {
      snykApiTokenBody.error = 'access_token or refresh_token not found'
    }

    if (snykApiTokenBody.error) {
      return snykApiTokenBody
    }

    const snykUserId = await this.getSnykUserName(snykApiTokenBody.access_token)
    snykApiTokenBody.snykUserId = snykUserId
    await this.saveSnykApiTokenToDb(snykApiTokenBody, clientKey)
    await this.sendEventToAnalytics(snykUserId, clientKey)
    return snykApiTokenBody
  }

  async sendEventToAnalytics (snykUserId, clientKey) {
    const eventMessage = {
      userId: snykUserId,
      event: 'connect_app_user_authenticated',
      properties: {
        workspace_name: '{workspacename}',
        workspace_id: '{workspaceid}',
        bb_user_id: '{bbuserid}',
      }
    }
    await AnalyticsClient.sendEvent(clientKey, eventMessage)
  }

  async sendIdentifyToAnalytics (snykUserId, clientKey) {
    const identMessage = {
      anonymousId: '{anonymousid}',
      userId: snykUserId
    }
    await AnalyticsClient.sendIdentify(clientKey, identMessage)
  }

  async getSnykApiToken (clientId, clientSecret, redirectUri, code, snykOauthUrl) {
    return await new Promise((resolve, reject) => {
      request.post(
        snykOauthUrl,
        {
          json: {
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirectUri
          }
        },
        (error, res, body) => {
          if (error) {
            logger.error({ message: error.toString(), clientkey: this.clientKey })
            resolve({ error: 'error receiving snyk api token' })
          }
          return resolve(body)
        }
      )
    })
  }

  async getSnykUserName (accessToken) {
    return await new Promise((resolve, reject) => {
      const { baseUrl } = this.addon.config.snyk()
      request.get(
        `${baseUrl}user/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        },
        (error, res, body) => {
          if (error) {
            logger.error({ message: error.toString(), clientkey: this.clientKey })
            resolve({ error: 'error receiving snyk user id' })
          }
          return resolve(JSON.parse(body).id)
        }
      )
    })
  }

  async saveSnykApiTokenToDb (snykApiTokenBody, clientKey) {
    await this.addon.settings.get('snykSettings', clientKey)
      .then((settings) => {
        if (!settings) {
          settings = {}
        }
        settings.apitoken = snykApiTokenBody.access_token
        settings.snykuserid = snykApiTokenBody.snykUserId
        if (snykApiTokenBody.refresh_token) {
          settings.refresh_token = snykApiTokenBody.refresh_token
        }

        this.addon.settings.set('snykSettings', settings, clientKey)
          .then(() => {
          })
      })
      .catch((err) => logger.error({ message: err.toString(), clientkey: clientKey }))
  }

  async getToken (clientKey) {
    const settings = await this.getTokenFromDb(clientKey)
    const decoded = jwtDecode(settings.apitoken)
    const currentTimestamp = Math.ceil(Date.now() / 1000)
    if (decoded.exp - currentTimestamp < 3600) {
      const snykRefreshBody = await this.refreshToken(settings)
      await this.saveSnykApiTokenToDb(snykRefreshBody, clientKey)
      return snykRefreshBody.access_token
    } else {
      return settings.apitoken
    }
  }

  async getTokenFromDb (clientKey) {
    return await this.addon.settings.get('snykSettings', clientKey)
      .then((settings) => {
        return settings
      })
      .catch((err) => {
        logger.error({ message: err.toString(), clientkey: clientKey })
      })
  }

  async refreshToken (settings) {
    const clientId = this.addon.config.clientId()
    const clientSecret = this.addon.config.clientSecret()
    const { snykOauthUrl } = this.addon.config.snyk()
    return await new Promise((resolve, reject) => {
      request.post(
        snykOauthUrl,
        {
          json: {
            grant_type: 'refresh_token',
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: settings.refresh_token
          }
        },
        (error, res, body) => {
          if (error) {
            logger.error({ message: error.toString(), clientkey: this.clientKey })
            resolve({ error: 'error receiving snyk api token' })
          }
          return resolve(body)
        }
      )
    })
  }
}

module.exports = TokenService
