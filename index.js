// DEPENDENCIES
const express = require('express')
const app = express()
const mongoose = require('mongoose')

// CONNECT THE DATABASE
require('./lib/db').connectDatabase(mongoose)

// START THE SERVER
require('./lib/server').server(app)

// TODO LIST
// Create Index StopTime.stop_id, StopTime.departure_time, StopTime.arrival_time, Stop.stop_name, Stop.parrent_station
// Create a wildcard route for all unsupported requests
// Create a version for the api
