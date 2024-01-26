const sqlite3 = require('sqlite3').verbose()
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
})
const { DB_FILE } = require('./constants')
const { exitHandler } = require('./utils/error-handling')

const queryDatabase = async (query, params = []) => {
    const db = await new Promise((resolve, reject) => {
        const database = new sqlite3.Database(`${__dirname}/db/${DB_FILE}`, (err) => {
            if (err) reject(err)
            else resolve(database)
        })
    })

    try {
        const rows = await new Promise((resolve, reject) => {
            db.all(query, params, (err, result) => {
                if (err) reject(err)
                else resolve(result)
            })
        })
        return rows
    } finally {
        db.close()
    }
}

const displayStats = async (option, parameters) => {
    try {
        let rows
        switch (option) {
            case '1':
                rows = await queryDatabase('SELECT * FROM hockey_data WHERE name = ?', parameters)
                break
            case '2':
                rows = await queryDatabase('SELECT name, wins FROM hockey_data WHERE year = ? ORDER BY wins DESC LIMIT 1', parameters)
                break
            case '3':
                rows = await queryDatabase('SELECT SUM(wins) AS total_wins FROM hockey_data WHERE name = ?', parameters)
                break
            case '4':
                rows = await queryDatabase('SELECT name, SUM(wins) AS total_wins FROM hockey_data GROUP BY name ORDER BY total_wins DESC')
                break
            default:
                console.error('Invalid option selected.')
                return
        }

        if (rows.length === 0) {
            console.log('No results found.')
        } else {
            console.table(rows)
        }
    } catch (err) {
        console.error('Error fetching data:', err.message)
    }
}

const main = async () => {
    console.log('Hockey Data Statistics')
    console.log('--------------------------------')

    console.log('\nSelect an option:')
    console.log('1. TEAM_DATA')
    console.log('2. TOP_WINS')
    console.log('3. TOTAL_WINS_BY_TEAM')
    console.log('4. TOTAL_WINS_RATING')
    console.log('5. Exit')

    const allowedOptions = [1, 2, 3, 4, 5]
    const option = await new Promise((resolve) => {
        readline.question('Enter the number option: ', (answer) => {
            if (!allowedOptions.find((item) => item.toString() === answer.toString())) {
                console.log('Invalid option selected')
                process.exit(0)
            }
            resolve(answer)
        })
    })

    if (option === '5') process.exit(0)

    let parameters
    if (option !== '4') {
        parameters = await new Promise((resolve) => {
            readline.question('Enter parameters (separated by comma if multiple): ', (answer) => {
                resolve(answer.split(','))
            })
        })
    }

    await displayStats(option, parameters)

    console.log('Exiting terminal.')
    readline.close()
}

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'))
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'))
process.on('SIGTERM', exitHandler(0, 'SIGTERM'))
process.on('SIGINT', exitHandler(0, 'SIGINT'))

main()
