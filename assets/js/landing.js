(function () {
  'use strict';

  // 1) Mobile-Illustrationen auf schmalen Geräten (z. B. iPhone SE, 320–375 px) proportional verkleinern.
  var scenes = Array.prototype.slice.call(document.querySelectorAll('.scene[data-w]'));
  function fitScenes() {
    scenes.forEach(function (el) {
      var w = parseFloat(el.getAttribute('data-w'));
      var avail = el.clientWidth;
      if (!w || !avail) return; // ausgeblendetes Layout
      var s = Math.min(1, avail / w);
      el.style.setProperty('--s', s.toFixed(4));
    });
  }
  fitScenes();
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(fitScenes);
    scenes.forEach(function (el) { ro.observe(el); });
  } else {
    window.addEventListener('resize', fitScenes);
  }

  // 2) Sticky-CTA (Mobile): erscheint, sobald der Hero-Button aus dem Bild ist,
  //    und verschwindet, wenn der Abschluss-Button sichtbar ist.
  var bar = document.querySelector('.sticky-cta');
  var targets = document.querySelectorAll('.cta-observe');
  if (bar && targets.length && 'IntersectionObserver' in window) {
    var visible = new Set();
    var heroPassed = false;
    var hero = targets[0];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
        if (e.target === hero) heroPassed = !e.isIntersecting && e.boundingClientRect.top < 0;
      });
      var show = heroPassed && visible.size === 0;
      bar.classList.toggle('is-visible', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
      if (show) bar.removeAttribute('inert'); else bar.setAttribute('inert', '');
    });
    targets.forEach(function (t) { io.observe(t); });
  }
})();
