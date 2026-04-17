/**
 * ═══════════════════════════════════════════════
 * Vegas Kit — Service Worker
 * Stratégie : Cache First, Network Fallback
 * ═══════════════════════════════════════════════
 *
 * Au premier chargement, l'app est mise en cache.
 * Ensuite, l'app fonctionne entièrement offline.
 * Les mises à jour sont détectées automatiquement
 * (le SW vérifie le hash du HTML à chaque visite).
 */

const CACHE_NAME = 'vegas-kit-v1.0.4';

// Liste des fichiers à mettre en cache (pré-cache au install)
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg',
  './vegas-logo-light.png',
  './vegas-logo-dark.png',
  // Polices Google Fonts (mises en cache au premier chargement)
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Nunito:wght@300;400;600;700&display=swap'
];

// ─── INSTALL ──────────────────────────────────
// Pré-cache des fichiers essentiels
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ─── ACTIVATE ─────────────────────────────────
// Nettoyer les anciens caches quand une nouvelle version est déployée
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// ─── FETCH ────────────────────────────────────
// Stratégie : Cache First avec fallback réseau
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non GET
  if (event.request.method !== 'GET') return;

  // Ignorer les requêtes vers d'autres origines (sauf Google Fonts)
  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isGoogleFonts = url.hostname.includes('fonts.googleapis.com')
                    || url.hostname.includes('fonts.gstatic.com');

  if (!isSameOrigin && !isGoogleFonts) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si trouvé dans le cache, le servir immédiatement
      if (cachedResponse) {
        // En arrière-plan, mettre à jour le cache (stale-while-revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => { /* offline = pas de mise à jour, normal */ });
        return cachedResponse;
      }

      // Pas en cache : aller chercher sur le réseau et mettre en cache
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Offline et pas en cache : renvoyer la page d'index si HTML
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// ─── MESSAGE ──────────────────────────────────
// Permet à l'app de demander un skipWaiting (mise à jour immédiate)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
