'use strict'

const config = require('../config.js')

class FwoReportApi {
    constructor(restify_server) {
        this.action = this.action.bind(this)
        this.on_request = this.on_request.bind(this)

        this.server = restify_server
        this.server.pre(this.on_request)
    }

    on_request(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*')
        res.charSet('utf-8')

        return next()
    }

    action(req, res, next) {
        let action = req.params.action.toLowerCase()
        let method = this[action] && typeof this[action] === 'function' ? this[action] : null

        if(method === null) {
            res.send(200, { error: `FwoReportApi: method ${action} does not exist` })
        }

        res.send(200, method(req))
    }

    save(req) {
        let data = req.body
        let key = `${config.key_prefixes.reports.au}.${data.key}`

        delete data['key']
        let json = JSON.stringify(data)

        console.log(`SET ${key} ${json}`)

        return {}
    }
}

module.exports = FwoReportApi
