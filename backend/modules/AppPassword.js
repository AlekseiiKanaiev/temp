const request = require('request')

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
              return resolve({ error: true, message: 'Username or App Password are invalid or lack the required permissions' })
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
              return resolve({ error: true, message: 'Username or App Password are invalid or lack the required permissions' })
            }
            return resolve({ error: false, message: 'success' })
          })
      })
    }
  }
}

module.exports = AppPassword
