import { model } from 'mongoose'
import { userSchema } from '../schemas/user.js'

export const User = model('User', userSchema)
