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
  },
  '/upload-drop-metadata': {
    post: {
      controller: 'ipfs-controller',
      method: 'uploadDropMetadata',
      celebrateSchema: 'uploadDropMetadata'
    }
  },
  '/get-drop-title-and-description': {
    post: {
      controller: 'ipfs-controller',
      method: 'getDropTitleAndDescription'
    }
  }
}

module.exports = routes
