import { Router } from 'express'
import { mainController } from '../controllers/index.controller'

const router = Router()

router.get('/index', mainController)

export default router
