// DEPENDENCIES
const mongoose = require('mongoose')

// LOCAL DEPENDENCIES
const getEnvMongoUrl = require('./lib/getEnvMongoUrl')
const config = require('./config.json')

// CONNECT THE DATABASE
const mongoUrl = getEnvMongoUrl(config)
mongoose.connect(mongoUrl)

// LOAD AND CONFIG SERVER
const app = require('./lib/server')

// START THE SERVER
const port = process.env.PORT || 5000
app.listen(port).on('error', function (err) { console.log(err) })
console.log(`App listening on port: ${port}`)
