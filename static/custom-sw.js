console.log('Custom Service worker!')

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'weather-sync') {
    // See the "Think before you sync" section for
    // checks you could perform before syncing.
    event.waitUntil(syncContent())

    var title = 'Weather Update'
    const options = {
      body: 'There is some new weather updates.'
    }
    event.waitUntil(
      // self.registration.showNotification(title, {
      //   body: body
      // })
      // displayNotification()
      self.registration.showNotification(title, options)
    )
  }
  // Other logic for different tags as needed.
})

async function displayNotification() {
  Notification.requestPermission().then(function(result) {
    console.log(result)
    if (result === 'granted') {
      var options = {
        body: 'Weather data are up to date',
        vibrate: [200, 100, 200]
      }
      navigator.serviceWorker.getRegistration().then(function(reg) {
        reg.showNotification('Weather Update', options)
      })
    }
  })
}

async function syncContent() {
  let search = 'Munich'
  let appId = 'd944d4eb280d335ab5214b3dfae879c5'

  console.log('Updating data...')
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&APPID=${appId}`

  const response = await fetch(url)
  const myJson = await response.json()
  console.log(JSON.stringify(myJson))
  //TODO try to get workbox to cach the request

  // send get request for all cached city to update the cache (workbox will update it)
}
