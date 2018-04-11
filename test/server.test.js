// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

// Require the dev-dependencies
let gtfs = require('gtfs')
let mongoose = require('mongoose')
let path = require('path')
let chai = require('chai')
let chaiAsPromised = require('chai-as-promised')

let chaiHttp = require('chai-http')
chai.use(chaiAsPromised)
chai.should()
chai.use(chaiHttp)

let app = require('../lib/server')

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
    it('should return an array of stops if search term is given', (done) => {
      chai.request(app)
        .get('/api/stops/search')
        .end((err, res) => {
          if (err) { console.log(err) }
          res.should.have.status(200)
          res.body.should.be.a('array')
          // res.body.length.should.be.eql(0);
          done()
        })
    })

    // it('should return an array of stops if search term is not given', () => {
    //   server.should.not.be.empty()
    // })
  })

  describe('GET /api/stops/:id/', () => {
    // it('should ', () => {
    //   server.should.not.be.empty()
    // })
  })

  describe('GET /api/stops/:id/departures', () => {
    // it('should ', () => {
    //   server.should.not.be.empty()
    // })
  })
})
