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
chai.use(require('chai-things'))

let app = require('../lib/server')

// TEST DATA
const agenciesFixturesLocal = [{
  agency_key: 'caltrain',
  path: path.join(__dirname, 'fixture/caltrain_20160406.zip')
}]

var config = {}
const getEnvMongoUrl = require('../lib/getEnvMongoUrl')
const mongoUrl = getEnvMongoUrl()

describe('server.js', () => {
  // Connect DB
  before(async () => {
    await mongoose.connect(mongoUrl)
    await mongoose.connection.db.dropDatabase()
    config.verbose = false
    config.agencies = agenciesFixturesLocal
    await gtfs.import(config)
  })

  after(async () => {
    await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close()
  })

  describe('GET /api/stops/search', () => {
    it('should return an empty array if no search term is given', (done) => {
      chai.request(app)
        .get('/api/stops/search')
        .end((err, res) => {
          if (err) { console.log(err) }
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.length.should.be.eql(0)
          done()
        })
    })

    it('should return an array of stops if search term is given', (done) => {
      chai.request(app)
        .get('/api/stops/search?term=San+Antonio+Caltrain')
        .end((err, res) => {
          if (err) { console.log(err) }
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.should.contain.an.item.with.property('stop_name', 'San Antonio Caltrain')
          done()
        })
    })

    // it('should return an array of stops if search term is not given', () => {
    //   server.should.not.be.empty()
    // })
  })

  describe('GET /api/stops/:id/', () => {
    it('should return the details of a stop if id exists ', (done) => {
      chai.request(app)
        .get('/api/stops/ctsa')
        .end((err, res) => {
          if (err) { console.log(err) }
          res.should.have.status(200)
          res.body.should.be.an('array')
          res.body.should.contain.an.item.with.property('stop_name', 'San Antonio Caltrain')
          done()
        })
    })
    it('should return an empty array if id not exists ', (done) => {
      chai.request(app)
        .get('/api/stops/ctsaasdsaddsad')
        .end((err, res) => {
          if (err) { console.log(err) }
          res.should.have.status(200)
          res.body.should.be.an('array')
          res.body.length.should.be.eql(0)
          done()
        })
    })
  })

  describe('GET /api/stops/:id/departures', () => {
    // it('should return the the departures of a stop if id exists', (done) => {
    //   // TODO: Add a time point and a offset to the request, because maybe there's no departure actually and the test will fail
    //   chai.request(app)
    //     .get('/api/stops/ctsa/departures')
    //     .end((err, res) => {
    //       if (err) { console.log(err) }
    //       res.should.have.status(200)
    //       res.body.should.be.an('array')
    //       res.body.should.contain.an.item.with.property('departure_time')
    //       done()
    //     })
    // })
    it('should return an empty array  if id exists', (done) => {
      chai.request(app)
        .get('/api/stops/ctsaasdasfddfsd/departures')
        .end((err, res) => {
          if (err) { console.log(err) }
          res.should.have.status(200)
          res.body.should.be.an('array')
          res.body.length.should.be.eql(0)
          done()
        })
    })
  })
})
