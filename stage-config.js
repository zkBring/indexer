const dotenv = require('dotenv')
const path = require('path')
const version = require('./package.json').version

dotenv.config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
})

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  DD_VERSION: version,
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 8000,
  API_SECRET: process.env.API_SECRET,
  PINATA_JWT: process.env.PINATA_JWT,
  PINATA_GATEWAY: process.env.PINATA_GATEWAY,
  PINATA_GATEWAY_KEY: process.env.PINATA_GATEWAY_KEY,
  REQUEST_VALIDATION: process.env.REQUEST_VALIDATION,
  MINIMUM_STAKED_BRING: process.env.MINIMUM_STAKED_BRING || '10000',
  DROP_EXPIRATION_CRON_SCHEDULE: process.env.DROP_EXPIRATION_CRON_SCHEDULE || '* * * * *'
}
