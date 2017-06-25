'use strict'

const EmployerWatchApiRequest = require('../EmployerWatchApiRequest.js')

class Employers extends EmployerWatchApiRequest {
    constructor(req, params, dal) {
        console.log('E')
        super(req, params, dal)
    }

    process() {
        console.log('F')
        return new Promise((resolve, reject) => {
            console.log('G')
            this.dal.get_all('employers').then(data => {
                console.log('J')
                resolve(data)
            })
        })
    }
}

module.exports = Employers
