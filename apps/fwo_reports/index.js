'use strict'

const PORT = process.env.PORT || 5002
const restify = require('restify')
const FwoReportApi = require('./src/models/FwoReportApi.js')

let server = restify.createServer({})
server.use(restify.plugins.bodyParser())

let api = new FwoReportApi(server)

server.pre((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '-1')
    res.header('Pragma', 'no-cache, no-store')

    return next()
})

server.get(/\/?.*/, restify.serveStatic({
    directory: './public',
    default: 'index.html'
}))

server.post('/api/:action', api.action)

server.listen(PORT, () => {
    console.log('Employer Watch Search is running on port', PORT)
})
