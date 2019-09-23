async function postJson(app, request, url, data) {
  return await request(app)
    .post(url)
    .set('Accept', 'application/json')
    .send(data)
}

module.exports = {
  postJson
}