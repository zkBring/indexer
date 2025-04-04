const { Client } = require('pg')
const logger = require('../utils/logger')
const { sequelize } = require('../models/index')
const stageConfig = require('../../stage-config')

class DatabaseListenerService {
  constructor (dropService) {
    this.dropService = dropService
    this.client = null
  }

  async startListening () {
    try {
      await this.setupTriggers()
      await this.startDBListener()
    } catch (error) {
      logger.error('Error starting database listener:', error)
      this.reconnect()
    }
  }

  async setupTriggers () {
    await this.setupNewDropTrigger()
  }

  async setupNewDropTrigger () {
    try {
      await sequelize.query(`
        CREATE OR REPLACE FUNCTION events.notify_new_drop()
        RETURNS trigger AS $$
        BEGIN
          PERFORM pg_notify(
            'new_drop',
            json_build_object(
              'drop_address', NEW.drop_address,
              'metadata_ipfs_hash', NEW.metadata_ipfs_hash
            )::text
          );
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `)

      await sequelize.query(`
        DROP TRIGGER IF EXISTS drop_notify_trigger ON events.drops;
        CREATE TRIGGER drop_notify_trigger
          AFTER INSERT ON events.drops
          FOR EACH ROW
          EXECUTE FUNCTION events.notify_new_drop();
      `)

      const [rows] = await sequelize.query(`
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'drop_notify_trigger' 
        AND tgrelid = 'events.drops'::regclass
      `)

      if (rows.length === 0) {
        throw new Error('Failed to create trigger')
      }

      logger.info('Successfully created new drop trigger')
    } catch (error) {
      logger.error('Error setting up new drop trigger:', error)
      throw error
    }
  }

  async startDBListener () {
    try {
      if (this.client) {
        await this.client.end()
      }

      this.client = new Client({
        connectionString: stageConfig.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      })

      await this.client.connect()
      await this.client.query('LISTEN new_drop')

      this.client.on('notification', async (msg) => {
        try {
          const payload = JSON.parse(msg.payload)
          logger.info(`Received database notification on channel: ${msg.channel}`)
          logger.json(payload)

          switch (msg.channel) {
            case 'new_drop':
              await this.handleNewDrop(payload)
              break
            default:
              logger.error('Unknown database notification channel:', msg.channel)
          }
        } catch (error) {
          logger.error('Error processing database notification:', error)
        }
      })

      this.client.on('error', (err) => {
        logger.error('Database connection error:', err)
        this.reconnect()
      })

      logger.info('Listening for PostgreSQL notifications...')
    } catch (error) {
      logger.error('Error starting database listener:', error)
      this.reconnect()
    }
  }

  async handleNewDrop (payload) {
    await this.dropService.updateTitleAndDescription({
      dropAddress: payload.drop_address,
      metadataIpfsHash: payload.metadata_ipfs_hash
    })
    logger.info(`Successfully processed new drop notification for drop address: ${payload.drop_address}`)
  }

  async reconnect () {
    try {
      if (this.client) {
        await this.client.end()
      }
      await new Promise((resolve) => setTimeout(resolve, 5000))
      await this.startListening()
    } catch (error) {
      logger.error('Error reconnecting database listener:', error)
    }
  }
}

module.exports = DatabaseListenerService
