import Ajv from 'ajv'
import { BadRequest } from './errorHandling.js'

const ajv = new Ajv()

export default function validator(schema) {
    const validate = ajv.compile(schema)

    return (req, res, next) => {
        const isValid = validate(req.body)
        if (!isValid) {
            next(new BadRequest(JSON.stringify(validate.errors)))
        }
        next()
    }
}