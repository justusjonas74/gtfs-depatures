//DEPENDENCIES
const express = require('express')
const app = express()
const mongoose = require('mongoose');

// TODO LIST
// Create Index StopTime. stop_id, departure_time, arrival_time, stop_name

// CONNECT DATABASE
const config = require('./config.json');
mongoose.connect(config.mongoUrl)


// START THE SERVER
require('./lib/server').server(app)

