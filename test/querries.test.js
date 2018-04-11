// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let { getDeparturesByStops, getStopByID, getStopByName, getStopArrayByID } = require('../lib/querries')

// Require the dev-dependencies
let gtfs = require('gtfs')
let mongoose = require('mongoose')
let path = require('path')
let chai = require('chai')
let chaiAsPromised = require('chai-as-promised')

// let chaiHttp = require('chai-http')
// let server = require('../server');
chai.use(chaiAsPromised)
chai.should()
// chai.use(chaiHttp);

// TEST DATA
const agenciesFixturesLocal = [{
  agency_key: 'caltrain',
  path: path.join(__dirname, 'fixture/caltrain_20160406.zip')
}]

var config = {}
const getEnvMongoUrl = require('../lib/getEnvMongoUrl')
const mongoUrl = getEnvMongoUrl()

describe('querries.js', () => {
  // Connect DB
  before(async () => {
    await mongoose.connect(mongoUrl)
    await mongoose.connection.db.dropDatabase()
    config.verbose = false
    config.agencies = agenciesFixturesLocal
    await gtfs.import(config)
  })

  after(async () => {
    // await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close()
  })

  describe('querries.getStopByID()', () => {
    it('should eventually resolve an empty array, if value not found', () => {
      // returns a promise so should be reolved!
      return getStopByID('12').should.eventually.be.an('array').and.should.eventually.be.empty.and.should.be.fulfilled
    })

    it('should eventually resolve an array of stops, if value is found', () => {
      return getStopByID('70011', false).should.eventually.be.an('array').and.should.eventually.not.be.empty.and.should.be.fulfilled
    })
    it('should eventually resolve an empty array, if no value is given', () => {
      // returns a promise so should be reolved!
      return getStopByID(null).should.eventually.be.an('array').and.should.eventually.be.empty.and.should.be.fulfilled
    })
  })

  describe('querries.getStopByName()', () => {
    it('should eventually resolve an empty array, if value not found', () => {
      // returns a promise so should be reolved!
      return getStopByName('jonaökjfnöasldjfnasökdjjfnaösdjfn').should.eventually.be.an('array').and.should.eventually.be.empty.and.should.be.fulfilled
    })
    it('should eventually resolve an array of stops, if value is found', () => {
      return getStopByName('San Francisco Caltrain').should.eventually.be.an('array').and.should.eventually.not.be.empty.and.should.be.fulfilled.and.eventually.have.lengthOf(2)
    })
    it('should eventually be case insensitive', () => {
      return getStopByName('san francisco Caltrain').should.eventually.be.an('array').and.should.eventually.not.be.empty.and.should.be.fulfilled.and.eventually.have.lengthOf(2)
    })
    it('should include all childs if second param is set to false', () => {
      return getStopByName('san francisco Caltrain', false).should.eventually.be.an('array').and.should.eventually.not.be.empty.and.should.be.fulfilled.and.eventually.have.lengthOf(6)
    })
  })

  describe('querries.getStopArrayByID()', () => {
    it('should resolve a array', () => {
      return getStopArrayByID('lknlknlk').should.eventually.be.an('array')
    })
    it('should resolve the input as array if second param is false', () => {
      return getStopArrayByID('lknlknlk', false).should.eventually.be.deep.equal(['lknlknlk'])
    })
    it('should return an array without  child stations if second param ist set false', () => {
      return getStopArrayByID('ctsf', false).should.eventually.have.lengthOf(1)
    })
    it('should return an array with child stations if second param ist set true', () => {
      return getStopArrayByID('ctsf', true).should.eventually.have.lengthOf(3)
    })
  })

  describe('querries.getDeparturesByStops()', () => {
    it('should eventually resolve an empty array, if value not found', () => {
      // returns a promise so should be reolved!
      return getDeparturesByStops(['asdasdasdasd'], new Date(), 30).should.eventually.be.an('array').and.should.eventually.be.empty.and.should.be.fulfilled
    })
    it('should eventually resolve an array of stops, if value is found', () => {
      // returns a promise so should be reolved!
      // 31.03.18 08:38 should be a departure
      const date = new Date(2018, 2, 31, 7, 30)
      return getDeparturesByStops(['70011'], date, 90).should.eventually.be.an('array').and.should.eventually.not.be.empty.and.should.be.fulfilled
    })
    it('should handle GTFS calendar_date exception type 1 correctly  (exception is fired)', () => {
      // CT-16APR-Caltrain-Sunday-02,20161124,1
      // Line above means route is regularly served only on sundays but that this service has been added for the specified date. // Thursday
      // corrsponding TRIP:
      // { "_id" : ObjectId("5abb6109ecb4292577c9e8a5"), "route_id" : "TaSj-16APR", "service_id" : "CT-16APR-Caltrain-Sunday-02", "trip_id" : "44u", "trip_headsign" : "TAMIEN STATION", "trip_short_name" : "44", "direction_id" : 1, "shape_id" : "cal_sj_tam", "agency_key" : "caltrain" }
      // STOP TIME: { "_id" : ObjectId("5abb6109ecb4292577c9e433"), "trip_id" : "44u", "arrival_time" : "21:10:00", "departure_time" : "21:10:00", "stop_id" : "777403", "stop_sequence" : 2, "pickup_type" : 0, "drop_off_type" : 0, "agency_key" : "caltrain" }
      const date = new Date(2016, 10, 24, 21, 9, 0) // THURSDAY
      // const dateBefore = new Date(2016, 10, 23, 0, 0, 0) // Wednesday

      const expectedResult = [{
        departure_time: '21:10:00',
        trip: {
          trip_headsign: 'TAMIEN STATION'
        }
      }]
      return getDeparturesByStops(['777403'], date, 5).should.eventually.be.deep.equal(expectedResult)
    })

    it('should handle GTFS calendar_date exception type 1 correctly  (exception is fired)', () => {
      // CT-16APR-Caltrain-Sunday-02,20161124,1
      // Line above means route is regularly served only on sundays but that this service has been added for the specified date. // Thursday
      // corrsponding TRIP:
      // { "_id" : ObjectId("5abb6109ecb4292577c9e8a5"), "route_id" : "TaSj-16APR", "service_id" : "CT-16APR-Caltrain-Sunday-02", "trip_id" : "44u", "trip_headsign" : "TAMIEN STATION", "trip_short_name" : "44", "direction_id" : 1, "shape_id" : "cal_sj_tam", "agency_key" : "caltrain" }
      // STOP TIME: { "_id" : ObjectId("5abb6109ecb4292577c9e433"), "trip_id" : "44u", "arrival_time" : "21:10:00", "departure_time" : "21:10:00", "stop_id" : "777403", "stop_sequence" : 2, "pickup_type" : 0, "drop_off_type" : 0, "agency_key" : "caltrain" }
      // const date = new Date(2016, 10, 24, 21, 09, 0) // THURSDAY
      const dateBefore = new Date(2016, 10, 23, 21, 9, 0) // Wednesday

      return getDeparturesByStops(['777403'], dateBefore, 5).should.eventually.be.deep.empty
    })

    it('should handle GTFS calendar_date exception type 2 correctly (exception is not fired)', () => {
      // CT-16APR-Caltrain-Weekday-01,20161124,2
      // Line above means route is regularly served only on weekdays but service has been removed for the specified date. // Thursday
      // TRIP ID: 194
      // { "_id" : ObjectId("5abb3a2e6cbf9916a37c989d"), "route_id" : "Lo-16APR", "service_id" : "CT-16APR-Caltrain-Weekday-01", "trip_id" : "194", "trip_headsign" : "TAMIEN STATION", "trip_short_name" : "194", "direction_id" : 1, "shape_id" : "cal_sf_tam", "wheelchair_accessible" : 1, "bikes_allowed" : 1, "agency_key" : "caltrain" }
      // STOP TIME
      // { "_id" : ObjectId("5abb3a2e6cbf9916a37c8c5c"), "trip_id" : "194", "arrival_time" : "21:56:00", "departure_time" : "21:56:00", "stop_id" : "70042", "stop_sequence" : 4, "pickup_type" : 0, "drop_off_type" : 0, "agency_key" : "caltrain" }

      // const date = new Date(2016, 10, 24, 21, 50, 0) // THURSDAY
      const dateBefore = new Date(2016, 10, 23, 21, 55, 0) // Wednesday

      const expectedResult = [{
        departure_time: '21:56:00',
        trip: {
          trip_headsign: 'TAMIEN STATION'
        }
      }]
      return getDeparturesByStops(['70042'], dateBefore, 60).should.eventually.be.deep.equal(expectedResult)
    })
    it('should handle GTFS calendar_date exception type 2 correctly (exception is  fired)', () => {
      const date = new Date(2016, 10, 24, 21, 55, 0) // THURSDAY

      return getDeparturesByStops(['70042'], date, 60).should.eventually.be.empty
    })
  })
})
