const request = require('supertest')
const uuid = require('uuid/v1')
const createApp = require('./app')
const { postJson } = require('./test-utils.js')

var app
describe('grant endpoint', () => {
  beforeEach(async done => {
    app = await createApp()
    done()
  })

  it('rejects missing entrypoint', async done => {
    let response = await postJson(app, request, '/grant', {})
    expect(response.statusCode).toBe(400)
    done()
  })

  // TODO other validation tests
  // TODO invalid secret test
  // TODO no route test
  // TODO route length 0, 1, n
  //   Expect to refactor this code with the /read endpoint too

  // it('grants access to a new node', async done => {
  //   // GIVEN an entrypoint
  //   let idEntrypoint = uuid()
  //   let createResponse = await postJson(app, request, '/create-entrypoint', {
  //     "publicID": idEntrypoint,
  //     "secret": "some-secret-data"
  //   })
  //   expect(createResponse.statusCode).toBe(200)

  //   // WHEN grant access directly from the entrypoint to the a node
  //   let idNewNode = uuid()
  //   let grantResponse = await postJson(app, request, '/grant', {
  //     "entrypoint": {
  //       "publicID": idEntrypoint,
  //       "secret": "some-secret-data"
  //     },
  //     "fromPublicID": idEntrypoint,
  //     "toPublicID": idNewNode
  //   })
  //   expect(grantResponse.statusCode).toBe(200)

  //   // THEN can the private key from the new node
  //   let readResponse = await postJson(app, request, '/read', {
  //     "entrypoint": {
  //       "publicID": idEntrypoint,
  //       "secret": "some-secret-data",
  //     },
  //     "publicID": idNewNode
  //   })
  //   expect(grantResponse.statusCode).toBe(200)
  //   // TODO I should have the private key here
  //   done()
  // })
})