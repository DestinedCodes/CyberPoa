{% load static %}
const CACHE_NAME = 'meneja360-pwa-v2';
const APP_SHELL = [
    '{% static "manifest.webmanifest" %}',
    '{% static "css/style.css" %}',
    '{% static "js/pwa.js" %}',
    '{% static "img/cyberpoa-logo.svg" %}',
    '{% static "img/icons/icon-180.png" %}',
    '{% static "img/icons/icon-192.png" %}',
    '{% static "img/icons/icon-512.png" %}',
    '{% static "offline.html" %}'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames
                .filter((cacheName) => cacheName !== CACHE_NAME)
                .map((cacheName) => caches.delete(cacheName))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(() => caches.match('{% static "offline.html" %}'))
        );
        return;
    }

    event.respondWith(
        caches.match(request).then((cachedResponse) => (
            cachedResponse || fetch(request).then((networkResponse) => {
                const shouldCache = request.url.includes('/static/');
                if (shouldCache && networkResponse.ok) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
                }
                return networkResponse;
            })
        ))
    );
});
