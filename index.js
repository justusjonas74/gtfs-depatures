// DEPENDENCIES
// const express = require('express')
// const app = express()
const mongoose = require('mongoose')

// CONNECT THE DATABASE
const config = require('./config.json')
require('./lib/db').connectDatabase(mongoose, config)

// SERVER
const app = require('./lib/server')

// START THE SERVER
const port = process.env.PORT || 5000
app.listen(port).on('error', function (err) { console.log(err) })
console.log(`App listening on port: ${port}`)

// TODO LIST
// Check how to test error handling. It's not possible for me to produce an err
// Exclude test data from test files (BE D-R-Y NOT W-E-T)
// Add Option "includeChilds" to all route
// Add Option "time" and "offset" to the route ../../departures
// Create Index StopTime.stop_id, StopTime.departure_time, StopTime.arrival_time, Stop.stop_name, Stop.parrent_station
// Create a wildcard route for all unsupported requests
// Create a version for the api
// Create a new importer
// FIX OFFSET RANGE > 23:59:59
// HANDLE DEPARTURES  > 23:59:59
