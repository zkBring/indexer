const { DataTypes, Model } = require('sequelize')
const sequelize = require('./db')

class Drop extends Model {}
Drop.init(
  {
    id: {
      type: DataTypes.TEXT,
    },
    drop_address: {
      type: DataTypes.TEXT,
      primaryKey: true
    },
    factory_address: {
      type: DataTypes.TEXT,
    },
    token_address: {
      type: DataTypes.TEXT,
    },
    creator_address: {
      type: DataTypes.TEXT,
    },
    zk_pass_schema_id: {
      type: DataTypes.TEXT,
    },
    amount: {
      type: DataTypes.DECIMAL,
    },
    expiration: {
      type: DataTypes.DECIMAL,
    },
    max_claims: {
      type: DataTypes.DECIMAL,
    },
    metadata_ipfs_hash: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.TEXT,
    },
    block_timestamp: {
      type: DataTypes.DECIMAL,
    },
    title: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
    },
    total_staked: {
      type: DataTypes.DECIMAL,
    },
    decimals: {
      type: DataTypes.INTEGER,
    },
    symbol: {
      type: DataTypes.STRING,
    },
    shadowbanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'Drop',
    tableName: 'drops',
    schema: 'events',
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ['id', 'shadowbanned'] }
    }
  }
)

module.exports = Drop
