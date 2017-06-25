'use strict'

class EmployerWatchApiRequest {
    constructor(req, params, dal) {
        this.dal = dal

        //this.process = this.process.bind(this)
    }

    process() {
    }
}

/*const requests = {
    Employers: require('./requests/Employers.js')
}*/

EmployerWatchApiRequest.create = (req, resource_name, dal) => {
    console.log('C')
    let request_name = resource_name.substring(0, 1).toUpperCase() + resource_name.substring(1)
    let request_class = require(`./requests/${request_name}.js`)
    console.log('D', request_name)

    //if(requests[request_name] && typeof requests[request_name] === 'function') {
        let params = req.params
        let request = new request_class(req, params, dal)

        return request
    //}

    return null
}

module.exports = EmployerWatchApiRequest
