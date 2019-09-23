const jsonschema = require('jsonschema')

// Middleware to provide a database session
function provideSession(driver) {
  return (req, res, next) => {
    try {
      req.session = driver.session()
      next()
    } finally {
      req.session.close()
    }
  }
}

// Middleware to validate data passed to endpoints
function validateBody(schemaJsonFile) {
  const schema = require(schemaJsonFile)
  return (req, res, next) => {
    let result = jsonschema.validate(req.body, schema)
    if (!result.valid) {
      res.status(400).send(result.errors)
    } else {
      next()
    }
  }
}

module.exports = {
  provideSession, 
  validateBody
}