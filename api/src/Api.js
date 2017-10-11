'use strict'

const
    config = require('../config/config'),
    restify = require('restify')

const EmployerWatch = {
    Dal: require('./Dal.js'),
    //Server: require('./Server.js'),
    //Error: require('./src/Api.js')
}

const EmployerWatchApiError = require('./EmployerWatchApiError.js')
const ErrorTypes = EmployerWatchApiError.types

const EmployerWatchApiRequest = require('./EmployerWatchApiRequest.js')

/**
 * Employer Watch Api, version 1.1
 */
class Api {
    static start() {
        EmployerWatch.Dal.connect()
            .then(dal => {
                let server = restify.createServer({})
                let api = new Api(dal, server)

                server.use(restify.queryParser())

                server.pre((req, res, next) => {
                    res.header('Access-Control-Allow-Origin', '*')
                    res.charSet('utf-8')

                    return next()
                })

                let version = (config.version).toString().replace('.', '\\.')
                let regex = new RegExp(`${version}\/(.+)`, 'gi')
                server.get(regex, (req, res, next) => {
                    api.request(req, dal)
                        .then(response => api.respond(res, response))
                        .catch(error => api.respond(res, error))

                    return next()
                })

                server.listen(config.port, () => {
                    console.log(`${config.messages.cli.server_started} on port ${config.port}`)
                })
            })
    }

    constructor(dal, server) {
        this.request = this.request.bind(this)
        this.respond = this.respond.bind(this)
    }

    request(req, dal) {
        let resource_name = (req.params[0]).toString().trim()
        let request = EmployerWatchApiRequest.create(req, resource_name, dal)

        return new Promise((resolve, reject) => {
            if(!request) {
                let error = new EmployerWatchApiError(ErrorTypes.resource_does_not_exist)

                reject(error.serialise())
            }
            else {
                request.process()
                    .then(response => resolve({ status: 200, body: response }))
                    .catch(reject)
            }
        })
    }

    respond(response, data) {
        response.send(data.status, data.body)
    }
}

module.exports = Api
