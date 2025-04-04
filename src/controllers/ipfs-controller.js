const logger = require('../utils/logger')
const { ipfsService } = require('../services/index')

const uploadDropMetadata = async (req, res) => {
  logger.json({ controller: 'ipfs-controller', method: 'uploadDropMetadata' })
  const {
    title,
    description
  } = req.body

  const metadataIpfsHash = await ipfsService.uploadDropMetadata({ title, description })

  res.json({
    success: true,
    metadataIpfsHash
  })
}

module.exports = {
  uploadDropMetadata
}
