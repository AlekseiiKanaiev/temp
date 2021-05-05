const request = require('request')
const { logger } = require('../logger')

class AppPassword {
  static async checkAppPassword (username, appPassword, workspaceSlug, repoSlug) {
    if (workspaceSlug && repoSlug) {
      return new Promise((resolve, reject) => {
        request.get(`https://api.bitbucket.org/2.0/repositories/${workspaceSlug}/${repoSlug}`,
          {
            auth: {
              user: username,
              pass: appPassword,
              sendImmediately: true
            }
          },
          function (error, response, body) {
            if (error) {
              return resolve({ error: true, message: error })
            }
            if (response.statusCode >= 400) {
              return resolve({ error: true, message: 'username or app password is invalid' })
            }
            return resolve({ error: false, message: 'success' })
          })
      })
    } else {
      return new Promise((resolve, reject) => {
        request.get('https://api.bitbucket.org/2.0/user',
          {
            auth: {
              user: username,
              pass: appPassword,
              sendImmediately: true
            }
          },
          function (error, response, body) {
            if (error) {
              return resolve({ error: true, message: error })
            }
            if (response.statusCode >= 400) {
              return resolve({ error: true, message: 'username or app password is invalid' })
            }
            return resolve({ error: false, message: 'success' })
          })
      })
    }
  }
}

module.exports = AppPassword
