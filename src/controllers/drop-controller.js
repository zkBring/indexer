const logger = require('../utils/logger')
const dropService = require('../services/drop-service')

const getAllDrops = async (req, res) => {
  logger.json({ controller: 'drop-controller', method: 'getAllDrops' })
  const {
    limit,
    offset
  } = req.query

  const result = await dropService.getAllActiveDrops(offset, limit)

  res.json({
    success: true,
    drops_array: result.drops,
    result_set: result.resultSet
  })
}

const getDropByAddress = async (req, res) => {
  logger.json({ controller: 'drop-controller', method: 'getDropByAddress' })
  const dropAddress = req.params.drop_address
  const drop = await dropService.findByAddress(dropAddress)

  res.json({
    success: true,
    drop
  })
}

module.exports = {
  getAllDrops,
  getDropByAddress
}
