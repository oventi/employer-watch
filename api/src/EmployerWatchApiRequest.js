'use strict'

class EmployerWatchApiRequest {
    constructor(req, params, dal) {
        this.params = params
        this.dal = dal

        //this.process = this.process.bind(this)
    }

    process() {
    }

    static create(req, resource_name, dal) {
        let request_name = resource_name.substring(0, 1).toUpperCase() + resource_name.substring(1)

        try {
            let request_class = require(`./requests/${request_name}`)
            let params = req.params
            let request = new request_class(req, params, dal)

            return request
        }
        catch(e) {
            // @TODO notify error
        }

        return null
    }
}

module.exports = EmployerWatchApiRequest
