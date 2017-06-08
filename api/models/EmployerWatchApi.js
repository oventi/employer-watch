'use strict'

const restify = require('restify')

class EmployerWatchApi {
    constructor(search_index, restify_server) {
        this.on_request = this.on_request.bind(this)

        this.search = this.search.bind(this)
        this.list = this.list.bind(this)

        this.search_index = search_index
        this.search_index.on_ready(() => {
            console.log('Search index built');
        })

        this.server = restify_server
        this.server.pre(this.on_request)
    }

    on_request(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*')
        res.charSet('utf-8')

        let is_ready = this.search_index.is_ready()
        console.log(`EmployerWatchApi::on_request (search_index.ready = ${is_ready})`)

        if(!is_ready) {
            let error_response = { error: 'Employer Watch API is not ready' }
            return res.send(200, error_response)
        }

        return next()
    }

    search(req, res, next) {
        let term = req.params.term.toLowerCase()
        console.log(`EmployerWatchApi::search (term = ${term})`)

        this.search_index.search(term)
            .then(results => {
                res.send(200, results)
            })
            .catch(err => console.error(err))

        next()
    }
}

module.exports = EmployerWatchApi
