const precacheCacheName = workbox.core.cacheNames.precache
console.log('[Workbox]: ' + precacheCacheName)

workbox.routing.registerRoute(
  new RegExp('^https://api.openweathermap.org/data/2.5/weather'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
)
