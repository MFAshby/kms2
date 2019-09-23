const crypto = require('crypto')
const util = require('util')
const {validateBody, provideSession} = require('./app.middleware')

const generateKeyPair = util.promisify(crypto.generateKeyPair)

function addCreateEntrypointRoute(app, driver) {
  app.post('/create-entrypoint', 
    validateBody('../static/schemas/create-entrypoint.json'), 
    provideSession(driver),
    async (req, res, next) => {
    try {
      let data = req.body
      // TODO move this into config
      let {publicKey, privateKey} = await generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: data.secret
        }
      })
      data.publicKey = publicKey
      data.privateKey = privateKey
      
      let result = await req.session.run(
        `create (a:Entrypoint 
          {publicID: $publicID, 
           publicKey: $publicKey, 
           encryptedPrivateKey: $privateKey}) return a`,
        data
      )
      res.status(200).send({"status": "OK"})
    } catch (e) {
      next(e) 
    }
  })
}

module.exports = addCreateEntrypointRoute