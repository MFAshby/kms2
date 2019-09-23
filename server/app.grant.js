const {generateKeyPair, createPrivateKey} = require('crypto')
const {validateBody, provideSession} = require('./app.middleware')

function addGrantRoute(app, driver) {
  app.post('/grant', 
    validateBody('../static/schemas/grant.json'),
    provideSession(driver), 
    async (req, res, next) => {
      try {
        // Find the entrypoint
        let data = req.body
        let entrypointMatch = await req.session.run(
          "match (a:Entrypoint {publicID: $publicID}) return a",
          {publicID: data.entrypoint.publicID}
        )
        if (entrypointMatch.records[0] === undefined) {
          res.status(404).send({error: "entrypoint.publicID not found"})
          return
        }

        // decrypt the private key of the entrypoint
        let entrypoint = { ...entrypointMatch.records[0].get(0).properties }
        let entrypointPrivateKey = createPrivateKey({
          key: entrypoint.privateKey,
          passphrase: data.entrypoint.secret
        }) // This will fail if the secret is wrong

        // Find the node or entrypoint to we're granting access _to_
        let toMatch = await req.session.run(
          "match (a {publicID: $toPublicID} return a",
          {toPublicID: data.toPublicID}
        )
        if (toMatch.records[0] === undefined) {
          res.status(404).send({error: "toPublicID not found"})
          return 
        }
        let toObject = {...toMatch.records[0].get(0).properties}

        // Find the node or entrypoint we're granting access _from_
        let fromMatch = await req.session.run(
          "match (a {publicID: $fromPublicID} return a",
          {fromPublicID: data.fromPublicID}
        )
        if (fromMatch.records[0] === undefined) {
          // Create a new key pair
          await generateKeyPair()
          req.session.run(`create (a:Node {publicID: $publicID, publicKey: $publicKey})  return a`)
          // Store the publicKey on a new node with the specified ID
          // Encrypt the private key with the public key of the to object
        } else {
          // Decrypt the private key 
          // Encrypt the private key 
        }
        let fromObject = {...fromMatch.records[0].get(0).properties}

        // Does the node we're granting access to already exist?
        // no
          // Generate a new node and edge, 
          // public key on the node, private key encrypted on the edge
        
        // yes
          // Decrypt the to-node private key using the edge from entrypoint
          // Re-encrypt the private key using the public key of the grantee node
          // Save a new edge.
      } catch(e) {
        next(e)
      }
    }
  )
}
module.exports = addGrantRoute