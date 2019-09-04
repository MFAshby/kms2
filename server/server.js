// KMS2
// Cryptographic management
// This service provides a generic way to grant decryption access to data,
// through a graph of intermediates
// It also provides an in-memory cache of secrets, for privileged services
// to use for jobs that require crypto access, but don't have it.

// Use express as our webserver
const express = require('express')

// Use neo4j as our database
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD))

/**
 * Nodes in the graph contain the public key
 */
class Node {
    type
    labels
    publicKey

    // Optionally have the encrypted private key ON the node itself
    // This marks it as an entry node, and the encrypted private key
    // here will be decrypted by an external key
    encryptedPrivateKey
}

/**
 * Edges in the graph contain the encrypted private key
 */
class Edge {
    type
    labels
    encryptedPrivateKey
}

// Configure routing
const app = express()
// Adds a new node
//  Will generate a key pair.
//  Requires a password (or key derived from the password) to encrypt the private key
// app.post('/node', createNode)

// Adds a new edge,
//  if toUuid doesn't exist then a new node is created
// app.post('/grant/:fromUuid/:toUuid', createGrant)

// app.get('/read/:targetUuid/')

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))

async function createPerson(req, res) {
    const session = driver.session()
    const personName = 'Alice'
    let result = await session.run(
      'CREATE (a:Person {name: $name}) RETURN a',
      {name: personName}
    )
    const singleRecord = result.records[0]
    const node = singleRecord.get(0)
    session.close()
    res.send(node)
}