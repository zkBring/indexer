const DropService = require('./drop-service')
const IpfsService = require('./ipfs-service')
const ClaimerService = require('./claimer-service')
const DropExpirationService = require('./drop-expiration-service')
const DatabaseListenerService = require('./database-listener-service')

const ipfsService = new IpfsService()
const claimerService = new ClaimerService()
const dropExpirationService = new DropExpirationService()

const dropService = new DropService(ipfsService)
const dbListenerService = new DatabaseListenerService(dropService)

module.exports = {
  dropService,
  ipfsService,
  claimerService,
  dbListenerService,
  dropExpirationService
}
