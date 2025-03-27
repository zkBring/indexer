const logger = require('../utils/logger')
const ipfsService = require('../services/ipfs-service')

const uploadDropMetadata = async (req, res) => {
    logger.json({ controller: 'metadata-controller', method: 'uploadDropMetadata' })
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
  
const getDropTitleAndDescription = async (req, res) => {
  logger.json({ controller: 'metadata-controller', method: 'getDropTitleAndDescription' })
  const {
    drop, 
    factory_address, 
    token, 
    creator, 
    zk_pass_schema_id, 
    amount, 
    expiration, 
    max_claims, 
    metadata_ipfs_hash, 
    block_timestamp
  } = req.body

  const {
    title, 
    description
  } = await ipfsService.getDropTitleAndDescription(metadata_ipfs_hash)

  res.json({
    success: true,
    drop,
    factory_address,
    token,
    creator,
    zk_pass_schema_id,
    amount,
    expiration,
    max_claims,
    metadata_ipfs_hash,
    block_timestamp,
    title,
    description
  })
}

module.exports = {
  uploadDropMetadata,
  getDropTitleAndDescription
}