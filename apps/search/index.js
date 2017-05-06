'use strict'

const PORT = process.env.PORT || 5001
const restify = require('restify')

let server = restify.createServer({})

server.pre((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '-1')
    res.header('Pragma', 'no-cache, no-store')

    return next()
})

server.get(/\/?.*/, restify.serveStatic({
    directory: './public',
    default: 'index.html'
}))

server.listen(PORT, () => {
    console.log('Employer Watch Search is running on port', PORT)
})
