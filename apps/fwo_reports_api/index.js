'use strict'

const PORT = process.env.PORT || 5003
const restify = require('restify')
const FwoReportApi = require('./models/FwoReportApi.js')
const redis = require('redis')

//const json_documents_url = 'http://cdn.oventi.net/fwo_media_releases.test.json'
const json_documents_url = 'http://cdn.oventi.net/fwo_augmented_media_releases.json'

const request = require('request')
const JSONStream = require('JSONStream')
const es = require('event-stream')

let server = restify.createServer({})
server.use(restify.queryParser());
server.use(restify.plugins.bodyParser())

let redis_client = redis.createClient(6379, 'employer-watch.fovchw.0001.apse1.cache.amazonaws.com', {no_ready_check: true})

redis_client.on('connect', function() {
    console.log('Connected to Redis');
});

let api = new FwoReportApi(server, redis_client)

server.pre((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '-1')
    res.header('Pragma', 'no-cache, no-store')

    return next()
})

server.post('/:action', api.action)
server.get('/list', api.list)

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

server.listen(PORT, () => {
    console.log('Employer Watch Fwo Reports API is running on port', PORT)
})
