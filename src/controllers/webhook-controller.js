const logger = require('../utils/logger')
const { dropService } = require('../services/index')

const handleDropStopWebhook = async (req, res) => {
  logger.json({ controller: 'webhook-controller', method: 'handleDropStopWebhook' })
  const dropAddress = req.body.drop_address
  await dropService.updateStatus({ dropAddress, status: 'stopped' })

  res.status(200).end()
}

const handleTotalStakedWebhook = async (req, res) => {
  logger.json({ controller: 'webhook-controller', method: 'handleTotalStakedWebhook' })
  const {
    drop_address: dropAddress,
    total_staked: totalStaked
  } = req.body
  await dropService.updateTotalStaked({ dropAddress, totalStaked })

  res.status(200).end()
}

const handleMetadataUpdateWebhook = async (req, res) => {
  logger.json({ controller: 'webhook-controller', method: 'handleMetadataUpdateWebhook' })
  const {
    drop_address: dropAddress,
    metadata_ipfs_hash: metadataIpfsHash
  } = req.body
  await dropService.updateTitleAndDescription({ dropAddress, metadataIpfsHash })

  res.status(200).end()
}

module.exports = {
  handleDropStopWebhook,
  handleTotalStakedWebhook,
  handleMetadataUpdateWebhook
}
