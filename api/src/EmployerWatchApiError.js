'use strict'

const error_prefix = 'EmployerWatchApi error:'

class EmployerWatchApiError {
    constructor(type) {
        this.status = 404
        this.type = type

        this.initialise()
    }

    initialise() {
        let types = EmployerWatchApiError.types

        //if(this.type === types.resource_does_not_exist) {
        //    this.status = 404
        //}
    }

    serialise() {
        let error_message = this.type.replace(error_prefix, '').trim()

        return {
            status: this.status,
            body: {
                error: error_message
            }
        }
    }
}

EmployerWatchApiError.types = {
    resource_does_not_exist: `${error_prefix} Resource does not exist`
}

module.exports = EmployerWatchApiError
