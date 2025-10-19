self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Basic cache for navigation and static assets (optional/minimal)
const CACHE = 'tt-cache-v1';
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res.ok && (req.destination === 'document' || req.destination === 'style' || req.destination === 'script' || req.destination === 'image')) {
          cache.put(req, res.clone());
        }
        return res;
      } catch (e) {
        return cached || fetch(req);
      }
    })
  );
});

// Receive postMessage from page to schedule/show notifications
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};
  if (type === 'SHOW_NOTIFICATION' && payload) {
    const { title, body, tag } = payload;
    self.registration.showNotification(title, { body, tag, icon: '/next.svg', badge: '/vercel.svg' });
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const url = '/today-classes';
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});
