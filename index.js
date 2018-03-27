// DEPENDENCIES
const express = require('express')
const app = express()
const mongoose = require('mongoose')

// TODO LIST
// Create Index StopTime.stop_id, StopTime.departure_time, StopTime.arrival_time, Stop.stop_name, Stop.parrent_station

// CONNECT THE DATABASE
const config = require('./config.json')
switch (process.env.NODE_ENV) {
  case 'test':
    mongoose.connect(config.mongoUrl.test)
    break
  case 'production':
    mongoose.connect(config.mongoUrl.production)
    break
  default: // include development
    mongoose.connect(config.mongoUrl.development)
}

// START THE SERVER
require('./lib/server').server(app)
