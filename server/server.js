const createApp = require('./app')
createApp()
  .then(app => app.listen(process.env.PORT, () => console.log(`KMS2 listening on port ${process.env.PORT}!`)))
