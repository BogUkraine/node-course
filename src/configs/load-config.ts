import * as dotenv from 'dotenv'
import * as path from 'path'
import { validateSync } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { EnvironmentVariables } from './env-variables'

const envFile = `.env.${process.env.NODE_ENV}`
const envFilePath = path.resolve(process.cwd(), envFile)
dotenv.config({ path: envFilePath })

const validateConfigSync = () => {
    const config = plainToClass(EnvironmentVariables, process.env, { excludeExtraneousValues: true })
    const validationErrors = validateSync(config)

    if (validationErrors.length) {
        throw new Error(`Environment validation failed: ${validationErrors.toString()}`)
    }

    return config
}

export const config = validateConfigSync()
