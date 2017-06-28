'use strict'

class Employers {
    constructor(dal) {
        this.dal = dal
        this.filter = {}

        this.add_filter = this.add_filter.bind(this)
    }

    get_schema() {
        return this.dal.get_db().Schema({
            key: String,
            company: String,
            trading: String,
            brand: String,
            location: {
                country: String,
                adm1: String,
                adm2: String,
                address: String
            }
        })
    }

    add_filter(filter) {
        for(let i in filter) {
            this.filter[i] = filter[i]
        }
    }

    get_filter() {
        return this.filter
    }
}

module.exports = Employers
