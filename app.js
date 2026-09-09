/* Bump — prototype interactions.
   Kept deliberately small: no framework, no build step. */

(function () {
  'use strict';

  var phone   = document.querySelector('.phone--live');
  var screens = Array.prototype.slice.call(phone.querySelectorAll('[data-screen]'));
  var jumps   = Array.prototype.slice.call(document.querySelectorAll('.jump__btn'));

  /* ---------- screen routing ---------- */

  var current = '1';

  function show(id) {
    // going deeper enters from the right, coming back from the left
    var back = Number(id) < Number(current);
    current = id;

    screens.forEach(function (s) {
      var on = s.dataset.screen === id;
      s.hidden = !on;
      s.classList.toggle('is-active', on);
      if (on) {
        // restart the entrance so the transition reads on every visit
        s.classList.remove('enters', 'enters--fwd', 'enters--back');
        void s.offsetWidth;
        s.classList.add('enters', back ? 'enters--back' : 'enters--fwd');
      }
    });
    moveIndicator();
    jumps.forEach(function (b) { b.classList.toggle('is-on', b.dataset.goto === id); });
  }

  document.addEventListener('click', function (e) {
    var target = e.target.closest('[data-goto]');
    if (target) { show(target.dataset.goto); }
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

      levelOut.textContent = choice.dataset.level;
      noteOut.textContent  = choice.dataset.note;
      chip.textContent     = choice.dataset.level;
    });
  });

  /* ---------- generic pressed-state toggles ---------- */

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

  /* ---------- screen 3: save a spot ---------- */

  var saveBtn = document.querySelector('[data-confirm]');
  var saved   = document.querySelector('[data-confirmed]');

  saveBtn.addEventListener('click', function () {
    saveBtn.textContent = 'Spot saved';
    saveBtn.classList.add('btn--done');
    saved.hidden = false;
  });

  /* ---------- static gallery ---------- */
  /* Clone each screen into its own phone frame so all four can be
     seen and screenshotted at once, without duplicating the markup. */

  document.querySelectorAll('.shot').forEach(function (shot) {
    var source = phone.querySelector('[data-screen="' + shot.dataset.shot + '"]');
    var frame  = document.createElement('div');
    frame.className = 'phone phone--still';
    frame.setAttribute('aria-hidden', 'true');
    frame.innerHTML = phone.querySelector('.statusbar').outerHTML;

    var body = source.cloneNode(true);
    body.hidden = false;
    body.classList.add('is-active');
    body.removeAttribute('data-screen');
    // the gallery is a still life: drop the hooks so live selectors stay unique
    body.querySelectorAll('[data-goto], [data-confirm], [data-verdict-level], [data-verdict-note], [data-level-chip], [data-confirmed]')
      .forEach(function (el) {
        ['data-goto', 'data-confirm', 'data-verdict-level',
         'data-verdict-note', 'data-level-chip', 'data-confirmed']
          .forEach(function (a) { el.removeAttribute(a); });
      });
    body.querySelectorAll('button').forEach(function (b) { b.tabIndex = -1; });
    frame.appendChild(body);

    shot.insertBefore(frame, shot.firstChild);
  });

  /* ---------- jump nav: one pill that slides ---------- */

  var jumpBar = document.querySelector('.jump');
  var indicator = null;

  if (jumpBar && jumps.length) {
    indicator = document.createElement('span');
    indicator.className = 'jump__ind';
    indicator.setAttribute('aria-hidden', 'true');
    jumpBar.insertBefore(indicator, jumpBar.firstChild);
  }

  function moveIndicator() {
    if (!indicator) { return; }
    var on = jumps.filter(function (b) { return b.classList.contains('is-on'); })[0];
    if (!on) { return; }
    indicator.style.width = on.offsetWidth + 'px';
    indicator.style.transform = 'translate3d(' + on.offsetLeft + 'px,' + on.offsetTop + 'px,0)';
  }

  // the pill must not animate into place from 0 on first paint
  function placeIndicator() {
    if (!indicator) { return; }
    var keep = indicator.style.transition;
    indicator.style.transition = 'none';
    moveIndicator();
    void indicator.offsetWidth;
    indicator.style.transition = keep;
  }

  window.addEventListener('resize', placeIndicator);

  /* ---------- reveal on scroll ---------- */
  /* Applied from JS so that with scripting off every section stays visible. */

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');

  if ('IntersectionObserver' in window && !calm.matches) {
    var targets = document.querySelectorAll('.lab__intro, .stage__intro, .shot, .colophon');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    targets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  show('1');
  placeIndicator();
  // fonts land late and change button widths, so re-measure once they do
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(placeIndicator); }
})();
