import dotenv from 'dotenv'
dotenv.config()

import ioSetup from './websockets/index.js'
import { useRouters } from './routers.js'
import { useMiddlewares } from './middlewares.js'
import { insertScriptsInDatabase } from './init/insertScriptsToDatabase.js'
import {
  app,
  httpServer,
  io,
  mongoClient,
  redisClient,
} from './globals/index.js'

ioSetup()
useMiddlewares()
useRouters()

// Global error handler for UnauthorizedError
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(403).send({
      message: 'No token provided.',
    })
  }
})

httpServer.listen(process.env.PORT, async () => {
  await redisClient.connect()

  await insertScriptsInDatabase()

  redisClient.on('error', (err) => {
    console.log(`Redis error: ${err}`)
  })

  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})
