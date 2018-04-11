const express = require('express')
const app = express()

// LOCAL DEPENDENCIES
const { getDeparturesByStops, getStopByID, getStopByName, getStopArrayByID } = require('./querries')

// ENDPOINTS
app.get('/api/stops/search', (req, res) => {
  const stopName = req.query.term
  if (stopName) {
    getStopByName(stopName, true)
      .then((data) => { res.json(data) })
      .catch((e) => {
        console.error(e.stack)
        res.status(500).send('Something broke!')
      })
  } else {
    res.json([])
  }
})

app.get('/api/stops/:id', (req, res) => {
  const id = req.params.id
  getStopByID(id)
    .then((data) => { res.json(data) })
    .catch((e) => {
      console.error(e.stack)
      res.status(500).send('Something broke!')
    })
})

app.get('/api/stops/:id/departures', (req, res) => {
  const id = req.params.id
  const includeAllChilds = true
  getStopArrayByID(id, includeAllChilds)
    .then(arr => getDeparturesByStops(arr))
    .then(data => res.json(data))
    .catch((e) => {
      console.error(e.stack)
      res.status(500).send('Something broke!')
    })
})

module.exports = app
