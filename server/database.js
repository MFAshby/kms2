const neo4j = require('neo4j-driver').v1
const driver = neo4j.driver(process.env.NEO4J_URI, 
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD))
async function initDatabase() {
  let session = driver.session()
  await session.run("create constraint on (u:Entrypoint) assert u.publicID is unique")
  await session.run("create constraint on (u:Node) assert u.publicID is unique")
  session.close()
  return driver
}
module.exports = initDatabase
