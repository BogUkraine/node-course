import express, { Application, Request, Response } from 'express'
import { config } from './configs/load-config'

const app: Application = express()
const PORT = config.PORT || 8000

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
