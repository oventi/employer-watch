'use strict'

const PORT = process.env.PORT || 5003
const restify = require('restify')
const config = require('config.js')
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
request(json_documents_url)
    .pipe(JSONStream.parse())
    .pipe(es.mapSync(data => {
        report_list.push(data)
    }))
    .on('end', () => {
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

server.listen(PORT, () => {
    console.log('Employer Watch Fwo Reports API is running on port', PORT)
})
