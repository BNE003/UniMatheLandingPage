/*
 * UniMathe – zentrale Store-Konfiguration.
 * Hier (und nur hier) stehen die Store-Links. /go liest sie aus.
 *
 * Google Play später ergänzen: einfach die URL bei `android` eintragen, z. B.
 *   android: 'https://play.google.com/store/apps/details?id=de.unimathe.app',
 * Dann leitet /go Android-Geräte automatisch dorthin weiter, und der
 * Hinweis „Android-Version in Vorbereitung“ auf /go verschwindet.
 */
window.UNIMATHE_STORES = {
  ios: 'https://apps.apple.com/de/app/h%C3%B6here-mathematik/id6745843324',
  android: null,
  // Suchbegriff für die Alternative „Suche im App Store nach …“
  searchTerm: 'UniMathe'
};
