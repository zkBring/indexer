const { Drop, Claim } = require('../models')

class DropService {
  constructor (ipfsService) {
    this.ipfsService = ipfsService
  }

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

  async getAllActiveDrops ({
    limit,
    offset, 
    creatorAddress
  }) {
    offset = Number(offset) || 0
    limit = Number(limit) || 10

    const whereCondition = { status: 'active' }
    
    if (creatorAddress) {
      whereCondition.creator_address = creatorAddress.toLowerCase()
    }

    const drops = await Drop.findAll({ 
      where: whereCondition,
      order: [['block_timestamp', 'DESC']],
      offset,
      limit
    })

    const total = await Drop.count({ 
      where: whereCondition 
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

  async updateDrop({ 
    title, 
    status, 
    dropAddress, 
    description, 
    totalStaked 
  }) {
    const params = {
      title,
      status,
      description,
      total_staked: totalStaked
    }

    const drop = await Drop.update(params, {
      where: { drop_address: dropAddress.toLowerCase() },
      returning: true
    })

    return drop
  }

  async updateStatus({ dropAddress, status }) {
    return await this.updateDrop({ dropAddress, status })
  }

  async updateTotalStaked({ dropAddress, totalStaked }) {
    return await this.updateDrop({ dropAddress, totalStaked })
  }

  async updateTitleAndDescription({ dropAddress, metadataIpfsHash }) {
    const { 
      title, 
      description 
    } = await this.ipfsService.getDropTitleAndDescription(metadataIpfsHash)
    return await this.updateDrop({ dropAddress, title, description })
  }
}

module.exports = DropService
