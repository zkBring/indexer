const { Op } = require('sequelize')
const { ethers } = require('ethers')
const stageConfig = require('../../stage-config')
const { Drop, Claim, sequelize } = require('../models')
const logger = require('../utils/logger')

class DropService {
  constructor (ipfsService) {
    this.ipfsService = ipfsService
  }

  async findDropWithClaim (dropAddress, claimerAddress) {
    return await Drop.findOne({
      where: { drop_address: dropAddress, shadowbanned: false },
      include: claimerAddress
        ? [{
            model: Claim,
            required: false,
            attributes: ['recipient_address', 'claim_tx_hash'],
            where: { recipient_address: claimerAddress.toLowerCase() }
          }]
        : []
    })
  }

  async getDrop ({ dropAddress, fetcherAddress }) {
    let drop = await this.findDropWithClaim(dropAddress, fetcherAddress)
    if (!drop) return null

    drop = drop.toJSON()
    const claimsCount = await Claim.count({
      where: { drop_address: dropAddress }
    })
    drop.claims_count = claimsCount

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
    staked,
    status,
    creatorAddress
  }) {
    offset = Number(offset) || 0
    limit = Number(limit) || 10

    const whereCondition = this
      ._buildWhereCondition({ status, creatorAddress, staked })

    const total = await Drop.count({
      where: whereCondition
    })

    const drops = await Drop.findAll({
      where: whereCondition,
      attributes: {
        include: [
          [
            sequelize.fn('COUNT',
              sequelize.where(
                sequelize.col('Claims.drop_address'),
                '=',
                sequelize.col('Drop.drop_address')
              )
            ),
            'claims_count'
          ]
        ]
      },
      include: [
        {
          model: Claim,
          attributes: [],
          required: false,
          on: sequelize.where(
            sequelize.col('Claims.drop_address'),
            '=',
            sequelize.col('Drop.drop_address')
          )
        }
      ],
      group: ['Drop.drop_address'],
      order: [['block_timestamp', 'DESC']],
      subQuery: false,
      offset,
      limit
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

  _buildWhereCondition ({ status, creatorAddress, staked }) {
    const whereCondition = { shadowbanned: false }

    if (status) whereCondition.status = status
    if (creatorAddress) whereCondition.creator_address = creatorAddress.toLowerCase()
    if (staked) {
      const minimumStakedInWei = ethers.parseUnits(
        stageConfig.MINIMUM_STAKED_BRING, 18).toString()
      whereCondition.total_staked = { [Op.gte]: minimumStakedInWei }
    }

    return whereCondition
  }

  async updateDrop ({
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

  async updateStatus ({ dropAddress, status }) {
    return await this.updateDrop({ dropAddress, status })
  }

  async updateTotalStaked ({ dropAddress, totalStaked }) {
    return await this.updateDrop({ dropAddress, totalStaked })
  }

  async updateTitleAndDescription ({ dropAddress, metadataIpfsHash }) {
    const {
      title,
      description
    } = await this.ipfsService.getDropTitleAndDescription(metadataIpfsHash)
    return await this.updateDrop({ dropAddress, title, description })
  }

  async updateDropStatusOnMaxClaimsReached ({ dropAddress }) {
    const drop = await Drop.findOne({
      where: { drop_address: dropAddress.toLowerCase() },
      attributes: ['drop_address', 'max_claims', 'status']
    })

    if (!drop) {
      logger.warn(`Drop not found for address: ${dropAddress}`)
      return
    }

    const currentClaimsCount = await Claim.count({
      where: { drop_address: dropAddress.toLowerCase() }
    })

    if (currentClaimsCount >= drop.max_claims) {
      await this.updateStatus({
        dropAddress: dropAddress.toLowerCase(),
        status: 'finished'
      })
      logger.info(`Drop ${dropAddress} marked as finished. Claims: ${currentClaimsCount}/${drop.max_claims}`)
    }
  }
}

module.exports = DropService
