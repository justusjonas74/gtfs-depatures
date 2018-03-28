// DEPENDENCIES
const express = require('express')
const app = express()
const mongoose = require('mongoose')

// CONNECT THE DATABASE
const config = require('../config.json')
require('./lib/db').connectDatabase(mongoose, config)

// START THE SERVER
require('./lib/server').server(app)

// TODO LIST
// Create Index StopTime.stop_id, StopTime.departure_time, StopTime.arrival_time, Stop.stop_name, Stop.parrent_station
// Create a wildcard route for all unsupported requests
// Create a version for the api
// Create a new importer
// FIX OFFSET RANGE > 23:59:59
// HANDLE DEPARTURES  > 23:59:59
