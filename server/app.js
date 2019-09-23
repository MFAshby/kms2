const express = require('express')
const path = require('path')
const initDatabase = require('./database')
const addHealthcheckRoute = require('./app.healthcheck')
const addCreateEntrypointRoute = require('./app.create-entrypoint')
const addGrantRoute = require('./app.grant')
const addReadRoute = require('./app.read')

// Create the express app
async function createApp() {
  let driver = await initDatabase()
  let app = express()

  // Serve static content
  app.use('/static', express.static(path.join(__dirname, '../static')))

  // Use JSON body parser
  app.use(express.json())

  // Log all errors
  app.use((req, res, next, err) => {
    console.log(err)
    next(err)
  })

  // Add routes
  addHealthcheckRoute(app)
  addCreateEntrypointRoute(app, driver)
  addGrantRoute(app, driver)
  addReadRoute(app, driver)
  
  return app
}

module.exports = createApp
