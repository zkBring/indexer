const { Sequelize } = require('sequelize')
const stageConfig = require('../../stage-config')
const logger = require('../utils/logger')

const sequelize = new Sequelize(stageConfig.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: stageConfig.NODE_ENV === 'development' 
      ? (msg) => logger.debug(msg) 
      : false
  })

module.exports = sequelize