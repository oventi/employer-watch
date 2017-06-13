module.exports = {
    json_documents_url: 'http://cdn.oventi.net/fwo_augmented_media_releases.json',
    json_documents_url2: 'http://cdn.oventi.net/fwo_media_releases.test.json',

    redis: {
        connect: true,
        host: 'employer-watch.fovchw.0001.apse1.cache.amazonaws.com',
        port: 6379
    },

    api: 'http://localhost:5002/api',
    key_prefixes: {
        reports: {
            au: 'reports.au'
        }
    }
}
