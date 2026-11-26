/*
 * UniMathe /go – Erkennung (läuft synchron im <head>, bevor die Seite gezeichnet wird).
 * Setzt <html data-go-view="…">, damit per CSS sofort die richtige Ansicht sichtbar ist
 * und z. B. das Tutorial in Instagram nicht kurz aufblitzt.
 *
 * Erkennung nur über den User-Agent (kein Referrer nötig) – Best Effort.
 * Reihenfolge: ?help=1 → Android ohne App → Instagram → andere In-App-Browser → normaler Browser.
 */
(function () {
  'use strict';

  var stores = window.UNIMATHE_STORES || {};
  var ua = navigator.userAgent || '';
  var helpMode = /(?:^|[?&])help=1(?:&|$)/.test(location.search);

  // Instagram (iOS: "… Instagram 330.0.0.0 (iPhone15,2; iOS 17_4; …)", Android: "… Instagram 330.0.0.0 Android (…)")
  var isInstagram = /\binstagram\b/i.test(ua);
  // TikTok (iOS: "musical_ly_…", "BytedanceWebview"; Android: "trill_…", "AppName/musical_ly", "BytedanceWebview")
  var isTikTok = /musical_ly|trill_|bytedancewebview|bytelocale|tiktok/i.test(ua);
  // Weitere In-App-Browser mit demselben Problem (Facebook) – Tutorial wie bei TikTok
  var isOtherInApp = /fban|fbav|fb_iab/i.test(ua);

  var isIPadOS = /macintosh/i.test(ua) && navigator.maxTouchPoints > 1; // iPadOS meldet sich als Mac
  var isIOS = /iphone|ipad|ipod/i.test(ua) || isIPadOS;
  var isAndroid = /android/i.test(ua);

  var platform = isIOS ? 'ios' : isAndroid ? 'android' : 'desktop';
  var storeUrl = platform === 'android' ? stores.android : stores.ios; // Desktop → App-Store-Webseite

  var view;
  if (platform === 'android' && !stores.android) {
    view = 'android';     // noch keine Android-App
  } else if (helpMode) {
    view = 'guide';       // Hilfe-Modus: immer Tutorial, keine Weiterleitung
  } else if (isInstagram) {
    view = 'instagram';   // kompakte Seite mit Button (vor der allgemeinen In-App-Regel)
  } else if (isTikTok || isOtherInApp) {
    view = 'guide';       // Tutorial „Im Browser öffnen“
  } else if (storeUrl) {
    view = 'redirect';    // Safari, Chrome & Co. → direkt in den Store
  } else {
    view = 'default';
  }

  window.UNIMATHE_GO = {
    view: view,
    platform: platform,
    storeUrl: storeUrl || stores.ios || null,
    isInstagram: isInstagram,
    isTikTok: isTikTok,
    helpMode: helpMode
  };
  document.documentElement.setAttribute('data-go-view', view);
})();
