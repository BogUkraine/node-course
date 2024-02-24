import { Router } from 'express'
import { getByCity } from '../controllers/weather.controller'

const router = Router()

router.get('/:city', getByCity)

export default router
