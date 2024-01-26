const cheerio = require('cheerio')
const { START_PAGE_NUMBER } = require('../constants')

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

module.exports = {
    loadPage,
    parsePage,
    fetchTotalPageNumber,
}
