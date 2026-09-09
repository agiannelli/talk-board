/* Talk Board service worker — offline-first for the app shell.
   Bump CACHE when you change any precached file so clients update. */
"use strict";

var CACHE = "talk-board-v4";

// Relative to the service worker's scope, so this works under any
// GitHub Pages subpath (e.g. /talk-board/).
var SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE).then(function(cache){
      // Cache each file on its own so one missing asset (e.g. an icon not
      // uploaded yet) can't fail the whole install and break offline mode.
      return Promise.all(SHELL.map(function(url){
        return cache.add(url).catch(function(){ /* ignore individual misses */ });
      }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k !== CACHE) return caches.delete(k);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(event){
  var req = event.request;
  if(req.method !== "GET") return;

  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;

  // App shell (same-origin): cache-first, fall back to network, and for
  // navigations fall back to the cached index so the app opens offline.
  if(sameOrigin){
    event.respondWith(
      caches.match(req).then(function(cached){
        if(cached) return cached;
        return fetch(req).then(function(resp){
          if(resp && resp.ok){
            var copy = resp.clone();
            caches.open(CACHE).then(function(c){ c.put(req, copy); });
          }
          return resp;
        }).catch(function(){
          if(req.mode === "navigate") return caches.match("./index.html");
          return Response.error();
        });
      })
    );
    return;
  }

  // Cross-origin (Google Fonts, etc.): network-first, cache successful
  // responses so fonts survive going offline after the first load.
  event.respondWith(
    fetch(req).then(function(resp){
      if(resp && (resp.ok || resp.type === "opaque")){
        var copy = resp.clone();
        caches.open(CACHE).then(function(c){ c.put(req, copy); });
      }
      return resp;
    }).catch(function(){
      return caches.match(req);
    })
  );
});
