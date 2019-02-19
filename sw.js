const CACHE = 'network-or-cache';

const files = [
  './',
  './bundle.css',
  './bundle.js',
  './manifest.webmanifest',
  './icons/android-icon-36x36.png',
  './icons/android-icon-48x48.png',
  './icons/android-icon-72x72.png',
  './icons/android-icon-96x96.png',
  './icons/android-icon-144x144.png',
  './icons/android-icon-192x192.png',
  './icons/apple-icon-57x57.png',
  './icons/apple-icon-60x60.png',
  './icons/apple-icon-72x72.png',
  './icons/apple-icon-76x76.png',
  './icons/apple-icon-114x114.png',
  './icons/apple-icon-120x120.png',
  './icons/apple-icon-144x144.png',
  './icons/apple-icon-152x152.png',
  './icons/apple-icon-180x180.png',
  './icons/apple-icon-precomposed.png',
  './icons/apple-icon.png',
  './icons/favicon-16x16.png',
  './icons/favicon-32x32.png',
  './icons/favicon-96x96.png',
  './icons/favicon-512x512.png',
  './icons/favicon-1600x1600.png',
  './icons/ms-icon-70x70.png',
  './icons/ms-icon-144x144.png',
  './icons/ms-icon-150x150.png',
  './icons/ms-icon-310x310.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

self.addEventListener('install', (evt) => {
  console.log('The service worker is being installed.');
  evt.waitUntil(precache());
});

self.addEventListener('fetch', (evt) => {
  const request = evt.request;
  evt.respondWith((async () => {
    const cache = await caches.open(CACHE);
    {
      const fetchResponse = await fetch(request);
      if (fetchResponse && fetchResponse.status === 200) {
        await addToCache(cache, request, fetchResponse);
        console.log(`Fetched and updated asset: ${request.url}`);
        return fetchResponse;
      }
    }
    {
      const response = await getFromCache(request, cache);
      if (!response)
        throw new Error(`Fetch failed and resource not in cache: ${request.url}`);
      return response;
    }
  })());
});

async function precache() {
  const cache = await caches.open(CACHE);
  return cache.addAll(files);
}

async function getFromCache(request, cache) {
  const url = new URL(request.url);
  const ignoreSearch = (url.hostname === self.location.hostname);
  return cache.match(request, { ignoreSearch });
}

async function addToCache(cache, request, response) {
  const responseToCache = response.clone();
  await cache.put(request, responseToCache);
}