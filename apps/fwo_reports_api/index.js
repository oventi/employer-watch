'use strict'

const PORT = process.env.PORT || 5003
const restify = require('restify')
const FwoReportApi = require('./models/FwoReportApi.js')

let server = restify.createServer({})
server.use(restify.plugins.bodyParser())

let api = new FwoReportApi(server)

server.pre((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '-1')
    res.header('Pragma', 'no-cache, no-store')

    return next()
})

server.post('/:action', api.action)

server.listen(PORT, () => {
    console.log('Employer Watch Fwo Reports API is running on port', PORT)
})
