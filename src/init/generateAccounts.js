import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { User } from '../models/index.js'
dotenv.config()

async function main() {
  const mongoClient = await mongoose.connect(process.env.MONGO_URI)

  const accounts = [
    {
      username: 'Joe',
      password: await bcrypt.hash('123456', 10),
      email: 'joe@gmail.com',
    },
    {
      username: 'Moe',
      password: await bcrypt.hash('123456', 10),
      email: 'moe@gmail.com',
    },
    {
      username: 'Frank',
      password: await bcrypt.hash('123456', 10),
      email: 'frank@gmail.com',
    },
  ]

  await removePreviousAccounts()

  await addAccounts(accounts)

  mongoClient.disconnect()

  console.log('Accounts added successfully.')
}

async function removePreviousAccounts() {
  await User.deleteMany({})
}

async function addAccounts(accounts) {
  await User.insertMany(accounts)
}

main()
