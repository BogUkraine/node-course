import { Request, Response } from 'express'

export const mainController = async (req: Request, res: Response) => {
    res.render('index')
}
