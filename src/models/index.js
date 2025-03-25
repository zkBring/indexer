const Drop = require('./drop-model')
const Claim = require('./claim-model')
const sequelize = require('./db')

Drop.hasMany(Claim, {
  foreignKey: 'drop_address',
  sourceKey: 'drop_address'
})

Claim.belongsTo(Drop, {
  foreignKey: 'drop_address',
  targetKey: 'drop_address'
})

module.exports = {
  Drop,
  Claim,
  sequelize
}
