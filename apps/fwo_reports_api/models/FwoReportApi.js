'use strict'

const config = require('../config.js')

class FwoReportApi {
    constructor(restify_server, redis_client) {
        this.reports = []

        this.action = this.action.bind(this)
        this.on_request = this.on_request.bind(this)
        this.set_reports = this.set_reports.bind(this)
        this.list = this.list.bind(this)

        this.server = restify_server
        this.server.pre(this.on_request)

        this.redis = redis_client
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

        //delete data['key']
        let json = JSON.stringify(data)

        console.log(`SET ${key} ${json}`)
        this.redis.set(key, json);

        return { persisted: true }
    }

    set_reports(reports) {
        this.reports = reports
    }

    list(req, res, next) {
        console.log('FwoReportApi::list')

        let page = parseInt(req.params.page.toLowerCase())
        let page_size = parseInt(req.params.page_size.toLowerCase())

        let begin = (page - 1) * page_size
        let end = begin + page_size

        res.send(200, this.reports.slice(begin, end))

        next()
    }
}

module.exports = FwoReportApi
