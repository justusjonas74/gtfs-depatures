const express = require('express')
const app = express()
const path = require('path')

// LOCAL DEPENDENCIES
const { getDeparturesByStops, getStopByID, getStopByName, getStopArrayByID } = require('./querries')

// ENDPOINTS
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/../client/build')))

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

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/build/index.html'))
})

module.exports = app
