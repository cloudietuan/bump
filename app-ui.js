/* Bump — standalone app UI.
   Same interaction model as the prototype, but the shell is the whole
   viewport, so routing also drives the app bar and the bottom nav. */

(function () {
  'use strict';

  var root    = document.querySelector('[data-screens]');
  if (!root) { return; }

  var screens = Array.prototype.slice.call(root.querySelectorAll('[data-screen]'));
  var navs    = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var backBtn = document.querySelector('[data-app-back]');
  var titleEl = document.querySelector('[data-app-title]');

  /* Screen 2 and 4 are roots reachable from the bottom bar. 1 and 3 are pushed
     on top of them, so they get a back arrow instead of a nav highlight. */
  var TITLES = {
    '1': 'Find your level',
    '2': null,            // null keeps the wordmark
    '3': 'Game detail',
    '4': 'Host a game'
  };
  /* Only the detail screen is pushed on top of something. Screens 1, 2 and 4
     are tab roots, so they get the wordmark or a plain title, never a back
     arrow — a back arrow on a tab root has nowhere honest to go. */
  var PARENT = { '3': '2' };
  var WORDMARK = titleEl ? titleEl.innerHTML : '';

  var current = '2';

  function show(id) {
    if (!TITLES.hasOwnProperty(id)) { return; }
    var back = Number(id) < Number(current);
    current = id;

    screens.forEach(function (s) {
      var on = s.dataset.screen === id;
      s.hidden = !on;
      s.classList.toggle('is-active', on);
      if (on) {
        s.classList.remove('enters', 'enters--fwd', 'enters--back');
        void s.offsetWidth;
        s.classList.add('enters', back ? 'enters--back' : 'enters--fwd');
      }
    });

    if (titleEl) {
      if (TITLES[id]) { titleEl.textContent = TITLES[id]; }
      else { titleEl.innerHTML = WORDMARK; }
    }
    if (backBtn) { backBtn.hidden = !PARENT[id]; }

    // the detail screen still belongs to the Games tab, so keep it lit
    var navId = PARENT[id] || id;

    navs.forEach(function (b) {
      var on = b.dataset.nav === navId;
      b.classList.toggle('is-on', on);
      if (on) { b.setAttribute('aria-current', 'page'); }
      else { b.removeAttribute('aria-current'); }
    });

    // a new screen always starts at its own top
    if (root.scrollTo) { root.scrollTo({ top: 0, behavior: 'auto' }); }
    else { root.scrollTop = 0; }
  }

  /* ---------- routing ---------- */

  document.addEventListener('click', function (e) {
    var goto = e.target.closest('[data-goto]');
    if (goto) { show(goto.dataset.goto); return; }

    var nav = e.target.closest('[data-nav]');
    if (nav) { show(nav.dataset.nav); return; }

    if (backBtn && e.target.closest('[data-app-back]')) {
      show(PARENT[current] || '2');
    }
  });

  /* ---------- screen 1: level picker ---------- */

  var levelOut = document.querySelector('[data-verdict-level]');
  var noteOut  = document.querySelector('[data-verdict-note]');
  var chip     = document.querySelector('[data-level-chip]');

  document.querySelectorAll('.choice').forEach(function (choice) {
    choice.addEventListener('click', function () {
      document.querySelectorAll('.choice').forEach(function (c) {
        c.classList.remove('is-picked');
        c.setAttribute('aria-checked', 'false');
      });
      choice.classList.add('is-picked');
      choice.setAttribute('aria-checked', 'true');

      if (levelOut) { levelOut.textContent = choice.dataset.level; }
      if (noteOut)  { noteOut.textContent  = choice.dataset.note; }
      if (chip)     { chip.textContent     = choice.dataset.level; }
    });
  });

  /* ---------- pressed-state controls ---------- */

  document.querySelectorAll('.chip:not([data-level-chip]), .toggle').forEach(function (el) {
    el.addEventListener('click', function () {
      var on = el.getAttribute('aria-pressed') === 'true';
      el.setAttribute('aria-pressed', String(!on));
      el.classList.toggle('is-on', !on);
    });
  });

  document.querySelectorAll('.segment').forEach(function (group) {
    group.querySelectorAll('.seg').forEach(function (seg) {
      seg.addEventListener('click', function () {
        group.querySelectorAll('.seg').forEach(function (s) {
          s.classList.remove('is-on');
          s.setAttribute('aria-pressed', 'false');
        });
        seg.classList.add('is-on');
        seg.setAttribute('aria-pressed', 'true');
      });
    });
  });

  /* ---------- save a spot ---------- */

  var saveBtn = document.querySelector('[data-confirm]');
  var saved   = document.querySelector('[data-confirmed]');

  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      saveBtn.textContent = 'Spot saved';
      saveBtn.classList.add('btn--done');
      if (saved) { saved.hidden = false; }
    });
  }

  /* The in-screen tab bar belongs to the prototype's phone mock; in the real
     shell the bottom nav does that job, so it is removed rather than left
     sitting above a second identical control. */
  document.querySelectorAll('.screens .tabs').forEach(function (t) { t.remove(); });

  show('2');
})();
