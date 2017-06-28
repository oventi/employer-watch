'use strict'

const error_prefix = 'EmployerWatchApi error:'

class EmployerWatchApiError {
    constructor(type = null) {
        this.status = 404
        this.type = type
        this.message = null

        this.serialise = this.serialise.bind(this)

        this.initialise()

        return this
    }

    initialise() {
        let types = EmployerWatchApiError.types

        switch(this.type) {
            case types.request_error:
                this.status = 500
                break
        }
    }

    set_status(status) {
        this.status = status

        return this
    }

    set_message(message) {
        this.message = message

        return this
    }

    serialise() {
        let error_message = this.message || this.type.replace(error_prefix, '').trim()

        return {
            status: this.status,
            body: {
                error: error_message
            }
        }
    }
}

EmployerWatchApiError.types = {
    resource_does_not_exist: `${error_prefix} Resource does not exist`,
    request_error: `${error_prefix} Request error`
}

module.exports = EmployerWatchApiError
