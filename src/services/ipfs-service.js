const { PinataSDK } = require('pinata')
const stageConfig = require('../../stage-config')
const logger = require('../utils/logger')
class IpfsService {
  constructor() {
    this.pinata = new PinataSDK({
      pinataJwt: stageConfig.PINATA_JWT,
      pinataGateway: stageConfig.PINATA_GATEWAY,
      pinataGatewayKey: stageConfig.PINATA_GATEWAY_KEY
    })
  }

  async uploadDropMetadata ({ title, description }) {
    const metadata = {
      title,
      description
    }

    const { cid } = await this.pinata.upload.public.json(metadata).name(`${title}.json`)

    return cid
  }

  async getDropTitleAndDescription (metadataIpfsHash) {
    try {
      const result = await this.pinata.gateways.public.get(metadataIpfsHash)
      return result.data
    } catch (err) { 
      logger.error(err)
      throw err
    }
  }
}

module.exports = new IpfsService()