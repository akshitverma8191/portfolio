'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "28e09701ce45069151efd86104f0e8b3",
"assets/assets/fonts/Hahmlet-Black.ttf": "1fb371af82f331343509e11156d40972",
"assets/assets/fonts/Hahmlet-Bold.ttf": "ad6d09016a35c6af195439ce7e2daa8d",
"assets/assets/fonts/Hahmlet-ExtraBold.ttf": "a377b49e6689e13880074169fd5be3d4",
"assets/assets/fonts/Hahmlet-ExtraLight.ttf": "9676125c8d58afccbf71b61481f2bfc7",
"assets/assets/fonts/Hahmlet-Light.ttf": "a5e4c71038c23ff9a50ae22f97760eb1",
"assets/assets/fonts/Hahmlet-Medium.ttf": "6402c79d4d92db6bdbee2b32a8d6ff1f",
"assets/assets/fonts/Hahmlet-Regular.ttf": "e35798b2eca6c1ce64b887259a2559a3",
"assets/assets/fonts/Hahmlet-SemiBold.ttf": "7db92537515b0017c63804d6b10e8c76",
"assets/assets/fonts/Hahmlet-Thin.ttf": "8826b3c2039faad0d091d02b5e76a869",
"assets/assets/images/api.png": "b112ebb14d02676d96481bd8e0c601b8",
"assets/assets/images/aws.png": "094e9a4cb4ef0efebb33537c95b39f6a",
"assets/assets/images/coming-soon.png": "2df6306cb6828193ef3df26f68fb4a80",
"assets/assets/images/css.png": "eebc07a0af16650e8058bd576e610104",
"assets/assets/images/devops.png": "7531bc9e9d3b59c35186298ef8b1da9c",
"assets/assets/images/docker.png": "54e225fe3c3995878e29d734838dd26d",
"assets/assets/images/firebase.jpg": "008376e4f824c22b2b477bee05c479af",
"assets/assets/images/flutter.png": "b3e7cb5adc68e7da49d6f8ee22d8108c",
"assets/assets/images/git.png": "9124374e5f56cdcb4d172569c9c39a84",
"assets/assets/images/github.png": "9f874110c00c2f6157f29819205119ba",
"assets/assets/images/html.png": "6e0ec9a8837edc1a4b9883ed74e6cc90",
"assets/assets/images/jenkins.jpg": "9d619df222768cfae0ba90142745760c",
"assets/assets/images/kubernetes.png": "ca77d94d86f76a72c2e70ff0a65303c3",
"assets/assets/images/pic1.png": "48de05e52267c9567866d5008c706543",
"assets/assets/images/pic2.jpg": "30a9ae7fc6aae9ce214872a3bd04384a",
"assets/assets/images/pic22.png": "5cd538e015244d520ee1c6b13c4b0fca",
"assets/assets/images/python.png": "40c6e50185252561eaccc7efc7b80d8b",
"assets/assets/images/redhat.png": "2faa45450afb743affd6d5c5028a8644",
"assets/assets/images/sql.jpg": "70ba086b6bd194f4f762e9df51c1fe8e",
"assets/assets/images/tkinter.png": "9bfc5f8f8591463e921a704f0c6e177f",
"assets/assets/images/ubuntu.png": "39ebfff7c140ab84c9098d0307acfa61",
"assets/assets/images/virtualbox.jpg": "c8e1a461c54e2d436ae3ec800da20c20",
"assets/FontManifest.json": "7badb973f097277e1c74c78830c41e00",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "0b7054b0ab7c965ff9c6f0d24a96afa2",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/ionicons/fonts/Ionicons.ttf": "0cdf2a324d5c21f08c7f446476aa2ee3",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "715243df4ef055d8d9da9d85e1491f70",
"/": "715243df4ef055d8d9da9d85e1491f70",
"main.dart.js": "0d14423c6a4be9409f307f312f48d806",
"manifest.json": "a56a87a87866a30feadf00702f95fb21",
"version.json": "e774ecf8bf8e93bc5ab9d64a8b0a7b06"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
