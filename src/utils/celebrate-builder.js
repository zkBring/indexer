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

  if (celebrateSchema === 'getDropTitleAndDescription') {
    return celebrate({
      [Segments.BODY]: Joi.object().keys({
        id: Joi.string().required().messages({
          'string.base': 'ID_WRONG_TYPE',
          'string.empty': 'ID_REQUIRED',
          'any.required': 'ID_REQUIRED',
        }),
        drop_address: Joi.string().required().messages({
          'string.base': 'DROP_ADDRESS_WRONG_TYPE',
          'string.empty': 'DROP_ADDRESS_REQUIRED',
          'any.required': 'DROP_ADDRESS_REQUIRED',
        }),
        factory_address: Joi.string().required().messages({
          'string.base': 'FACTORY_ADDRESS_WRONG_TYPE',
          'string.empty': 'FACTORY_ADDRESS_REQUIRED',
          'any.required': 'FACTORY_ADDRESS_REQUIRED',
        }),
        token_address: Joi.string().required().messages({
          'string.base': 'TOKEN_ADDRESS_WRONG_TYPE',
          'string.empty': 'TOKEN_ADDRESS_REQUIRED',
          'any.required': 'TOKEN_ADDRESS_REQUIRED',
        }),
        creator_address: Joi.string().required().messages({
          'string.base': 'CREATOR_ADDRESS_WRONG_TYPE',
          'string.empty': 'CREATOR_ADDRESS_REQUIRED',
          'any.required': 'CREATOR_ADDRESS_REQUIRED',
        }),
        zk_pass_schema_id: Joi.string().required().messages({
          'string.base': 'ZK_PASS_SCHEMA_ID_WRONG_TYPE',
          'string.empty': 'ZK_PASS_SCHEMA_ID_REQUIRED',
          'any.required': 'ZK_PASS_SCHEMA_ID_REQUIRED',
        }),
        amount: Joi.alternatives().try(
          Joi.string(),
          Joi.number()
        ).required().messages({
          'alternatives.match': 'AMOUNT_WRONG_TYPE',
          'string.empty': 'AMOUNT_REQUIRED',
          'any.required': 'AMOUNT_REQUIRED',
        }),
        expiration: Joi.number().required().messages({
          'number.base': 'EXPIRATION_WRONG_TYPE',
          'number.empty': 'EXPIRATION_REQUIRED',
          'any.required': 'EXPIRATION_REQUIRED',
        }),
        max_claims: Joi.number().required().messages({
          'number.base': 'MAX_CLAIMS_WRONG_TYPE',
          'number.empty': 'MAX_CLAIMS_REQUIRED',
          'any.required': 'MAX_CLAIMS_REQUIRED'
        }),
        metadata_ipfs_hash: Joi.string().required().messages({
          'string.base': 'METADATA_IPFS_HASH_WRONG_TYPE',
          'string.empty': 'METADATA_IPFS_HASH_REQUIRED',
          'any.required': 'METADATA_IPFS_HASH_REQUIRED',
        }),
        status: Joi.string().required().messages({
          'string.base': 'STATUS_WRONG_TYPE',
          'string.empty': 'STATUS_REQUIRED',
          'any.required': 'STATUS_REQUIRED',
        }),
        block_timestamp: Joi.number().required().messages({
          'number.base': 'BLOCK_TIMESTAMP_WRONG_TYPE',
          'number.empty': 'BLOCK_TIMESTAMP_REQUIRED',
          'any.required': 'BLOCK_TIMESTAMP_REQUIRED',
        })
      })
    }, { abortEarly: false, mode: 'FULL' })
  }
}

module.exports = {celebrateMiddleware}
