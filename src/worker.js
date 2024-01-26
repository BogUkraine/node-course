const { parentPort } = require('worker_threads')
const { loadPage, parsePage } = require('./lib/parser')
const { arrayToCSVString } = require('./utils/csv-helpers')
const { fetchPage } = require('./lib/api-calls')

// eslint-disable-next-line import/newline-after-import
;(async () => {
    try {
        parentPort.on('message', async (data) => {
            console.log('Recieved in worker', data.pageNumber)

            const htmlResult = await fetchPage(data.pageNumber) // I would move all async job to the main thread https://snyk.io/blog/node-js-multithreading-with-worker-threads/
            const loadedPage = loadPage(htmlResult)
            const parsedPage = parsePage(loadedPage)

            parentPort.postMessage({ data: `\n${arrayToCSVString(parsedPage)}`, pageNumber: data.pageNumber })
        })
    } catch (error) {
        console.error(error)
    }
})()
