'use strict'

const EmployerWatchApiError = require('./EmployerWatchApiError.js')
const ErrorTypes = EmployerWatchApiError.types

const EmployerWatchApiRequest = require('./EmployerWatchApiRequest.js')

/**
 * EmployerWatchApi, version 1.1
 */
class EmployerWatchApi {
    //constructor(restify_server) {
    constructor() {
        this.request = this.request.bind(this)
        this.employers = this.employers.bind(this)

        /*
        this.country_code = 'xx'
        this.search = this.search.bind(this)
        this.server = restify_server
        */
    }

    request(req, dal) {
        let resource_name = (req.params[0]).toString().trim()
        let resource_exists = this[resource_name] && typeof this[resource_name] === 'function' ? true : false

        return new Promise((resolve, reject) => {
            if(!resource_exists) {
                let error = new EmployerWatchApiError(ErrorTypes.resource_does_not_exist)

                reject(error.serialise())
            }
            else {
                let request = EmployerWatchApiRequest.create(req, resource_name, dal)

                request.process().then(
                    // resolve
                    response => {
                        resolve({ status: 200, body: response })
                    },

                    // reject
                    response => {
                        //let error = new EmployerWatchApiError(ErrorTypes.resource_error)
                        //error.set_message(response.error)
                        //reject(error.serialise())
                    }
                )
            }
        })
    }

    /* ********************************************************************** */

    employers(params) {
        console.log('EmployerWatchApi::employers')

        let dal = new Dal()

        return new Promise((resolve, reject) => {
            dal.get_all('employers').then(employers => resolve(employers))
        })
    }

    /* ********************************************************************** */

    search_old(req, res, next) {
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

    employers_old(req, res, next) {
        let country_code = req.params[0]
        let page_number = isNaN(req.params[1]) ? 1 : parseInt(req.params[1])

        let employers = new Employers(country_code)

        res.send(200, employers.get_page(page_number))

        next()
    }

    employer_old(req, res, next) {
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
