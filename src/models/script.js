import { model } from 'mongoose'
import { scriptSchema } from '../schemas/script.js'

const Script = model('Script', scriptSchema)

export { Script }
