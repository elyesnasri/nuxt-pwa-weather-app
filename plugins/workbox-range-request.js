const precacheCacheName = workbox.core.cacheNames.precache
console.log('[Workbox]: ' + precacheCacheName)

workbox.routing.registerRoute(
  new RegExp('^https://api.openweathermap.org/data/2.5/weather'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        // Keep at most 30 entries.
        maxEntries: 30,
        // Don't keep any entries for more than 1 day.
        maxAgeSeconds: 24 * 60 * 60,
        // Automatically cleanup if quota is exceeded.
        purgeOnQuotaError: true
      })
    ]
  })
)
