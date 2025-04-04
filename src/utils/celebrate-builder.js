const { celebrate, Joi, Segments } = require('celebrate')

const celebrateMiddleware = celebrateSchema => {
  if (celebrateSchema === 'getAllDrops') {
    return celebrate({
      [Segments.QUERY]: Joi.object().keys({
        limit: Joi.number().optional().messages({
          'number.base': 'LIMIT_WRONG_TYPE'
        }),
        offset: Joi.number().optional().messages({
          'number.base': 'OFFSET_WRONG_TYPE'
        }),
        creator_address: Joi.string().optional().messages({
          'string.base': 'CREATOR_ADDRESS_WRONG_TYPE',
          'string.empty': 'CREATOR_ADDRESS_EMPTY'
        }),
        staked: Joi.boolean().optional().messages({
          'boolean.base': 'STAKED_WRONG_TYPE'
        }),
        status: Joi.string().optional().valid('active', 'finished', 'stopped', 'expired').messages({
          'string.base': 'STATUS_WRONG_TYPE',
          'string.empty': 'STATUS_EMPTY'
        })
      })
    })
  }
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

module.exports = { celebrateMiddleware }
