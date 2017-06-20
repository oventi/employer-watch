'use strict'

const request = require('request')
const JSONStream = require('JSONStream')
const es = require('event-stream')
const fs = require('fs')
const mongodb = require('mongodb')
const _ = require('lodash')
const options = require('node-options')

const MAX_TS = 1483189200 // Sunday, January 1, 2017 12:00:00 AM GMT+11:00 DST
const PASSWORD = ''
const DATABASE = 'employer-watch'
const json_documents_url = 'http://cdn.oventi.net/fwo_augmented_media_releases.json'

let MongoClient = mongodb.MongoClient
let uri = `mongodb://oventi:${PASSWORD}@employer-watch-shard-00-00-31uqi.mongodb.net:27017,employer-watch-shard-00-01-31uqi.mongodb.net:27017,employer-watch-shard-00-02-31uqi.mongodb.net:27017/${DATABASE}?ssl=true&replicaSet=employer-watch-shard-0&authSource=admin`

let report_list = []
let reports_inserted = 0

function get_report(data) {
    return {
        key: data.key,
        timestamp: (data.timestamp / 1000),
        source: {
            url: data.url
        },
        title: data.title,
        summary: data.meta.description,
        text: data.text,
    }
}

function insert_report(db, report) {
    db.collection('reports')
        .insertOne(report)
        .then(function(result) {
            console.log('report', report.key, 'inserted', result.insertedId)
            reports_inserted++

            if(reports_inserted >= report_list.length) {
                console.log('closing database')
                db.close()
            }
        })
}

//request(json_documents_url)
fs.createReadStream('../data/fwo_augmented_media_releases.json')
    .pipe(JSONStream.parse())
    .pipe(es.mapSync(data => {
        let timestamp = data.timestamp / 1000

        if(timestamp <= MAX_TS) {
            report_list.push(data)
        }
    }))
    .on('end', () => {
        _.sortBy(report_list, ['timestamp'], ['ASC'])

        MongoClient.connect(uri, function(err, db) {
            report_list.forEach(row => {
                let report = get_report(row)
                insert_report(db, report)
            })
        })
    })
