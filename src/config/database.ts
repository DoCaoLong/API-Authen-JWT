import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { ConfigEnvironment } from '~/config/env'

dotenv.config()

const MONGO_URI = ConfigEnvironment.MONGO_URI 

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('✅ MongoDB Connected')
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error)
    process.exit(1)
  }
}
