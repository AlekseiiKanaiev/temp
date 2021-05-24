const request = require('request')
const { logger } = require('../logger')

class BitbucketUser {
  constructor (addon) {
    this.addon = addon
  }

  // async getUsernameByToken (token) {
  //   const restApiToken = await BitbucketUser.getRestApiToken(token)
  //   const aa = ''
  // }

  async getRestApiToken (token) {
    return await new Promise((resolve, reject) => {
      request.post(
        'https://bitbucket.org/site/oauth2/access_token',
        {
          headers: {
            // Authorization: `JWT ${jwtToken}`
            Authorization: `JWT ${token}`
          },
          json: {
            grant_type: 'grant_type=urn:bitbucket:oauth2:jwt'
          }
        },
        (error, res, body) => {
          if (error) {
            logger.error(error)
            resolve({ error: 'error getting Bitbucket Rest Api Token' })
          }
          return resolve(body)
        }
      )
    })
  }
}

module.exports = BitbucketUser
