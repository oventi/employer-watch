'use strict'

const daos = {
    Employers: require('./dal/Employers.js')
}

class Dal {
    constructor(db) {
        this.db = db
        this.models = {}

        this.get_model = this.get_model.bind(this)
        this.get_all = this.get_all.bind(this)
    }

    get_model(collection) {
        let dao_name = collection.substring(0, 1).toUpperCase() + collection.substring(1)
        let dao = null, model = null

        if(this.models[dao_name]) {
            return this.models[dao_name]
        }

        if(daos[dao_name]) {
            dao = new daos[dao_name](this.db)
            model = this.db.model(dao_name, dao.get_schema())

            this.models[dao_name] = model
        }

        return model
    }

    get_all(collection) {
        let model = this.get_model(collection)

        return new Promise((resolve, reject) => {
            if(model === null) {
                // @TODO send error object
                return reject()
            }

            model.find((err, data) => {
                if (err) {
                    return reject(err)
                }

                resolve(data)
            })
        })
    }
}

module.exports = Dal
