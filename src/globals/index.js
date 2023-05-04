import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import { createClient } from 'redis'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const httpServer = createServer(app)

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`
})
const mongoClient = mongoose.connect(`mongodb://${process.env.MONGO_HOST}:27017/hub`)

const io = new Server(httpServer, {
  cors: {
    origin: process.env.SPA_URL,
    credentials: true,
  },
})

export { app, httpServer, mongoClient, redisClient, io }
