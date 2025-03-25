const { Drop, Claim } = require('../models')

class DropService {
  async findDropWithClaim (dropAddress, claimerAddress) {
    return await Drop.findOne({
      where: { drop_address: dropAddress },
      include: claimerAddress ? [{
        model: Claim,
        required: false,
        attributes: ['recipient_address', 'claim_tx_hash'],
        where: { recipient_address: claimerAddress.toLowerCase() }
      }] : []
    })
  }

  async getDrop ({ dropAddress, fetcherAddress }) {
    let drop = await this.findDropWithClaim(dropAddress, fetcherAddress)
    if (!drop) return null

    drop = drop.toJSON()
    if (fetcherAddress) {      
      if (drop.Claims && drop.Claims.length > 0) {
        const claim = drop.Claims[0]
        drop.fetcher_data = {
          account_address: claim.recipient_address,
          claimed: true,
          claim_tx_hash: claim.claim_tx_hash
        }
      } else {
        drop.fetcher_data = {
          account_address: fetcherAddress.toLowerCase(),
          claimed: false,
          claim_tx_hash: null
        }
      }
      delete drop.Claims
    }

    return drop
  }

  async getAllActiveDrops (offset, limit) {
    offset = Number(offset) || 0
    limit = Number(limit) || 10

    const drops = await Drop.findAll({ 
      where: { status: 'active' },
      order: [['block_timestamp', 'DESC']],
      offset,
      limit
    })

    const total = await Drop.count({ 
      where: { status: 'active' } 
    })
    
    return {
      drops,
      resultSet: {
        offset,
        total,
        count: drops.length
      }
    }
  }
}

module.exports = new DropService()
