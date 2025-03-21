const routes = {
  '/drops': {
    get: {
      controller: 'drop-controller',
      method: 'getAllDrops'
    }
  },
  '/drops/:drop_address': {
    get: {
      controller: 'drop-controller',
      method: 'getDropByAddress'
    }
  }
}

module.exports = routes
