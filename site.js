/* Bump — marketing site.
   Two jobs only: a nav that reacts to scroll, and reveal-on-scroll. */

(function () {
  'use strict';

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');

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
