'use strict'

const daos = {
    Employers: require('./dal/Employers.js')
}

class Dal {
    constructor(db) {
        this.db = db

        this.get_all = this.get_all.bind(this)
    }

    get_all(collection) {
        console.log('H')
        let dao_name = collection.substring(0, 1).toUpperCase() + collection.substring(1)
        let dao = daos[dao_name] ? new daos[dao_name](this.db) : null

        return new Promise((resolve, reject) => {
            console.log('I 1')
            if(dao === null) {
                // @TODO send error object
                return reject()
            }

            console.log('I 2')

            console.log('get_all', dao)

            let model = this.db.model(dao_name, dao.get_schema())
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
