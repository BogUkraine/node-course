const { default: axios } = require('axios')
const cheerio = require('cheerio')

const BASE_URL = 'https://www.scrapethissite.com'
const START_PAGE_NUMBER = 1
const MILISECONDS_BOUNDARIES = 5000

const fetchPage = async (pageNumber) => {
    try {
        return (await axios.get(`/pages/forms/?page_num=${pageNumber}`, { baseURL: BASE_URL })).data
    } catch (error) {
        console.error('Something went wrong during GET page request', error.message, error.stack)
        throw Error(error.message)
    }
}
const loadPage = (htmlPage) => cheerio.load(htmlPage)

const parsePage = (loadedPage) => {
    const parsedRecords = []
    let recordHeaders = []

    loadedPage('table[class=table] tr').each(function (elementIndex) {
        const records = loadedPage(this)
            .children()
            .text()
            .trim()
            .split('\n')
            .map((item) => item.trim())
            .filter((item, index) => index % 2 === 0)

        if (elementIndex === 0) {
            recordHeaders = [...records]
            return
        }

        const parsedRecord = {}
        for (let i = 0; i < recordHeaders.length; i += 1) {
            parsedRecord[recordHeaders[i]] = records[i]
        }
        parsedRecords.push(parsedRecord)
    })

    return parsedRecords
}

// const formatRawCellData = (cellData) => {}
const fetchTotalPageNumber = (loadedPage) => {
    const lastPage = Number(loadedPage('.pagination li:last()').prev().text().trim())
    if (lastPage && Number.isInteger(lastPage) && !Number.isNaN(lastPage)) {
        return lastPage
    }

    console.error('The script were not able to detect total page number')
    return START_PAGE_NUMBER
}

const parsedData = []

async function fetchAndParsePage(pageNumber, isFirst = true) {
    const htmlResult = await fetchPage(pageNumber)
    const loadedPage = loadPage(htmlResult)
    parsedData.push({ data: parsePage(loadedPage), pageNumber })

    if (isFirst) {
        const totalPageNumber = fetchTotalPageNumber(loadedPage)

        for (let i = START_PAGE_NUMBER + 1; i < totalPageNumber; i += 1) {
            setTimeout(() => fetchAndParsePage(i, false), Math.random() * MILISECONDS_BOUNDARIES)
        }
    }
}

fetchAndParsePage(START_PAGE_NUMBER)
