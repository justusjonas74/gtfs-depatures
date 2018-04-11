# GTFS Departures

[![Build Status](https://travis-ci.org/justusjonas74/gtfs-depatures.svg?branch=master)](https://travis-ci.org/justusjonas74/gtfs-depatures)
[![Coverage Status](https://coveralls.io/repos/github/justusjonas74/gtfs-depatures/badge.svg?branch=master)](https://coveralls.io/github/justusjonas74/gtfs-depatures?branch=master)

A JSON API backend based on [GTFS](https:*developers.google.com/transit/gtfs/) data and [Express.js](https://expressjs.com). 

## Getting started 

1. You need [node.js](https://nodejs.org/) (>= version 8) and [mongoDB](https://www.mongodb.com/) installed.

2. Clone and install this repo (npm version planned):
    ```bash
    git clone https://github.com/justusjonas74/gtfs-depatures.git 
    cd gtfs-depatures
    npm install
    ```
3. Copy or rename `config.json.example` to  `config.json` and edit attributes for your need. Check out [node-gtfs](https://github.com/BlinkTagInc/node-gtfs) for more informations about the attributes.  

4. (Optional) If needed start the mongo daemon by calling `./mongod`. 
5. Import GTFS feed data:
    ```bash
    npm run import
    ```
6. Start the server:
    ```bash
    node index.js
    ```

## Documentation and examples

### `GET /api/stops/search?term=[...]` 

Search for a stop by name. Example response body for GET request `/api/stops/search?term=San+Ma ` :

```json
[
   {
      "stop_name" : "San Martin Caltrain",
      "stop_id" : "ctsmar",
      "_id" : "5acdfbd2f1ccbd21bd11755e"
   },
   {
      "stop_name" : "San Mateo Caltrain",
      "stop_id" : "ctsmat",
      "_id" : "5acdfbd2f1ccbd21bd117573"
   }
]
```


### `GET /api/stops/[:id]`
Get details of a specific stop and all related `child stops`.  Example response body for GET request `/api/stops/ctsmar`:

```json 
[
   {
      "wheelchair_boarding" : 1,
      "loc" : [
         -121.610809,
         37.085775
      ],
      "zone_id" : "",
      "stop_name" : "San Martin Caltrain",
      "stop_id" : "ctsmar",
      "platform_code" : "",
      "stop_code" : "",
      "stop_lon" : -121.610809,
      "stop_url" : "http://www.caltrain.com/stations/sanmartinstation.html",
      "location_type" : 1,
      "stop_lat" : 37.085775,
      "parent_station" : "",
      "agency_key" : "caltrain"
   },
   {
      "stop_name" : "San Martin Caltrain",
      "stop_id" : "70312",
      "wheelchair_boarding" : 1,
      "loc" : [
         -121.610936,
         37.086653
      ],
      "zone_id" : "6",
      "stop_lat" : 37.086653,
      "location_type" : 0,
      "parent_station" : "ctsmar",
      "agency_key" : "caltrain",
      "stop_code" : "70312",
      "platform_code" : "SB",
      "stop_lon" : -121.610936,
      "stop_url" : "http://www.caltrain.com/stations/sanmartinstation.html"
   }
]
```

### `GET /api/stops/[:id]/departures`
Get all departures of a specific stop and all related `child stops` within the next hour. Example response body for GET request `/api/stops/ctsmar/departures`:
```json
[
   {
      "trip" : {
         "trip_headsign" : "SAN FRANCISCO STATION"
      },
      "departure_time" : "12:34:00"
   }
]
```


## Known Issues / To-Do's
Folowing things have to be fixed/added in the future due to a lack of time and/or knowledge.

* Create a React based client
* Check how to test error handling. It's not possible for me to produce an err
* Exclude test data from test files (BE D-R-Y NOT W-E-T)
* Add boolean Option `includeChilds` to all route
* Add Option `time` and `offset` to the route `/departures`
* Create Index `StopTime.stop_id`, `StopTime.departure_time`, `StopTime.arrival_time`, `Stop.stop_name`, `Stop.parrent_station`
* Create a wildcard route for all unsupported requests
* Create a version for the api
* Create a new importer
* A `OFFSET RANGE` which will result in an offset time greater then `23:59:59` is actually not supported
* GTFS specs allow to set departures after 23:59:59 (e.g. 25:12:12). This is actally not supported
* publish to NPM 