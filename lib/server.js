function server(app) {
    // LOCAL DEPENDENCIES 
    const { getDeparturesByStop, getStopByID, getStopByName } = require('./querries')

    // ENDPOINTS
    app.get('/api/stops/search', (req, res) => {
        const stop_name = req.query.term
        getStopByName(stop_name)
            .then((data) => { res.json(data) })
            .catch((e) => {
                console.error(e.stack);
                res.status(500).send('Something broke!');
            })
    })

    app.get('/api/stop/:id', (req, res) => {
        const id = req.params.id
        getStopByID(id)
            .then((data) => { res.json(data) })
            .catch((e) => {
                console.error(e.stack);
                res.status(500).send('Something broke!');
            })
    })

    app.get('/api/stop/:id/departures', (req, res) => {
        const id = req.params.id
        getDeparturesByStop(id)
            .then(data => res.json(data))
            .catch((e) => {
                console.error(e.stack);
                res.status(500).send('Something broke!');
            })
    })

    // START THE SERVER
    const port = process.env.PORT || 5000;
    app.listen(port)
    console.log(`App listening on port: ${port}`)
}

module.exports.server = server