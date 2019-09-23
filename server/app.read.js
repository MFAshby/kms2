const {validateBody, provideSession} = require('./app.middleware')
const {generateKeyPair, createPrivateKey} = require('crypto')

function addReadRoute(app, driver) {
  app.post('/read', 
    validateBody('../static/schemas/read.json'), 
    provideSession(driver),
    async (req, res, next) => {
    try {
      // Find a path from the entrypoint to the desired node
      // Decrypt the private key on the entrypoint node with the provided secret
      // Decrypt the private key on each _link_ of the chain using the previous
      // private key
      // Return the decrypted terminating private key
      let data = req.body
      let result = await req.session.run(
        `match (a:Entrypoint {publicID: $entryPublicID}) 
         return a`,
        {entryPublicID: data.entrypoint.publicID}
      )
      let singleRecord = result.records[0]
      if (singleRecord === undefined) {
        res.status(404).send()
        return 
      }


      let node = singleRecord.get(0)
      let returnVal = {...node.properties}
      res.status(200).send(returnVal)
    } catch (e) {
      next(e) 
    }
  })
}

module.exports = addReadRoute