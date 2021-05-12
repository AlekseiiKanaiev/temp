const { exit } = require('process')
const fs = require('fs');
const atlassianConnectFile = require('../atlassian-connect.json');

class VersionService {
    static async updateVersionInAtlassianConnect(version) {
        const desc = atlassianConnectFile.description
        const ind = desc.indexOf("(version")
        atlassianConnectFile.description = `${desc.substring(0, ind)}(version ${version})`
        await this.saveFile(atlassianConnectFile)
        
    }

    static async saveFile(value) {
        return await new Promise((resolve, reject) => {
            fs.writeFile('atlassian-connect.json', JSON.stringify(value, null, 2), function writeJSON(err) {
                if (err) {
                    reject(err);
                }
                resolve('')
              });
        })

    }
}

module.exports = VersionService