/*
 * UniMathe /go – leitet in normalen Browsern direkt in den passenden Store weiter
 * und zeigt in In-App-Browsern (TikTok & Co.) eine Anleitung.
 *
 * Store-Links: /assets/js/store-config.js
 * Erkennung des In-App-Browsers ist Best Effort (User-Agent). Mit /go?help=1
 * wird immer die Anleitung angezeigt und nie automatisch weitergeleitet.
 */
(function () {
  'use strict';

  var stores = window.UNIMATHE_STORES || {};
  var ua = navigator.userAgent || '';
  var params = new URLSearchParams(location.search);
  var helpMode = params.get('help') === '1';

  // --- Erkennung ------------------------------------------------------------
  // TikTok (iOS: "musical_ly_…", "BytedanceWebview"; Android: "trill_…", "AppName/musical_ly", "BytedanceWebview")
  var isTikTok = /musical_ly|trill_|bytedancewebview|bytelocale|tiktok/i.test(ua);
  // Weitere In-App-Browser mit demselben Problem (Instagram, Facebook) – gleiche Anleitung
  var isOtherInApp = /instagram|fban|fbav|fb_iab/i.test(ua);
  var isInApp = isTikTok || isOtherInApp;

  var isIPadOS = /macintosh/i.test(ua) && navigator.maxTouchPoints > 1; // iPadOS meldet sich als Mac
  var isIOS = /iphone|ipad|ipod/i.test(ua) || isIPadOS;
  var isAndroid = /android/i.test(ua);

  var platform = isIOS ? 'ios' : isAndroid ? 'android' : 'desktop';
  var storeUrl = platform === 'android' ? stores.android : stores.ios; // Desktop → App-Store-Webseite
  var storeName = platform === 'android' ? 'Play Store' : 'App Store';

  // --- Links & Texte aus der Konfiguration setzen -----------------------------
  document.querySelectorAll('[data-store-link]').forEach(function (a) {
    var url = storeUrl || stores.ios;
    if (url) a.href = url;
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
    document.querySelectorAll('.go-mark').forEach(function (el) {
      if (el.textContent === 'App Store …') el.textContent = 'Play Store …';
    });
  }

  // --- Ansicht wählen -------------------------------------------------------
  var view;
  if (platform === 'android' && !stores.android) {
    view = 'android';                       // noch keine Android-App
  } else if (helpMode || isInApp) {
    view = 'guide';                         // Anleitung, keine automatische Weiterleitung
  } else if (storeUrl) {
    view = 'redirect';
  } else {
    view = 'default';
  }
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
