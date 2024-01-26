const arrayToCSV = (dataArray) => {
    if (!dataArray || dataArray.length === 0) {
        return ''
    }

    return dataArray.map((item) => Object.values(item).toString()).join('\n')
}

module.exports = {
    arrayToCSV,
}
