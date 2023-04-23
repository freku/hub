import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import { User } from '../models/index.js'

const router = Router()

const invalidCredentialsResponse = (res) =>
  res.status(StatusCodes.UNAUTHORIZED).send({
    message: 'Invalid credentials',
  })

export default function authRouter() {
  router.get('/', (req, res) => {
    res.send('Hello World!')
  })

  router.get('/users', async (req, res) => {
    res.send(await User.find({}).exec())
  })

  router.get('/user', (req, res) => {
    // TODO: maybe return user if needed
    res.send()
  })

  router.post('/login', async (req, res) => {
    const { email, password } = req.body

    const account = await User.findOne({ email }).exec()

    if (!account) {
      return invalidCredentialsResponse(res)
    }
    const passwordMatch = await bcrypt.compare(password, account.password)

    if (!passwordMatch) {
      return invalidCredentialsResponse(res)
    }

    const token = jwt.sign(
      { email, username: account.username, id: account._id },
      Buffer.from(process.env.JWT_SECRET, 'base64'),
      {
        expiresIn: '1h',
        // expiresIn: 10,
      }
    )

    res.cookie('jwt_token', token, {
      httpOnly: true,
      secure: true, // Set this to 'true' in production when using HTTPS
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: 'strict', // Helps to protect against CSRF attacks
    })

    return res.status(StatusCodes.OK).send({ token })
  })

  return router
}
