console.log('Custom Service worker!')

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'weather-sync') {
    event.waitUntil(
      syncContent()
        .then(function() {
          var title = 'Weather Update'
          var options = {
            body: 'Weather data are up to date',
            vibrate: [200, 100, 200]
          }
          self.registration.showNotification(title, options)
        })
        .catch((err) => {
          console.log('cannot update data')
        })
    )
  }
})

async function syncContent() {
  //get cached urls
  const apiCache = await self.caches.open('api-cache')
  let urls = await apiCache.keys()

  // make new request so that workbox will update the cached data
  urls.forEach((elem) => {
    updateCache(elem.url)
    console.log(elem.url)
  })
}

async function updateCache(url) {
  const strategy = new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache'
  })
  const response = await strategy.makeRequest({
    request: url
  })
}
