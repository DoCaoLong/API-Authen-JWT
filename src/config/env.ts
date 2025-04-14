import dotenv from 'dotenv'

dotenv.config()

export const ConfigEnvironment = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || '',
  MONGO_DB: process.env.MONGO_DB || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  SMTP_USER: process.env.SMTP_USER || '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
}
