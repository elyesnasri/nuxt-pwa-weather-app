console.log('Custom Service worker!')

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'weather-sync') {
    event.waitUntil(
      syncContent()
        .then(function() {
          var title = 'Weather Update'
          var options = {
            body: 'Weather data are up to date (PBS)',
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

self.addEventListener('push', function(event) {
  // console.log('[Service Worker] Push Received.')
  // console.log(`[Service Worker] Push had this data: "${event.data.text()}"`)

  const title = 'Weather Updated'
  const options = {
    body: 'Weather data are up to date (Push)',
    tag: 'confirm-notification',
    renotify: true,
    actions: [
      { action: 'confirm', title: 'Okay' },
      { action: 'cancel', title: 'Cancel' }
    ]
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.')
  var notification = event.notification
  var action = notification.action

  console.log(notification)

  if (action === 'confirm') {
    console.log('confirmed')
    notification.close()
  } else {
    console.log(action)
  }

  // event.waitUntil(clients.openWindow('https://developers.google.com/web/'))
})
