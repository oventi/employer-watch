'use strict'

const restify = require('restify')
const Employers = require('./Employers.js')

class EmployerWatchApi {
    constructor(search_index, restify_server) {
        this.country_code = 'xx'

        this.on_request = this.on_request.bind(this)

        this.search = this.search.bind(this)

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

        console.log('on_request', req.params)

        return next()
    }

    /* ********************************************************************** */

    search(req, res, next) {
        let is_ready = this.search_index.is_ready()
        console.log(`EmployerWatchApi::on_request (search_index.ready = ${is_ready})`)
        if(!is_ready) {
            let error_response = { error: 'Employer Watch API, search is not ready' }
            return res.send(200, error_response)
        }

        let term = req.params.term.toLowerCase()
        console.log(`EmployerWatchApi::search (term = ${term})`)

        this.search_index.search(term)
            .then(results => {
                res.send(200, results)
            })
            .catch(err => console.error(err))

        next()
    }

    employers(req, res, next) {
        let country_code = req.params[0]
        let page_number = isNaN(req.params[1]) ? 1 : parseInt(req.params[1])

        let employers = new Employers(country_code)

        res.send(200, employers.get_page(page_number))

        next()
    }

    employer(req, res, next) {
        let country_code = req.params[0]
        let employer_id = isNaN(req.params[1]) ? 0 : parseInt(req.params[1])

        let employers = new Employers(country_code)
        let employer = employers.get_employer(employer_id)

        if(employer === null) {
            let error_response = { error: 'Employer does not exist' }
            res.send(404, error_response)
        }
        else {
            res.send(200, employer)
        }

        next()
    }
}

module.exports = EmployerWatchApi
