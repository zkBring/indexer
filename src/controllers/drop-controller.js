const logger = require('../utils/logger')
const { dropService, claimerService } = require('../services/index')

const getAllDrops = async (req, res) => {
  logger.json({ controller: 'drop-controller', method: 'getAllDrops' })
  const {
    limit,
    offset,
    staked,
    status,
    creator_address: creatorAddress
  } = req.query

  const result = await dropService.getAllActiveDrops({
    limit,
    offset,
    staked,
    status,
    creatorAddress
  })

  res.json({
    success: true,
    drops_array: result.drops,
    result_set: result.resultSet
  })
}

const getDropByAddress = async (req, res) => {
  logger.json({ controller: 'drop-controller', method: 'getDropByAddress' })
  const dropAddress = req.params.drop_address
  const fetcherAddress = req.query.fetch_as
  const drop = await dropService.getDrop({ dropAddress, fetcherAddress })

  res.json({
    success: true,
    drop
  })
}

const getDropClaimer = async (req, res) => {
  logger.json({ controller: 'drop-controller', method: 'getDropClaimer' })
  const dropAddress = req.params.drop_address
  const claimerAddress = req.params.claimer_address

  const {
    account_address,
    claimed,
    tx_hash
  } = await claimerService.getClaimer({ dropAddress, claimerAddress })

  res.json({
    success: true,
    account_address,
    claimed,
    tx_hash
  })
}

module.exports = {
  getAllDrops,
  getDropClaimer,
  getDropByAddress
}
