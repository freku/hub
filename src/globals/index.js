import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import { createClient } from 'redis'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const httpServer = createServer(app)

const redisClient = createClient()
const mongoClient = mongoose.connect(process.env.MONGO_URI)

const io = new Server(httpServer, {
  cors: {
    origin: process.env.SPA_URL,
    credentials: true,
  },
})

export { app, httpServer, mongoClient, redisClient, io }
