'use strict'

class Employers {
    constructor(db) {
        this.db = db
    }

    get_schema() {
        return this.db.Schema({
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
}

module.exports = Employers
