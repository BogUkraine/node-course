import express, { Application, Request, Response } from 'express'
import { config } from './configs/load-config'
import mainRouter from './routes/index.route'
import weatherRouter from './routes/weather.route'
import path from 'path'
// const bodyParser = require('body-parser')

const app: Application = express()
const PORT = config.PORT || 8000

// app.use(bodyParser.json())
app.set('views', path.resolve(process.cwd(), 'src/templates'))
app.set('view engine', 'ejs')

app.use('/', mainRouter)
app.use('/weather', weatherRouter)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
