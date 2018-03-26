var gtfs = require('gtfs');
var _ = require('lodash');
var moment = require('moment');


// MODEL 
var StopTime = require('gtfs/models/gtfs/stop-time');
var Trips = require('gtfs/models/gtfs/trip');
var Calendar = require('gtfs/models/gtfs/calendar');
var CalendarDate = require('gtfs/models/gtfs/calendar-date');
var Route = require('gtfs/models/gtfs/route');


// DATABASE REQUESTS
const getStopByName = (stop_name) =>{
    return gtfs.getStops({ stop_name: { '$regex': stop_name } }, {
            stop_id: 1,
            stop_name: 1
        })
}

const getStopByID = (id) =>{
    return gtfs.getStops({ stop_id: id })    
}

function getCalendarDatesForStopTimeArray(stopTimesArray) {
    const SERVICES = stopTimesArray.map((item) => item.trip.service_id)
    return CalendarDate.find({
        service_id: {
            $in: SERVICES
        }
    }).then((data) => {
        return stopTimesArray.map((st) => {
            var e = st
            e.calendar_date = _.filter(data, (o) => { return o.service_id === e.trip.service_id })
            return e
        })
    })
}

function getCalendarsForStopTimeArray(stopTimesArray) {
    const SERVICES = stopTimesArray.map((item) => item.trip.service_id)
    return Calendar.find({
        service_id: {
            $in: SERVICES
        }
    }).then((data) => {
        return stopTimesArray.map((st) => {
            var e = st
            e.calendar = _.find(data, (o) => { return o.service_id === e.trip.service_id })
            return e
        })
    })
}

function getRoutesForStopTimeArray(stopTimesArray) {
    const ROUTES = stopTimesArray.map((item) => item.trip.route_id)
    return Route.find({
        route_id: {
            $in: ROUTES
        }
    }).then((data) => {
        return stopTimesArray.map((st) => {
            var e = st
            e.route = _.find(data, (o) => { return o.route_id === e.trip.route_id })
            return e
        })
    })
}

function getTripsForStopTimeArray(stopTimesArray) {
    const TRIPS = stopTimesArray.map((item) => item.trip_id)
    return Trips.find({
        trip_id: {
            $in: TRIPS
        }
    }).then((data) => {
        return stopTimesArray.map((st) => {
            var e = st.toObject()
            e.trip = _.find(data, (o) => { return o.trip_id === e.trip_id })
            return e
        })
    })
}

const getDeparturesByStop = (id, date = new Date, offsetMinutes = 30) => {
    // OPTIONS
    const startTime = moment(date).format('HH:mm:ss')
    const rangeEndTime = moment(date).add(offsetMinutes, 'm').format('HH:mm:ss')
    const projections = { _id: 0, departure_time: 1, trip_id: 1, trip: 1 }

    // GET ALL STOP TIMES WITHIN THE GIVEN RANGE
    return StopTime
        .find({
            stop_id: id,
            departure_time: {
                $gt: startTime,
                $lt: rangeEndTime
            }
        }, projections)
        .sort({ departure_time: 1 })
        .then(data => getTripsForStopTimeArray(data))
        .then(data => getCalendarsForStopTimeArray(data))
        .then(data => getCalendarDatesForStopTimeArray(data))
        .then(data => getRoutesForStopTimeArray(data))
        //FILTER ALL VALID STOP TIMES
        .then(data => filterStopTimeArray(data, date))
        .then(data => styleOutput(data))
}

function styleOutput(data){
    // return data.map(e=> _.pick(e, ['departure_time', 'trip.trip_headsign'])) 
    
    // Sort by departure time
    return _.sortBy(data, [function(o) { return o.departure_time; }]);
    
}


// FILTER RESULTS
function filterStopTimeArray(data, date) {

    // Setup
    var stopTimes = []
    const dateAsInt = parseInt(moment(date).format('YYYYMMDD'), 10)
    console.log(`TOTAL STOP TIMES: ${data.length}`)


    // Add all trips served on actual weekday (e.g. "monday" = true AND end_date >= today >= start_date)
    var regular_valid_stops = filterRegularServicesForDay(data, date, dateAsInt)
    console.log(`REGULAR STOP TIMES: ${regular_valid_stops.length}`)
    // console.log(regular_valid_stops)

    // Remove all "type 2" exceptions (A value of 2 indicates that service has been removed for the specified date.)
    regular_valid_stops = removeExceptionsFromStopTimeArray(regular_valid_stops, dateAsInt)
    console.log(`REGULAR STOP TIMES WITH EXCEPTIONS: ${regular_valid_stops.length}`)


    // Add all additional "type 1" exceptions ( A value of 1 indicates that service has been added for the specified date.)
    var irregular_valid_stops = getIrregularServicesForDay(data, dateAsInt)
    console.log(`IRREGULAR STOP TIMES: ${irregular_valid_stops.length}`)

    stopTimes = irregular_valid_stops.concat(regular_valid_stops)
    
    return stopTimes
}

function removeExceptionsFromStopTimeArray(regular_valid_stops, dateAsInt) {
    _.remove(regular_valid_stops, o => {
        if (o.calendar_date.length > 0) {
            const today_not = _.filter(o.calendar_date, e => ((e.exception_type === 2) && (e.date === dateAsInt)))
            return !(_.isEmpty(today_not))
        }
        else {
            return false
        }
    })
    return regular_valid_stops
}

function filterRegularServicesForDay(data, date, dateAsInt) {
    // Filter all trips served on actual weekday (e.g. "monday" = true AND end_date >= today >= start_date)
    const weekday = moment(date).format('dddd').toLowerCase()
    return _.filter(data, o => {
        return ((o.calendar[weekday] === 1) && (o.calendar.start_date <= dateAsInt) && (dateAsInt <= o.calendar.end_date))
    })
}

function getIrregularServicesForDay(data, dateAsInt) {
    // Filter all additional "type 1" exceptions ( A value of 1 indicates that service has been added for the specified date.)
    return _.filter(data, o => {
        if (o.calendar_date.length > 0) {
            const today_additional = _.filter(o.calendar_date, e => ((e.exception_type === 1) && (e.date === dateAsInt)))
            return !(_.isEmpty(today_additional))
        }
        else {
            return false
        }
    })
}


module.exports = {getDeparturesByStop, getStopByID, getStopByName}
