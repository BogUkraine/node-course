const { Worker } = require('worker_threads')
const { START_PAGE_NUMBER, MAX_THREADS_NUMBER, WORKER_TERMINATE_CHECK_TIME_MS } = require('./constants')
const { fetchPage, loadPage, fetchTotalPageNumber } = require('./fetchAndParse')

// eslint-disable-next-line import/newline-after-import
;(async () => {
    const parsedData = []

    const htmlResult = await fetchPage(START_PAGE_NUMBER)
    const loadedPage = loadPage(htmlResult)
    const totalPageNumber = fetchTotalPageNumber(loadedPage)

    const pageNumbersNotTakenIntoWork = new Array(totalPageNumber).fill(1).map((item, index) => item + index) // have a list of all pages e.g. [1, 2, ... totalPageNumber]
    const workerThreads = []

    const threadsNumber = Math.min(totalPageNumber, MAX_THREADS_NUMBER)

    for (let i = 0; i < threadsNumber; i += 1) {
        workerThreads.push(new Worker(`${__dirname}/worker.js`))
    }

    workerThreads.forEach((worker) => {
        worker.on('message', (value) => {
            console.log('Message is recieved for page #', value.pageNumber)
            parsedData.push({ data: value.data, pageNumber: value.pageNumber })

            if (pageNumbersNotTakenIntoWork.length) {
                const pageNumber = pageNumbersNotTakenIntoWork.shift()
                worker.postMessage({ pageNumber })
            }
        })
        worker.on('error', (error) => console.error(error))
        worker.on('exit', (code) => console.error(`Worker exited with code ${code}.`))
    })

    workerThreads.forEach((worker) => {
        const interval = setInterval(() => {
            if (!pageNumbersNotTakenIntoWork.length || parsedData.length === totalPageNumber) {
                worker.terminate()
                clearInterval(interval)
            }
        }, WORKER_TERMINATE_CHECK_TIME_MS)
    })

    workerThreads.forEach((worker, index) => {
        if (index < totalPageNumber) {
            pageNumbersNotTakenIntoWork.shift()
            worker.postMessage({ pageNumber: index + 1 })
        }
    })
})()

// there is no random behaviour
// not a real semaphore ??