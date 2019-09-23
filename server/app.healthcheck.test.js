const request = require('supertest')
const createApp = require('./app')

var app
describe('Healthcheck endpoint', () => {
  beforeEach(async done => {
    app = await createApp()
    done()
  })

  it('It should return 200 always', async done => {
    let response = await request(app).get('/health')
    expect(response.statusCode).toBe(200)
    done()
  })
})
