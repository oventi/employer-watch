'use strict'

const EmployerWatchApiError = require('./EmployerWatchApiError.js')
const ErrorTypes = EmployerWatchApiError.types

const EmployerWatchApiRequest = require('./EmployerWatchApiRequest.js')

/**
 * EmployerWatchApi, version 1.1
 */
class EmployerWatchApi {
    constructor() {
        this.request = this.request.bind(this)
    }

    request(req, dal) {
        let resource_name = (req.params[0]).toString().trim()
        let request = EmployerWatchApiRequest.create(req, resource_name, dal)

        return new Promise((resolve, reject) => {
            if(!request) {
                let error = new EmployerWatchApiError(ErrorTypes.resource_does_not_exist)

                reject(error.serialise())
            }
            else {
                request.process()
                    .then(response => resolve({ status: 200, body: response }))
                    .catch(reject)
            }
        })
    }
}

module.exports = EmployerWatchApi
