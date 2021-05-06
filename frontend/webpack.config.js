var path = require('path');


module.exports = {
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
          }
        ]
    },
    watch: (process.argv.indexOf('--no-watch') > -1) ? false : true,
    entry: {
       'snyk.repo.page': path.resolve('./src/snykRepoPage.js'),
       'snyk.account.page': path.resolve('./src/SnykAccountPage.js'),
       'snyk.auth.page': path.resolve('./src/SuccessfullyAuthorized.js'),
    },
    output: {
        filename: 'bundled.[name].js',
        path: path.resolve("../backend/public/dist")
    }
};