const { ForbiddenError } = require('./errors')
const stageConfig = require('../../stage-config')

const requestValidator = (req, res, next) => {
    if (stageConfig.REQUEST_VALIDATION !== 'true') return next()
  
    const apiSecretKey = req.get('api-secret-key')
    if (!apiSecretKey) throw new ForbiddenError(
      'Api secret key is not provided.', 'API_SECRET_KEY_NOT_PROVIDED'
    )
    if (apiSecretKey !== stageConfig.API_SECRET) throw new ForbiddenError(
      'Requests from unauthorized resources are forbidden!', 'UNAUTHORIZED_REQUEST'
    )

    return next()
}

module.exports = {
  requestValidator
}