/*
 * UniMathe /go – leitet in normalen Browsern direkt in den passenden Store weiter
 * zeigt in Instagram eine kompakte Seite mit App-Store-Button und in TikTok & Co. eine Anleitung.
 *
 * Store-Links: /assets/js/store-config.js · Erkennung: /assets/js/go-detect.js
 * Erkennung des In-App-Browsers ist Best Effort (User-Agent). Mit /go?help=1
 * wird immer die Anleitung angezeigt und nie automatisch weitergeleitet.
 */
(function () {
  'use strict';

  var stores = window.UNIMATHE_STORES || {};
  // Erkennung passiert bereits im <head> (go-detect.js), damit nichts aufblitzt.
  var go = window.UNIMATHE_GO || { view: 'default', platform: 'desktop', storeUrl: stores.ios };
  var platform = go.platform;
  var storeUrl = go.storeUrl;

  // --- Links & Texte aus der Konfiguration setzen -----------------------------
  document.querySelectorAll('[data-store-link]').forEach(function (a) {
    // Schlichter Link ohne target/Handler: genau der Weg, der in Instagram per Tipp den App Store öffnet
    if (storeUrl) a.href = storeUrl;
  });
  document.querySelectorAll('[data-search-term]').forEach(function (el) {
    el.textContent = stores.searchTerm || 'UniMathe';
  });
  if (platform === 'android' && stores.android) {
    // Texte für Android anpassen, sobald ein Play-Store-Link hinterlegt ist
    replaceText('Suche im App Store nach', 'Suche im Play Store nach');
    replaceText('Trotzdem direkt zum App Store', 'Trotzdem direkt zum Play Store');
    replaceText('Der App Store öffnet sich', 'Der Play Store öffnet sich');
    replaceText('Im App Store laden', 'Bei Google Play laden');
    replaceText('Im App Store öffnen', 'Bei Google Play öffnen');
    document.querySelectorAll('.go-mark').forEach(function (el) {
      if (el.textContent === 'App Store …') el.textContent = 'Play Store …';
    });
  }

  // --- Ansicht anzeigen ---------------------------------------------------
  var view = go.view;
  show(view);

  if (view === 'redirect') {
    // replace() statt href: der Zurück-Button führt nicht wieder auf /go
    location.replace(storeUrl);
  }

  // --- Link kopieren ----------------------------------------------------------
  var copyBtn = document.querySelector('[data-copy]');
  var copyLabel = document.querySelector('[data-copy-label]');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var link = location.origin + '/go';
      var done = function () {
        if (copyLabel) copyLabel.textContent = 'Link kopiert – jetzt in Safari einfügen';
        setTimeout(function () { if (copyLabel) copyLabel.textContent = 'Link kopieren'; }, 3500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).then(done, function () { legacyCopy(link) && done(); });
      } else if (legacyCopy(link)) {
        done();
      } else if (copyLabel) {
        copyLabel.textContent = link;
      }
    });
  }

  function show(name) {
    document.querySelectorAll('.go-card[data-view]').forEach(function (el) {
      el.hidden = el.getAttribute('data-view') !== name;
    });
    document.documentElement.setAttribute('data-go-view', name);
  }

  function replaceText(from, to) {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.indexOf(from) !== -1) node.nodeValue = node.nodeValue.replace(from, to);
    }
  }

  function legacyCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }
})();
