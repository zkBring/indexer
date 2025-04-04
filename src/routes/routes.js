const routes = {
  '/drops': {
    get: {
      controller: 'drop-controller',
      method: 'getAllDrops',
      celebrateSchema: 'getAllDrops'
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
  '/webhooks/drop-stop': {
    post: {
      controller: 'webhook-controller',
      method: 'handleDropStopWebhook'
    }
  },
  '/webhooks/total-staked': {
    post: {
      controller: 'webhook-controller',
      method: 'handleTotalStakedWebhook'
    }
  },
  '/webhooks/metadata-update': {
    post: {
      controller: 'webhook-controller',
      method: 'handleMetadataUpdateWebhook'
    }
  }
}

module.exports = routes
