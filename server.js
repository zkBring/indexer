const stageConfig = require('./stage-config')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const { sequelize } = require('./src/models')
const buildRouter = require('./src/routes')
const logger = require('./src/utils/logger')
const cookieParser = require('cookie-parser')
const { isCelebrateError } = require('celebrate')
const asyncHandler = require('express-async-handler')
const errorToWarn = require('./configs/error-to-warn.json')
const config = require(`./configs/${stageConfig.NODE_ENV}.config`)
const { requestValidator } = require('./src/utils/request-validator')
const { dbListenerService, dropExpirationService } = require('./src/services')

app.use(express.urlencoded({
  limit: config.requestSizeLimit,
  extended: false
}))
app.use(express.json({ limit: config.requestSizeLimit }))
app.use(cors({
  origin: config.origins,
  credentials: true
}))
app.use(cookieParser())

app.use(
  morgan(
    ':method :url :user-agent :remote-addr :res[content-length] - :status / :total-time ms',
    { stream: logger.stream }
  )
)

// connect to database
sequelize.authenticate()
  .then(async () => {
    logger.info('Connected to DB')

    await dbListenerService.startListening()
    logger.info('Database listener started')
    
    if (stageConfig.NODE_ENV === 'production') {
      dropExpirationService.start()
    }

    const PORT = stageConfig.PORT || 8000
    app.listen(PORT, () => logger.info(`Server is up on port ${PORT}`))
  })
  .catch(err => {
    logger.error(`${err}\n`)
    process.exit(1)
  })

// Validate requests with api key
app.use(asyncHandler(requestValidator))

app.use('/api/v1/', buildRouter('routes'))
app.get('/', (req, res) => res.send('👋 Hello from zkbring indexer'))

// Error handling middleware
app.use((error, req, res, next) => {
  if (isCelebrateError(error)) {
    const errorNames = []
    error.details.forEach(
      value => value.details.forEach(
        detail => errorNames.push(detail.message)))
    logger.warn({
      message: 'Request params validation error.',
      errorNames
    })
    logger.warn(error.stack)

    res.status(400)
    res.send({
      success: false,
      error: 'Validation error',
      errors: errorNames
    })
  } else if (error.isOperational) {
    const shouldWarn = errorToWarn[error.cause]?.warn
    const isSilenced = errorToWarn[error.cause]?.silence

    if (shouldWarn) {
      logger.warn(error.message)
      logger.warn(error.stack)
    } else if (!isSilenced) {
      logger.error(error.message)
      logger.error(error.stack)
    }

    res.status(error.statusCode).send({
      success: false,
      error: error.message,
      message: error.message,
      errors: [error.cause || 'SERVER_ERROR']
    })
  } else if (error.reason) {
    // error for contract or ethers.js
    logger.error(error.message)
    logger.error(error.stack)

    logger.json(error)
    const errors = error.reason
    res.status(400)
    res.send({ success: false, errors })
  } else {
    // don't send error details to the scary external world
    logger.error(error.stack)
    const errors = ['SERVER_ERROR']
    res.status(500)
    res.send({ success: false, errors })
  }
  return null
})
