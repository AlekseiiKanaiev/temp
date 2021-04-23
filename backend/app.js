// Entry point for the app

// // Express is the underlying web framework: https://expressjs.com
const express = require('express')

// https://expressjs.com/en/guide/using-middleware.html
const bodyParser = require('body-parser')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const hbs = require('express-hbs')
const errorhandler = require('errorhandler')

// atlassian-connect-express also provides a middleware
const ace = require('atlassian-connect-express')

// We also need a few stock Node modules
const http = require('http')
const path = require('path')

// Routes live here; this is the C in MVC
const routes = require('./routes')
const { logger } = require('./logger')
const { httpLogger } = require('./logger')

// Bootstrap Express and atlassian-connect-express
const app = express()
const addon = ace(app, {
  config: {
    descriptorTransformer: (descriptor, config) => {
      // make descriptor transformations here
      return descriptor
    }
  }
})

// See config.json
const port = addon.config.port()
app.set('port', port)

// Static expiry middleware to help serve static resources efficiently
process.env.PWD = process.env.PWD || process.cwd() // Fix expiry on Windows :(
const expiry = require('static-expiry')

const viewsDir = path.resolve(__dirname, 'views')
app.engine('hbs', hbs.express4({ partialsDir: viewsDir }))
app.set('view engine', 'hbs')
app.set('views', viewsDir)
hbs.registerHelper('furl', function (url) { return app.locals.furl(url) })

// Log requests, using an appropriate formatter by env
const devEnv = app.get('env') === 'development'
if (devEnv === 'development') {
  // only use in development
  app.use(errorhandler())
}
app.use(morgan(devEnv ? 'dev' : 'combined'))

// Include request parsers
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({
  limit: '1mb'
}))
app.use(cookieParser())
app.use(httpLogger)

// Gzip responses when appropriate
app.use(compression())

// Use api.bitbucket.org instead of the deprecated bitbucket.org/api
app.post('/installed', function (req, res, next) {
  req.body.baseUrl = req.body.baseApiUrl
  next('route')
})

// Include atlassian-connect-express middleware
app.use(addon.middleware())

// Mount the static files directory
// Anything in ./public is served up as static content
const staticDir = path.join(__dirname, 'public')
app.use(express.static(staticDir))
// Enable static resource fingerprinting for far future expires caching in production
app.use(expiry(app, { dir: staticDir, debug: devEnv }))

// Show nicer errors in dev mode
// if (devEnv) app.use(errorHandler());

// Wire up routes
routes(app, addon)

// Boot the HTTP server
http.createServer(app).listen(port, () => {
  logger.info({ clientkey: 'app', message: 'App server running at ' + addon.config.localBaseUrl() })
  app.locals.addon = addon
  app.locals.url = addon.config.localBaseUrl()
})
