const { Claim } = require('../models')

class ClaimerService {
  async findByAddress (dropAddress, claimerAddress) {
    return await Claim.findOne({
      where: {
        drop_address: dropAddress.toLowerCase(),
        recipient_address: claimerAddress.toLowerCase()
      }
    })
  }

  async getClaimer ({ dropAddress, claimerAddress }) {
    const claim = await this.findByAddress(dropAddress, claimerAddress)
    const result = {}
    if (!claim) {
      result.account_address = claimerAddress.toLowerCase()
      result.claimed = false
      result.tx_hash = null
    } else {
      result.account_address = claim.recipient_address
      result.claimed = true
      result.tx_hash = claim.tx_hash
    }

    return result
  }
}

module.exports = ClaimerService
