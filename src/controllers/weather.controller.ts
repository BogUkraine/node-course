import { Request, Response } from 'express'

export const getByCity = async (req: Request, res: Response) => {
    try {
        console.log('eee')
        return res.json({ status: 'IK' })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'something went wrong' })
    }
}
