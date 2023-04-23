import { expressjwt as jwtMiddleware } from 'express-jwt'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import { app } from './globals/index.js'

export const useMiddlewares = () => {
  // Cookies
  app.use(cookieParser())

  // CORS
  app.use(
    cors({
      origin: process.env.SPA_URL,
      credentials: true,
    })
  )

  // JSON decoding
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Logging
  app.use(morgan('tiny'))

  // JWT
  app.use(
    jwtMiddleware({
      secret: Buffer.from(process.env.JWT_SECRET, 'base64'),
      algorithms: ['HS256'],
      getToken: (req) => req.cookies.jwt_token,
    }).unless({
      path: ['/login'],
    })
  )
}
