const { Worker } = require('worker_threads')
const fs = require('fs')
const { START_PAGE_NUMBER, MAX_THREADS_NUMBER, MAX_THREADS_PARALLEL_THREADS, DATA_FILE } = require('./constants')
const { loadPage, fetchTotalPageNumber } = require('./lib/parser')
const { fetchPage } = require('./lib/api-calls')
const { exitHandler } = require('./utils/error-handling')
const { getCSVHeadears } = require('./utils/csv-helpers')
const Semaphore = require('./utils/semaphore')

const semaphore = new Semaphore(MAX_THREADS_PARALLEL_THREADS)
const workerThreads = []

;(async () => {
    const htmlResult = await fetchPage(START_PAGE_NUMBER)
    const loadedPage = loadPage(htmlResult)
    const totalPageNumber = fetchTotalPageNumber(loadedPage)

    const writableStream = fs.createWriteStream(`${__dirname}/files/${DATA_FILE}`)
    writableStream.on('error', (error) => console.error('Something went wrong with writable', error))
    writableStream.write(getCSVHeadears())

    const pageNumbersNotTakenIntoWork = new Array(totalPageNumber).fill(1).map((item, index) => item + index) // have a list of all pages e.g. [1, 2, ... totalPageNumber]

    const threadsNumber = Math.min(totalPageNumber, MAX_THREADS_NUMBER)

    const processNextTaskWithWorker = () => {
        if (semaphore.isFreeSlot() && pageNumbersNotTakenIntoWork.length) {
            const pageNumber = pageNumbersNotTakenIntoWork.shift()
            const worker = workerThreads.find((item) => !item.isBusy)

            semaphore.takeFreeSlot()

            worker.postMessage({ pageNumber })
            worker.isBusy = true

            processNextTaskWithWorker()
        } else if (!pageNumbersNotTakenIntoWork.length) {
            workerThreads.forEach((worker) => worker.terminate())
            writableStream.close()
        }
    }

    for (let i = 0; i < threadsNumber; i += 1) {
        workerThreads.push(new Worker(`${__dirname}/worker.js`))
    }

    workerThreads.forEach((worker) => {
        worker.on('message', (value) => {
            console.log('Message is recieved for page #', value.pageNumber)
            writableStream.write(value.data)

            semaphore.releaseSlot()
            // eslint-disable-next-line no-param-reassign
            worker.isBusy = false
            processNextTaskWithWorker()
        })
        worker.on('error', (error) => console.error(error))
        worker.on('exit', (code) => console.error(`Worker exited with code ${code}.`))
    })

    processNextTaskWithWorker()
})()

// it would be good to close writable stream here as well, but next time...
process.on('uncaughtException', exitHandler(1, 'Unexpected Error', workerThreads))
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise', workerThreads))
process.on('SIGTERM', exitHandler(0, 'SIGTERM', workerThreads))
process.on('SIGINT', exitHandler(0, 'SIGINT', workerThreads))
