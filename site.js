/* Bump — marketing site.
   Two jobs only: a nav that reacts to scroll, and reveal-on-scroll. */

(function () {
  'use strict';

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- opening sequence ---------- */
  /* The cover is CSS-timed and clears itself, so this only decides whether to
     play it at all. Seen once, it is skipped for the rest of the session —
     an intro that replays on every internal link stops being an intro. */

  var intro = document.querySelector('[data-intro]');

  if (intro) {
    var seen = false;
    try { seen = sessionStorage.getItem('bump.intro') === '1'; } catch (e) { /* private mode */ }

    if (seen || calm.matches) {
      intro.classList.add('intro--skip');
      document.body.classList.remove('intro-hold');
    } else {
      try { sessionStorage.setItem('bump.intro', '1'); } catch (e) { /* ignore */ }
      // drop the cover from the tree once it has finished, so nothing of it
      // can sit over the page holding a stacking context
      window.setTimeout(function () {
        if (intro.parentNode) { intro.parentNode.removeChild(intro); }
        document.body.classList.remove('intro-hold');
      }, 1900);
    }
  }

  /* ---------- nav gains a border once the page moves ---------- */

  var nav = document.querySelector('[data-topnav]');

  if (nav) {
    var stuck = false;
    var onScroll = function () {
      var should = window.scrollY > 8;
      if (should !== stuck) {
        stuck = should;
        nav.classList.toggle('is-stuck', stuck);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- reveal on scroll ---------- */
  /* Applied from JS, so with scripting off every section stays visible. */

  if ('IntersectionObserver' in window && !calm.matches) {
    var targets = document.querySelectorAll(
      '.hero__copy, .hero__device, .band__head, .pair, .step-card, .card, .ticks, .split__device, .closer .wrap'
    );

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });

    targets.forEach(function (el, i) {
      el.classList.add('reveal');
      // a short stagger inside each row, capped so nothing lags behind a scroll
      el.style.transitionDelay = (Math.min(i % 4, 3) * 60) + 'ms';
      io.observe(el);
    });
  }

  /* ---------- smooth anchor jumps that respect the fixed nav ---------- */

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) { return; }
    var id = link.getAttribute('href').slice(1);
    var dest = id && document.getElementById(id);
    if (!dest) { return; }
    e.preventDefault();
    var top = dest.getBoundingClientRect().top + window.scrollY - 62;
    window.scrollTo({ top: top, behavior: calm.matches ? 'auto' : 'smooth' });
  });
})();
