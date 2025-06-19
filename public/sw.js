const CACHE_NAME = "chatlure-v1.0.0";
const STATIC_CACHE = "chatlure-static-v1.0.0";
const DYNAMIC_CACHE = "chatlure-dynamic-v1.0.0";

// Assets to cache for offline functionality
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/src/main.tsx",
  "/src/App.tsx",
  "/src/index.css",
  "/src/App.css",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => console.log("Service Worker: Cache failed", err)),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("Service Worker: Claiming clients");
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Clone the request for dynamic caching
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          // Check if valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response for caching
          const responseToCache = response.clone();

          // Cache dynamic content
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Offline fallback
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    }),
  );
});

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync", event.tag);

  if (event.tag === "background-sync") {
    event.waitUntil(
      // Handle background sync tasks
      Promise.resolve(),
    );
  }
});

// Push notifications
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received");

  const options = {
    body: event.data ? event.data.text() : "New story update available!",
    icon: "https://cdn.builder.io/api/v1/assets/9af82e6ddd6549809662cfc01aa22662/favico-c760c4?format=webp&width=192",
    badge:
      "https://cdn.builder.io/api/v1/assets/9af82e6ddd6549809662cfc01aa22662/favico-c760c4?format=webp&width=96",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Read Now",
        icon: "https://cdn.builder.io/api/v1/assets/9af82e6ddd6549809662cfc01aa22662/favico-c760c4?format=webp&width=96",
      },
      {
        action: "close",
        title: "Close",
        icon: "https://cdn.builder.io/api/v1/assets/9af82e6ddd6549809662cfc01aa22662/favico-c760c4?format=webp&width=96",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("ChatLure", options));
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked");

  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});
