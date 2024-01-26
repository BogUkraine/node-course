const arrayToCSVString = (dataArray) => {
    if (!dataArray || dataArray.length === 0) {
        return ''
    }

    return dataArray.map((item) => Object.values(item).toString()).join('\n')
}

const getCSVHeadears = () => 'name,year,wins,losses,otLosses,pct,gf,ga,diff'

module.exports = {
    arrayToCSVString,
    getCSVHeadears,
}
