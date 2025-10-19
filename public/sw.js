// public/sw.js

// "push" event fires when a push message is received (even if site is closed)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();

    // Display the notification
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon || "/icon-192x192.png", // optional icon
        data: data.url || "/", // custom data (e.g., redirect URL)
      })
    );
  }
});

// When user clicks the notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // close the popup
  const url = event.notification.data; // get URL from above
  event.waitUntil(clients.openWindow(url)); // open new tab
});
