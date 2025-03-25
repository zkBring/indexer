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
  },
  '/drops/:drop_address/claimer/:claimer_address': {
    get: {
      controller: 'drop-controller',
      method: 'getDropClaimer'
    }
  }
}

module.exports = routes
