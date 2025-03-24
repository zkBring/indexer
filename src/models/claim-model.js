const { DataTypes, Model } = require('sequelize')
const sequelize = require('./db')

class Claim extends Model {}
Claim.init(
  {
    id: {
      type: DataTypes.STRING,
    },
    drop_address: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    recipient_address: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    claim_tx_hash: {
      type: DataTypes.STRING,
    },
    event_timestamp: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'Claim',
    tableName: 'claims',
    schema: 'events',
    timestamps: false
  }
)

module.exports = Claim
