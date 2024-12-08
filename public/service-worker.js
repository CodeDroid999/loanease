self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('loan-app-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/apply',
        '/dashboard',
        '/offline.html',
      ])
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        return caches.match('/offline.html')
      })
    })
  )
})

