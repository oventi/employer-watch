'use strict'

const search_index = require('search-index')
const fs = require('fs-extra')
const request = require('request')
const JSONStream = require('JSONStream')
const noop = () => {}

class SearchIndex {
    constructor() {
        this.index = null
        this.ready = false

        this.on_data_handler = noop
        this.on_ready_handler = noop
    }

    buildFromJSONFile(filepath) {
        return this.build(fs.createReadStream(filepath))
    }

    buildFromJSONUrl(url) {
        return this.build(request(url))
    }

    build(stream) {
        let self = this

        fs.removeSync('employer-watch-api-index')

        search_index({ indexPath: 'employer-watch-api-index', logLevel: 'error' }, (err, index) => {
            if (!err) {
                self.index = index

                stream
                    .pipe(JSONStream.parse())
                    .pipe(self.index.defaultPipeline())
                    .pipe(self.index.add())
                    .on('data', self.on_data_handler)
                    .on('end', () => {
                        self.ready = true
                        self.on_ready_handler()
                    })
            }
            else {
                console.log('SearchIndex::build', err)
            }
        })
    }

    on_data(handler) {
        this.on_data_handler = handler
    }

    on_ready(handler) {
        this.on_ready_handler = handler
    }

    is_ready() {
        return this.ready
    }

    search(term) {
        let results = []

        return new Promise((resolve, reject) => {
            this.index.search(term)
                .on('data', data => results.push(data.document))
                .on('end', () => resolve(results))
        })
    }
}

module.exports = SearchIndex
