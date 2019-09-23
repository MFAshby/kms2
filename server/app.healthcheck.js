function addHealthcheckRoute(app) {
  app.get('/health', (req, res) => {
    res.status(200).send('OK')
  })
}
module.exports = addHealthcheckRoute