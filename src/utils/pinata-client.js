const { PinataSDK } = require('pinata')
const stageConfig = require('../../stage-config')

const pinata = new PinataSDK({
  pinataJwt: stageConfig.PINATA_JWT,
  pinataGateway: stageConfig.PINATA_GATEWAY
})

module.exports = pinata
