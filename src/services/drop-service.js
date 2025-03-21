const { Drop } = require('../models')

class DropService {
  async findByAddress (dropAddress) {
    return await Drop.findOne({ 
      where: { drop_address: dropAddress.toLowerCase() } 
    })
  }

  async getAllActiveDrops (offset, limit) {
    offset = Number(offset) || 0
    limit = Number(limit) || 10

    const drops = await Drop.findAll({ 
      where: { status: 'active' },
      order: [['created_at', 'DESC']],
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
