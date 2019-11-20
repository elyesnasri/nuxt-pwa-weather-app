console.log('Custom Service worker!')

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'weather-sync') {
    // See the "Think before you sync" section for
    // checks you could perform before syncing.
    event.waitUntil(syncContent())
  }
  // Other logic for different tags as needed.
})

function syncContent() {
  let a = 10
  console.log('updating in background')
}
