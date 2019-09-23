const request = require('supertest')
const uuid = require('uuid/v1')
const createApp = require('./app')
const { postJson } = require('./test-utils.js')

var app
describe('read endpoint', () => {
  beforeEach(async done => {
    app = await createApp()
    done()
  })
  
  it('rejects requests with missing publicID', async done => {
    let result = await postJson(app, request, '/read', {
      "entrypoint": {
        "publicID": uuid(),
        "secret": "some-secret-data"
      }
    })
    expect(result.statusCode).toBe(400)
    done()
  })

  it('rejects requests with missing or malformed entrypoint', async done => {
    let result = await postJson(app, request, '/read', {
      "publicID": uuid()
    })
    expect(result.statusCode).toBe(400)

    let result2 = await postJson(app, request, '/read', {
      "entrypoint": {},
      "publicID": uuid()
    })
    expect(result2.statusCode).toBe(400)

    let result3 = await postJson(app, request, '/read', {
      "entrypoint": {
        "secret": "bogus"
      },
      "publicID": uuid()
    })
    expect(result3.statusCode).toBe(400)

    let result4 = await postJson(app, request, '/read', {
      "entrypoint": {
        "publicID": uuid()
      },
      "publicID": uuid()
    })
    expect(result4.statusCode).toBe(400)
    done()
  })

  it('returns not found when desired node is not found', async done => {
    let result = await postJson(app, request, "/read", {
        "entrypoint": {
          "publicID": uuid(),
          "secret": "some-secret-data"
        },
        "publicID": "034e613b-6fd1-40d3-9723-13b952bc5fe1"
      }
    )
    expect(result.statusCode).toBe(404)
    done()
  })

  // it('accepts inputs with multiple publicIDs', async done => {
  //   let result = await postJson(app, request, "/read", {
  //       "entrypoint": {
  //         "publicID": "158be30f-dc38-46e0-8986-9d64d93912ef",
  //         "secret": "some-secret-data"
  //       },
  //       "publicIDs": [
  //         "034e613b-6fd1-40d3-9723-13b952bc5fe1",
  //         "d3284c3a-83d1-4e24-a32e-126ad204cd2e",
  //         "9b04ca92-2990-467d-a800-a9363615b16a",
  //       ]
  //     }
  //   )
  //   expect(result.statusCode).toBe(true)
  //   done()
  // })
})