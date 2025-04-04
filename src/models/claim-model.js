const { DataTypes, Model } = require('sequelize')
const sequelize = require('./db')

class Claim extends Model {}
Claim.init(
  {
    id: {
      type: DataTypes.TEXT,
    },
    drop_address: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    recipient_address: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    u_hash: {
      type: DataTypes.TEXT,
    },
    tx_hash: {
      type: DataTypes.TEXT,
    },
    block_timestamp: {
      type: DataTypes.DECIMAL,
    },
  },
  {
    sequelize,
    modelName: 'Claim',
    tableName: 'claims',
    schema: 'events',
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ['id'] }
    }
  }
)

module.exports = Claim
