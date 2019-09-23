const request = require('supertest')
const uuid = require('uuid/v1')
const createApp = require('./app')
const { postJson } = require('./test-utils')

var app

describe('create-entrypoint endpoint', () => {
  beforeEach(async done => {
    app = await createApp()
    done()
  })

  it('should create an entrypoint successfully and read it back', async done => {
    let id = uuid()
    let createResponse = await postJson(app, request, '/create-entrypoint', {
      "publicID": id,
      "secret": "some-secret-data",
      "labels": {
        "label1": "value1",
        "label2": "value2"
      }
    })
    expect(createResponse.statusCode).toBe(200)

    let readResponse = await postJson(app, request, '/read', {
          "entrypoint": {
            "publicID": id,
            "secret": "some-secret-data"
          },
          "publicID": id
        })
    expect(readResponse.statusCode).toBe(200)
    expect(readResponse.body.publicID).toBe(id)
    expect(readResponse.body.publicKey).toBeDefined()
    expect(readResponse.body.encryptedPrivateKey).toBeDefined()
    // expect(readResponse.body.labels).toBe({
    //   "label1": "value1",
    //   "label2": "value2"
    // })
    // TODO check that public & private are a key pair
    done()
  })
})

describe('create-entrypoint input data is validated', () => {
  it('accepts valid data', async done => {
    let result = await postJson(app, request, "/create-entrypoint", {  
      "publicID": uuid(),
      "secret": "some-secret-data",
      "labels": {
        "label1": "value1",
        "label2": "value2"
      }
    })
    expect(result.statusCode).toBe(200)
    done()
  })

  it('rejects missing publicID', async done => {
    let result = await postJson(app, request, "/create-entrypoint", {  
      "secret": "some-secret-data",
      "labels": {
        "label1": "value1",
        "label2": "value2"
      }
    })
    expect(result.statusCode).toBe(400)
    done()
  })

  it('rejects missing secret', async done => {
    let result = await postJson(app, request, "/create-entrypoint", {  
      "publicID": uuid(),
      "labels": {
        "label1": "value1",
        "label2": "value2"
      }
    })
    expect(result.statusCode).toBe(400)
    done()
  })

  it('accepts 0 labels', async done => {
    let result = await postJson(app, request, "/create-entrypoint", {  
      "publicID": uuid(),
      "secret": "some-secret-data"
    })
    expect(result.statusCode).toBe(200)
    done()
  })

  it('rejects empty publicID', async done => {
    let result = await postJson(app, request, "/create-entrypoint", {  
      "publicID": "",
      "secret": "some-secret-data"
    })
    expect(result.statusCode).toBe(400)
    done()
  })

  it('rejects empty secret', async done => {
    let result = await postJson(app, request, "/create-entrypoint", {  
      "publicID": "some-id",
      "secret": ""
    })
    expect(result.statusCode).toBe(400)
    done()
  })
})