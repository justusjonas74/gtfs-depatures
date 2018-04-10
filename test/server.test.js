// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let server = require('../lib/server')

// Require the dev-dependencies
let gtfs = require('gtfs')
let mongoose = require('mongoose')
let path = require('path')
let chai = require('chai')
let chaiAsPromised = require('chai-as-promised')

// let chaiHttp = require('chai-http')
chai.use(chaiAsPromised)
chai.should()
// chai.use(chaiHttp);

// TEST DATA
const agenciesFixturesLocal = [{
  agency_key: 'caltrain',
  path: path.join(__dirname, 'fixture/caltrain_20160406.zip')
}]

let config = require('../config.json')

describe('server.js', () => {
  // Connect DB
  before(async () => {
    await require('../lib/db').connectDatabase(mongoose, config)
    await mongoose.connection.db.dropDatabase()
    config.verbose = false
    config.agencies = agenciesFixturesLocal
    await gtfs.import(config)
  })

  after(async () => {
    // await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close()
  })

  describe('GET /api/stops/search', () => {
    it('should return an array of stops if search term is given', () => {
      server.should.not.be.empty()
    })

    it('should return an array of stops if search term is not given', () => {
      server.should.not.be.empty()
    })
  })

  describe('GET /api/stops/:id/', () => {
    it('should ', () => {
      server.should.not.be.empty()
    })
  })

  describe('GET /api/stops/:id/departures', () => {
    it('should ', () => {
      server.should.not.be.empty()
    })
  })
})
