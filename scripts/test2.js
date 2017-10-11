'use strict'

const fs = require('fs')
const states = ['act', 'nsw', 'nt', 'qld', 'sa', 'tas', 'vic', 'wa']
const mongodb = require('mongodb')
const PASSWORD = ''
const DATABASE = 'employer-watch'

let MongoClient = mongodb.MongoClient
let uri = `mongodb://oventi:${PASSWORD}@employer-watch-shard-00-00-31uqi.mongodb.net:27017,employer-watch-shard-00-01-31uqi.mongodb.net:27017,employer-watch-shard-00-02-31uqi.mongodb.net:27017/${DATABASE}?ssl=true&replicaSet=employer-watch-shard-0&authSource=admin`

let employers_inserted = 0
let employer_list_length = 0

function insert_employer(db, employer) {
    db.collection('employers')
        .insertOne(employer)
        .then(function(result) {
            console.log(employers_inserted, employer_list_length, '| employer', employer.key, 'inserted', result.insertedId)
            employers_inserted++

            if(employers_inserted >= employer_list_length) {
                console.log('closing database')
                db.close()
            }
        })
}

function insert_employers(db, lines) {
    lines.forEach(line => {
        let parts = line.split('\'')

        if(line.trim() !== '') {
            let data = JSON.parse(parts[3])

            if(data.state.trim() !== '' && states.indexOf(data.state.toLowerCase()) === -1) {
                employers_inserted++
            }
            else {
                let employer = {
                    key: data.key.trim(),
                    company: data.company.trim(),
                    trading: data.trading.trim(),
                    brand: null,
                    location: {
                        country: 'au',
                        adm1: data.state.toLowerCase().trim(),
                        adm2: data.city.trim(),
                        address: null
                    }
                }

                insert_employer(db, employer)
            }
        }
        else {
            employers_inserted++
        }
    })
}

fs.readFile('../data/REDIS_BACKUP.4', 'utf-8', (err, data) => {
    let lines = data.split('\n')
    employer_list_length = lines.length

    MongoClient.connect(uri, function(err, db) {
        db.collection('employers').drop(() => {
            insert_employers(db, lines)
        })
    })
})
