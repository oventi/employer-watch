'use strict'

/* Employer Watch API 1.1 */

const config = require('./config.js')
const messages = config.messages.cli
const mongoose = require('mongoose')
const restify = require('restify')

const Dal = require('./src/Dal.js')
const EmployerWatchApi = require('./src/EmployerWatchApi.js')

let server = restify.createServer({})
server.use(restify.queryParser())

let dal = null
let api = new EmployerWatchApi()

server.pre((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.charSet('utf-8')

    return next()
})

let version = (config.version).toString().replace('.', '\\.')
let regex = new RegExp(`${version}\/(.+)`, 'gi')
server.get(regex, (req, res, next) => {
    let send_response = response => {
        res.send(response.status, response.body)
    }

    api.request(req, dal)
        .then(send_response, send_response)
        .catch(error => console.error)

    return next()
})

/*
const SearchIndex = require('./models/SearchIndex.js')
const EmployerWatchApi = require('./models/EmployerWatchApi.js')

// create restify server
let server = restify.createServer({});
server.use(restify.queryParser());

// start api
let search_index = new SearchIndex()
let api = new EmployerWatchApi(search_index, server)

server.get('/search', api.search)

server.get(/1\.0\/([a-z]+)\/employer\/(.+)/, api.employer)
server.get(/1\.0\/([a-z]+)\/employers/, api.employers)

server.listen(config.port, () => {
    console.log('Employer Watch API is running on port', config.port)

    // build search index
    console.log('Building search index');
    search_index.buildFromJSONUrl(json_documents_url)
})
*/

let db_uri = config.db.uri.replace('[password]', config.db.password)
mongoose.connect(db_uri)
//mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
mongoose.connection.on('error', error => console.error('Mongoose connection error'))
mongoose.connection.once('open', () => {
    console.log(`${messages.db_connected}`)

    dal = new Dal(mongoose)
})

server.listen(config.port, () => {
    console.log(`${messages.server_started} on port ${config.port}`)
})
