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
          console.log('cannt update data')
        })
    )
  }
})

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
