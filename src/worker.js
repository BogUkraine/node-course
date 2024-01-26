const { parentPort } = require('worker_threads')
const { fetchPage, loadPage, parsePage } = require('./fetchAndParse')
const { arrayToCSV } = require('./utils')

// eslint-disable-next-line import/newline-after-import
;(async () => {
    try {
        parentPort.on('message', async (data) => {
            console.log('Recieved in worker', data.pageNumber)

            const htmlResult = await fetchPage(data.pageNumber) // I would move all async job to the main thread https://snyk.io/blog/node-js-multithreading-with-worker-threads/
            const loadedPage = loadPage(htmlResult)
            const parsedPage = parsePage(loadedPage)

            parentPort.postMessage({ data: `\n${arrayToCSV(parsedPage)}`, pageNumber: data.pageNumber })
        })
    } catch (error) {
        console.error(error)
    }
})()
