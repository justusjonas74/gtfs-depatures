// DEPENDENCIES
const gtfs = require('gtfs')
const mongoose = require('mongoose')

// LOCAL DEPENDENCIES
const getEnvMongoUrl = require('./lib/getEnvMongoUrl')
const config = require('./config.json')

// CONFIGUARTION
var configEnv = {
  mongoUrl: getEnvMongoUrl(config),
  verbose: config.verbose || true,
  skipDelete: config.skipDelete || false,
  agencies: config.agencies
}

// CONNECT DB
mongoose.connect(configEnv.mongoUrl)

gtfs.import(configEnv)
  .then(() => {
    console.log('Import Successful')
    return mongoose.connection.close()
  })
  .catch(err => {
    console.error(err)
  })
