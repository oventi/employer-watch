'use strict'

const
    config = require('../config/config'),
    mongoose = require('mongoose')

class Dal {
    // connect to database
    static connect() {
        let db_uri = config.db.uri.replace('[password]', config.db.password)

        return new Promise((resolve, reject) => {
            mongoose.connect(db_uri)
            mongoose.connection.on('error', reject)
            mongoose.connection.once('open', () => {
                console.log(`${config.messages.cli.db_connected}`)

                resolve(new Dal(mongoose))
            })
        })
    }

    constructor(db) {
        this.db = db
        this.models = {}

        this.get_db = this.get_db.bind(this)
        this.get_dao = this.get_dao.bind(this)
        this.get_all = this.get_all.bind(this)
    }

    get_db() {
        return this.db
    }

    get_dao(collection) {
        let dao_name = collection.substring(0, 1).toUpperCase() + collection.substring(1)
        let dao = null

        try {
            let dao_class = require(`./dal/${dao_name}`)
            dao = new dao_class(this)
        }
        catch(error) {
            throw error
        }

        return dao
    }

    get_all(dao) {
        let collection = dao.constructor.name

        return new Promise((resolve, reject) => {
            if(dao === null) {
                // @TODO send error object
                return reject('dao is null')
            }

            if(!this.models[collection]) {
                this.models[collection] = this.db.model(collection, dao.get_schema())
            }

            let model = this.models[collection]
            model.find(dao.get_filter(), (err, data) => {
                if (err) {
                    return reject(err)
                }

                return resolve(data)
            })
        })
    }
}

module.exports = Dal
