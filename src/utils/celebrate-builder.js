const { celebrate, Joi, Segments } = require('celebrate')

const celebrateMiddleware = celebrateSchema => {
  if (celebrateSchema === 'uploadDropMetadata') {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required().messages({
          'string.base': 'TITLE_WRONG_TYPE',
          'string.empty': 'TITLE_REQUIRED',
          'any.required': 'TITLE_REQUIRED'
        }),
        description: Joi.string().optional().allow('').messages({
          'string.base': 'DESCRIPTION_WRONG_TYPE',
          'string.empty': 'DESCRIPTION_REQUIRED',
          'any.required': 'DESCRIPTION_REQUIRED'
        })
      })
    }, { abortEarly: false, mode: 'FULL' })
  }
}

module.exports = {
  celebrateMiddleware
}
