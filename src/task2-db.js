const csvParser = require('csv-parser')
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()
const { DATA_FILE, DB_FILE } = require('./constants')
const { exitHandler } = require('./utils/error-handling')
const { runCreateTableQuery, runInsertQuery } = require('./db/queries')

// eslint-disable-next-line import/newline-after-import
;(async () => {
    try {
        const db = await new Promise((resolve, reject) => {
            const database = new sqlite3.Database(`${__dirname}/db/${DB_FILE}`, (err) => {
                if (err) reject(err)
                else resolve(database)
            })
        })

        await runCreateTableQuery(db)

        fs.createReadStream(`${__dirname}/files/${DATA_FILE}`)
            .pipe(csvParser({ delimiter: ',', from_line: 2 })) // Skip header row
            .on('data', (row) => {
                runInsertQuery(db, Object.values(row))
            })
            .on('end', () => {
                console.log('CSV data imported successfully')

                db.close((err) => {
                    if (err) {
                        console.error(err.message)
                        throw Error('Cannot close db connection', err)
                    } else {
                        console.log('Database connection closed')
                    }
                })
            })
    } catch (error) {
        console.error(error)
    }
})()

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'))
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'))
process.on('SIGTERM', exitHandler(0, 'SIGTERM'))
process.on('SIGINT', exitHandler(0, 'SIGINT'))

/*
    Obvious improvements which could be made here:
    1. async iterator (for await) with semaphore
    2. insert records in batches (not the single one at time)

    + close db on handled error
*/
