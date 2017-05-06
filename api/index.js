'use strict'

/* Employer Watch API: build search index, then start api */

const PORT = process.env.PORT || 5000
const restify = require('restify')
const SearchIndex = require('./models/SearchIndex.js')
const EmployerWatchApi = require('./models/EmployerWatchApi.js')
//const json_documents_url = 'http://cdn.oventi.net/fwo_media_releases.test.json'
const json_documents_url = 'http://cdn.oventi.net/fwo_augmented_media_releases.json'

/* create restify server */
let server = restify.createServer({});
server.use(restify.queryParser());

/* start api */
let search_index = new SearchIndex()
let api = new EmployerWatchApi(search_index, server)

server.get('/search', api.search)
server.listen(PORT, () => {
    console.log('Employer Watch API is running on port', PORT);

    /* build search index */
    console.log('Building search index');
    search_index.buildFromJSONUrl(json_documents_url)
})
