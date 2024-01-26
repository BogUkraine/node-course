const { default: axios } = require('axios')
const { BASE_URL } = require('../constants')

const fetchPage = async (pageNumber) => {
    try {
        return (await axios.get(`/pages/forms/?page_num=${pageNumber}`, { baseURL: BASE_URL })).data
    } catch (error) {
        console.error('Something went wrong during GET page request', error.message, error.stack)
        throw Error(error.message)
    }
}

module.exports = { fetchPage }
