const { DataTypes, Model } = require('sequelize')
const sequelize = require('./db')

class Drop extends Model {}
Drop.init(
  {
    id: {
      type: DataTypes.STRING,
    },
    drop_address: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    factory_address: {
      type: DataTypes.STRING,
    },
    token_address: {
      type: DataTypes.STRING,
    },
    creator_address: {
      type: DataTypes.STRING,
    },
    zk_pass_schema_id: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.STRING,
    },
    expiration: {
      type: DataTypes.INTEGER,
    },
    max_claims: {
      type: DataTypes.INTEGER,
    },
    metadata_ipfs_hash: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    block_timestamp: {
      type: DataTypes.DATE,
    }
  },
  {
    sequelize,
    modelName: 'Drop',
    tableName: 'drops',
    schema: 'events',
    timestamps: false
  }
)

module.exports = Drop
