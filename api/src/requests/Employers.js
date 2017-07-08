'use strict'

const EmployerWatchApiRequest = require('../EmployerWatchApiRequest.js')
const EmployerWatchApiError = require('../EmployerWatchApiError.js')
const ErrorTypes = EmployerWatchApiError.types

class Employers extends EmployerWatchApiRequest {
    constructor(req, params, dal) {
        super(req, params, dal)

        this.process = this.process.bind(this)
    }

    process() {
        return new Promise((resolve, reject) => {
            if(!this.params.country) {
                let error = new EmployerWatchApiError()
                    .set_status(500)
                    .set_message('Employers: parameter country is required')

                return reject(error.serialise())
            }

            let dao = this.dal.get_dao('employers')

            // show only employers where the company and trading name are non empty
            dao.add_filter({
                company: { $ne: ''},
                trading: { $ne: ''},
                'location.country': this.params.country
                //'location.adm1': 'nsw'
            })

            this.dal.get_all(dao).then(data => {
                let response = {
                    employers: data,
                    meta: {
                        self: `/1.1/employers?country=${this.params.country}`,
                        previous: null,
                        next: null
                        //next: `/1.1/employers?country=${this.params.country}&page=2`
                    }
                }

                return resolve(response)
            })
        })
    }
}

module.exports = Employers
