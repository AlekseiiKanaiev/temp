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
    watch : true,
    entry: {
       'snyk.repo.page': path.resolve('./src/snykRepoPage.js')
    },
    output: {
        filename: 'bundled.[name].js',
        path: path.resolve("../backend/public/dist")
    }
};