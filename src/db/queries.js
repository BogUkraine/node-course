const runCreateTableQuery = async (db) =>
    new Promise((resolve, reject) => {
        db.run(
            `
            CREATE TABLE IF NOT EXISTS hockey_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                year INTEGER,
                wins INTEGER,
                losses INTEGER,
                otLosses INTEGER,
                pct REAL,
                gf INTEGER,
                ga INTEGER,
                diff INTEGER
            );
          `,
            (err) => {
                if (err) reject(err)
                else resolve()
            },
        )
    })

const runInsertQuery = (db, params) =>
    db.run('INSERT INTO hockey_data (name, year, wins, losses, otLosses, pct, gf, ga, diff) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', params, (err) => {
        if (err) console.error('cannot insert the data', err.message)
        console.log('The data was inserted')
    })

module.exports = {
    runInsertQuery,
    runCreateTableQuery,
}
