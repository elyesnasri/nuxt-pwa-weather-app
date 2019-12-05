const precacheCacheName = workbox.core.cacheNames.precache
console.log('[Workbox]: ' + precacheCacheName)

workbox.routing.registerRoute(
  new RegExp('^https://api.openweathermap.org/.*'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        // Keep at most 30 entries.
        maxEntries: 30,
        // Automatically cleanup if quota is exceeded.
        purgeOnQuotaError: true
      })
      // new workbox.broadcastUpdate.Plugin({
      //   channelName: 'api-updates'
      // })
    ]
  })
)

// const updatesChannel = new BroadcastChannel('api-updates')
// updatesChannel.addEventListener('message', async (event) => {
//   const { cacheName, updatedUrl } = event.data.payload

// Do something with cacheName and updatedUrl.
// For example, get the cached content and update
// the content on the page.
// const cache = await caches.open(cacheName)
// const updatedResponse = await cache.match(updatedUrl)
// const updatedText = await updatedResponse.text()
// console.log(updatedResponse)
// console.log(updatedText)

//   console.log('data are updated in backround!')
// })
