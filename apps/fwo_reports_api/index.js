'use strict'

const restify = require('restify')
const config = require('./config.js')
const PORT = config.port || 3000
const redis = require('redis')
const FwoReportApi = require('./models/FwoReportApi.js')
const request = require('request')
const JSONStream = require('JSONStream')
const es = require('event-stream')

let server = restify.createServer({})
server.use(restify.queryParser())
server.use(restify.plugins.bodyParser())

// building report list
let report_list = []
request(config.json_documents_url)
    .pipe(JSONStream.parse())
    .pipe(es.mapSync(data => {
        report_list.push(data)
    }))
    .on('end', () => {
        console.log('Report list loaded')
        api.set_reports(report_list)
    })

// connecting to redis
let redis_client = {}
if(config.redis.connect) {
    redis_client = redis.createClient(config.redis.port, config.redis.host, {no_ready_check: true})

    redis_client.on('connect', function() {
        console.log('Connected to Redis')
    })
}

let api = new FwoReportApi(server, redis_client)

server.pre((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '-1')
    res.header('Pragma', 'no-cache, no-store')

    return next()
})

server.post('/:action', api.action)
server.get('/list', api.list)

server.get(/\/?.*/, restify.serveStatic({
    directory: './public',
    default: 'index.html'
}))

server.listen(PORT, () => {
    console.log('Employer Watch Fwo Reports API is running on port', PORT)
})
