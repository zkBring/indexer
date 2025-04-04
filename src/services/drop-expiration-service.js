const cron = require('node-cron')
const { Op } = require('sequelize')
const { Drop } = require('../models')
const logger = require('../utils/logger')
const stageConfig = require('../../stage-config')

class DropExpirationService {
  constructor() {
    this.isRunning = false
  }

  start() {
    logger.info(`cron Drop Expiration Schedule is ${stageConfig.DROP_EXPIRATION_CRON_SCHEDULE}`)
    
    cron.schedule(stageConfig.DROP_EXPIRATION_CRON_SCHEDULE, async () => {
      try {
        await this.checkExpiredDrops()
      } catch (error) {
        logger.error('Error in expire drops task', { error: error.message, stack: error.stack })
      }
    })
  }

  async checkExpiredDrops() {
    if (this.isRunning) {
      logger.info('---Drop expiration service: Already running---')
      return
    }

    this.isRunning = true

    const currentTimestamp = Math.floor(Date.now() / 1000)
    
    const expiredDrops = await Drop.findAll({
      where: {
        status: 'active',
        expiration: {
          [Op.lt]: currentTimestamp
        },
        shadowbanned: false
      }
    })

    if (expiredDrops.length === 0) {
      // logger.debug('---Drop expiration service: No expired drops found---')
      this.isRunning = false
      return
    }

    const dropAddresses = expiredDrops.map(drop => drop.drop_address)
    
    const [updatedCount] = await Drop.update(
      { status: 'expired' },
      {
        where: {
          drop_address: {
            [Op.in]: dropAddresses
          }
        }
      }
    )

    logger.info(`---Drop expiration service: Updated ${updatedCount} expired drops. count: ${updatedCount}, addresses: ${dropAddresses}---`)
    this.isRunning = false
  }
}

module.exports = DropExpirationService 