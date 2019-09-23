# kms2
input: password and some identifier for yourself (entrypoint), 
       some idenfier for the secret data you want to access (exitpoint)
output: 
## TODO

* Write the documentation :tick:
* Write the tests :running-man:
* Write the code :running-man:

* Database init - done, just create a unique index on publicID
* CRUD ops - in progress
* Validation - in progress
* Encryption - need to generate keypairs for nodes, need to manage encryption chains
* Caching
* Key rotation, especially on edge deletion, prevents forward access if 
someone remembered a key

## description
A generic key management system for providing shared access to encrypted data
in a flexible fashion.   

It provides a directed graph containing a network of public/private key pairs. 
Entrypoints to the graph require an externally provided secret. The graph can 
then be traversed to exit points, which contain shared encrypted data. 

## API
### create-entrypoint
endpoint: `POST /create-entrypoint` 

description: Creates a new entrypoint in the graph. 

input data: 
```js
{  
  // The public ID of the node to be created
  "publicID": "158be30f-dc38-46e0-8986-9d64d93912ef",
  // The secret data that should encrypt the private key on the entrypoint
  "secret": "some-secret-data",
  // Any labels that should be applied to the new node
  "labels": {
    "label1": "value1",
    "label2": "value2"
  }
}
```

return code: 200 for success

### grant
endpoint: `POST /grant`

description: Grant access to some data; i.e. create a link in the graph

input data: 
```js
{
  "entrypoint": {
    // The public ID of the node that is used as an entrypoint
    "publicID": "158be30f-dc38-46e0-8986-9d64d93912ef"
    // The secret that encrypts the private key of the entrypoint
    "secret": "some-secret-data"
  },
  // The public ID of the node to be granted access
  "fromPublicID": "cb84dca4-30c9-474d-8d88-f276ab2d0a72",
  // The public ID of the node to which access is granted
  "toPublicId": "034e613b-6fd1-40d3-9723-13b952bc5fe1"
}
```

return code: 
  200 for success, 
  401 if the provided entrypoint cannot access the node to which access is granted

### read
endpoint `POST /read`

description: Read the encrypted private key of a node

input data: 
```js
{
  "entrypoint": {
    // The public ID of the node that is used as an entrypoint
    "publicID": "158be30f-dc38-46e0-8986-9d64d93912ef"
    // The secret that encrypts the private key of the entrypoint
    "secret": "some-secret-data"
  },
  // The public ID of the node to be returned
  "publicID": "034e613b-6fd1-40d3-9723-13b952bc5fe1"
  // Alternatively, a list of public IDs to be returned
  "publicIDs": [
    "034e613b-6fd1-40d3-9723-13b952bc5fe1",
    "7bc721d4-f66e-45d9-862b-0225cccdb508"
  ]
}
```

return code: 200 for success, 401 if the provided entrypoint has no access to the node to be read.

output data: 
```js
{
  // The public ID of the node which was read
  "publicID": "034e613b-6fd1-40d3-9723-13b952bc5fe1",
  // The plaintext public key of the node
  "publicKey": "some-public-key"
  // The plaintext private key of the node
  "privateKey": "some-private-key",
  // Any labels on the node
  "labels": {
    "label1": "value1",
    "label2": "value2"
  }
}
```
Note that if a list of public IDs was requested, a list of nodes will be returned

### read-priv
endpoint: `/read-priv`

description: Read the encrypted private key of a node _if the private key is cached_. This is intended for privileged services
to access private data for maintenance purposes. Should be able to configure this (turn it off by default)

input data: 
```js
{
  // The public ID of the node to be returned
  "publicID": "034e613b-6fd1-40d3-9723-13b952bc5fe1",
  // Alternatively, a list of public IDs to be returned
  "publicIDs": [
    "034e613b-6fd1-40d3-9723-13b952bc5fe1",
    "7bc721d4-f66e-45d9-862b-0225cccdb508"
  ]
}
```

return code: 200 for success, 404 if the node private data isn't cached. 

output data: 
```js
{
  // The public ID of the node which was read
  "publicID": "034e613b-6fd1-40d3-9723-13b952bc5fe1",
  // The plaintext public key of the node
  "publicKey": "some-public-key"
  // The plaintext private key of the node
  "privateKey": "some-private-key",
  // Any labels on the node
  "labels": {
    "label1": "value1",
    "label2": "value2"
  }
}
```
Note that if a list of public IDs was requested, a list of nodes will be returned

### find
endpoint: `POST /find`

description: Find all nodes which are accessible from the entrypoint.
Optionally filtering on labels. Support pagination with a 'first' parameter

input data: 
```js
{
  "entrypoint": {
    // The public ID of the node that is used as an entrypoint
    "publicID": "158be30f-dc38-46e0-8986-9d64d93912ef"
    // The secret that encrypts the private key of the entrypoint
    "secret": "some-secret-data"
  },
  "spec": {
    // ID of the first node to match for pagination, optional
    "first": "158be30f-dc38-46e0-8986-9d64d93912ef",
    // A list of labels to match, optional
    "labels": []
  }
}
```

return code: 200 for success

output data: 
```js
{
  // a list of the matching nodes to which are accessible from the entrypoint
  "nodelist": [
    ...nodes
  ],
  // Returns true if there are more results.
  "more": true
}
```

### delete
TODO

### update
TODO