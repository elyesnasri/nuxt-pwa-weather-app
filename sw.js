importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn@4.3.1/workbox/workbox-sw.js', 'custom-sw.js')

// --------------------------------------------------
// Configure
// --------------------------------------------------

// Set workbox config
workbox.setConfig({
  "debug": false
})

// Start controlling any existing clients as soon as it activates
workbox.core.clientsClaim()

// Skip over the SW waiting lifecycle stage
workbox.core.skipWaiting()

workbox.precaching.cleanupOutdatedCaches()

// --------------------------------------------------
// Precaches
// --------------------------------------------------

// Precache assets

// -- Start of cachingExtensions --
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
// -- End of cachingExtensions --

// --------------------------------------------------
// Runtime Caching
// --------------------------------------------------

// Register route handlers for runtimeCaching
workbox.routing.registerRoute(new RegExp('/_nuxt/'), new workbox.strategies.CacheFirst ({}), 'GET')
workbox.routing.registerRoute(new RegExp('/'), new workbox.strategies.NetworkFirst ({}), 'GET')
