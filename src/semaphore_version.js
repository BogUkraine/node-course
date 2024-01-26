const { Worker } = require('worker_threads')
const { START_PAGE_NUMBER, MAX_THREADS_NUMBER, MAX_THREADS_PARALLEL_THREADS } = require('./constants')
const { fetchPage, loadPage, fetchTotalPageNumber } = require('./fetchAndParse')
const Semaphore = require('./semaphore')

const semaphore = new Semaphore(MAX_THREADS_PARALLEL_THREADS)

;(async () => {
    const parsedData = []

    const htmlResult = await fetchPage(START_PAGE_NUMBER)
    const loadedPage = loadPage(htmlResult)
    const totalPageNumber = fetchTotalPageNumber(loadedPage)

    const pageNumbersNotTakenIntoWork = new Array(totalPageNumber).fill(1).map((item, index) => item + index) // have a list of all pages e.g. [1, 2, ... totalPageNumber]
    const workerThreads = []

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
        }
    }

    for (let i = 0; i < threadsNumber; i += 1) {
        workerThreads.push(new Worker(`${__dirname}/worker.js`))
    }

    workerThreads.forEach((worker) => {
        worker.on('message', (value) => {
            console.log('Message is recieved for page #', value.pageNumber)
            parsedData.push({ data: value.data, pageNumber: value.pageNumber })
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
