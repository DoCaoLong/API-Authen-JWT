import dotenv from 'dotenv'

dotenv.config()

// Check if the environment variables are set 
const checkRequiredEnv = (key: string, defaultValue: string = ''): string => {
  const value = process.env[key] || defaultValue
  if (!value) {
    console.warn(`⚠️ Warning: Environment variable ${key} is missing or empty`)
  }
  return value
}

export const ConfigEnvironment = {
  // Server configuration
  PORT: checkRequiredEnv('PORT', '3000'),

  NODE_ENV: checkRequiredEnv('NODE_ENV', 'development'),

  // MongoDB configuration
  MONGO_URI: checkRequiredEnv('MONGO_URI'),
  MONGO_DB: checkRequiredEnv('MONGO_DB'),

  // SMTP configuration
  SMTP_PASSWORD: checkRequiredEnv('SMTP_PASSWORD'),
  SMTP_USER: checkRequiredEnv('SMTP_USER'),
  CLIENT_URL: checkRequiredEnv('CLIENT_URL', 'http://localhost:3000'),

  // JWT configuration
  JWT_SECRET: checkRequiredEnv('JWT_SECRET'),
  JWT_REFRESH_SECRET: checkRequiredEnv('JWT_REFRESH_SECRET'),
  JWT_EXPIRES_IN: checkRequiredEnv('JWT_EXPIRES_IN', '15m'),
  JWT_REFRESH_EXPIRES_IN: checkRequiredEnv('JWT_REFRESH_EXPIRES_IN', '7d'),

  // reCAPTCHA configuration
  RECAPTCHA_SECRET: checkRequiredEnv('RECAPTCHA_SECRET')
}
