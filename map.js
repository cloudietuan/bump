/* Bump — maps.
   Leaflet is loaded from a CDN and may not arrive. Every entry point checks for
   it and leaves the static fallback in place if it is missing, so a failed map
   degrades to an address and a directions link rather than an empty box. */

(function () {
  'use strict';

  var VENUES = {
  "kenney": {
    "name": "James Kenney Rec Center",
    "addr": "1720 Eighth St, Berkeley, CA 94710",
    "lat": 37.87355,
    "lng": -122.2994,
    "dist": "0.8 mi",
    "game": "Open play, no experience needed",
    "when": "Tue 7:00p",
    "spots": "7 spots",
    "tone": "good",
    "new": "4 of 11 new",
    "go": "https://www.google.com/maps/dir/?api=1&destination=1720%20Eighth%20St%2C%20Berkeley%2C%20CA%2094710"
  },
  "albany": {
    "name": "Albany Community Center",
    "addr": "1249 Marin Ave, Albany, CA 94706",
    "lat": 37.88862,
    "lng": -122.2977,
    "dist": "2.1 mi",
    "game": "Learn to pass, then scrimmage",
    "when": "Wed 8:00p",
    "spots": "3 spots",
    "tone": "good",
    "new": "First session free",
    "go": "https://www.google.com/maps/dir/?api=1&destination=1249%20Marin%20Ave%2C%20Albany%2C%20CA%2094706"
  },
  "ymca": {
    "name": "Berkeley YMCA",
    "addr": "2001 Allston Way, Berkeley, CA 94704",
    "lat": 37.86862,
    "lng": -122.268,
    "dist": "1.4 mi",
    "game": "6v6 competitive",
    "when": "Thu 7:30p",
    "spots": "Full",
    "tone": "warn",
    "new": "Above your level",
    "go": "https://www.google.com/maps/dir/?api=1&destination=2001%20Allston%20Way%2C%20Berkeley%2C%20CA%2094704"
  },
  "ohlone": {
    "name": "Ohlone Park",
    "addr": "Hearst Ave & Sacramento St, Berkeley, CA 94702",
    "lat": 37.8736,
    "lng": -122.283,
    "dist": "1.0 mi",
    "game": "Saturday open play",
    "when": "Sat 10:00a",
    "spots": "12 spots",
    "tone": "good",
    "new": "Hosting here",
    "go": "https://www.google.com/maps/dir/?api=1&destination=Hearst%20Ave%20%26%20Sacramento%20St%2C%20Berkeley%2C%20CA%2094702"
  }
};

  window.BumpMap = { venues: VENUES, maps: {} };

  /* OpenStreetMap's own tiles: genuinely keyless. CARTO's basemaps look better
     but now stamp "API KEY REQUIRED" across every tile, which is worse than a
     plainer map. These are muted to the palette with a CSS filter instead. */
  var TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  var ATTRIB = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  function ready() { return typeof window.L !== 'undefined'; }

  function pin(cls) {
    return L.divIcon({
      className: 'leaflet-div-icon',
      html: '<span class="pin ' + (cls || '') + '"></span>',
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -24]
    });
  }

  function popup(v) {
    return '<span class="pop__when num">' + v.when + '</span>' +
           '<b class="pop__title">' + v.game + '</b>' +
           '<span class="pop__where">' + v.name + ' &middot; ' + v.dist + '</span>' +
           '<span class="pop__meta' + (v.tone === 'warn' ? ' pop__meta--warn' : '') + '">' + v.new + ' &middot; ' + v.spots + '</span>' +
           '<a class="pop__go" href="' + v.go + '" target="_blank" rel="noopener noreferrer">Directions &rarr;</a>';
  }

  function base(el, opts) {
    var map = L.map(el, {
      zoomControl: opts.zoom !== false,
      scrollWheelZoom: false,      // never hijack the page scroll
      attributionControl: true
    });
    L.tileLayer(TILES, { attribution: ATTRIB, maxZoom: 19 }).addTo(map);
    el.parentNode.classList.add('is-live');
    return map;
  }

  /* ---------- all games ---------- */

  window.BumpMap.overview = function (el, onPick) {
    if (!ready() || !el || el._built) { return null; }
    el._built = true;
    var map = base(el, {});
    var pts = [];

    Object.keys(VENUES).forEach(function (k) {
      if (k === 'ohlone') { return; }        // that one is the host's own court
      var v = VENUES[k];
      var m = L.marker([v.lat, v.lng], { icon: pin(v.tone === 'warn' ? 'pin--warn' : '') }).addTo(map);
      m.bindPopup(popup(v));
      if (onPick) { m.on('click', function () { onPick(k, v); }); }
      pts.push([v.lat, v.lng]);
    });

    map.fitBounds(pts, { padding: [38, 38] });
    window.BumpMap.maps.overview = map;
    return map;
  };

  /* ---------- one venue ---------- */

  window.BumpMap.venue = function (el, key) {
    if (!ready() || !el || el._built) { return null; }
    el._built = true;
    var v = VENUES[key];
    if (!v) { return null; }
    var map = base(el, { zoom: false });
    map.setView([v.lat, v.lng], 15);
    map.dragging.disable();
    map.doubleClickZoom.disable();
    L.marker([v.lat, v.lng], { icon: pin() }).addTo(map);
    window.BumpMap.maps[key] = map;
    return map;
  };

  /* ---------- host: drop a pin ---------- */

  window.BumpMap.picker = function (el, onMove) {
    if (!ready() || !el || el._built) { return null; }
    el._built = true;
    var v = VENUES.ohlone;
    var map = base(el, {});
    map.setView([v.lat, v.lng], 15);
    var m = L.marker([v.lat, v.lng], { icon: pin('pin--drop'), draggable: true }).addTo(map);

    function moved(latlng) { if (onMove) { onMove(latlng.lat, latlng.lng); } }
    m.on('dragend', function () { moved(m.getLatLng()); });
    map.on('click', function (e) { m.setLatLng(e.latlng); moved(e.latlng); });

    window.BumpMap.maps.picker = map;
    return map;
  };

  /* A map built inside a hidden element measures itself as zero and renders a
     grey void. Anything that reveals a map must call this afterwards. */
  window.BumpMap.refresh = function (name) {
    var m = window.BumpMap.maps[name];
    if (m) { window.setTimeout(function () { m.invalidateSize(); }, 30); }
  };
})();
