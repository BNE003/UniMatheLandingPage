# UniMathe Landingpage

Statische Seite (HTML/CSS/Vanilla JS), kein Build-Schritt.

| Pfad | Datei | Zweck |
|---|---|---|
| `/` | `index.html` | Landingpage (Mobile-Layout bis 759 px, Desktop ab 760 px) |
| `/go` | `go/index.html` | Download-Link für Buttons und TikTok-Bio |
| `/go?help=1` | `go/index.html` | Zeigt immer die „Im Browser öffnen“-Anleitung, ohne Weiterleitung |

## Store-Links

Nur in `assets/js/store-config.js` pflegen. Für Android später die Google-Play-URL bei `android` eintragen,
dann leitet `/go` Android-Geräte automatisch weiter.

## Ablauf `/go`

- Instagram-In-App-Browser → kompakte Seite mit Button „Im App Store öffnen“ (schlichter Link auf die Store-URL)
- TikTok-/Facebook-In-App-Browser → Anleitung („Tippe oben rechts auf ⋯ …“)

Die Erkennung läuft in `assets/js/go-detect.js` synchron im `<head>` (nur User-Agent, kein Referrer)
und setzt `<html data-go-view>`, damit beim Laden nichts aufblitzt.
- iPhone/iPad/Desktop im normalen Browser → sofortige Weiterleitung in den App Store
- Android → „Android-Version in Vorbereitung“ (bis ein Play-Store-Link eingetragen ist)

## Lokal testen

```bash
python3 -m http.server 4173
```

## Vercel

Framework Preset „Other“, Build Command leer, Output Directory leer bzw. `.` (Root).
`design/` enthält den Original-Export und wird per `.vercelignore` nicht ausgeliefert.

## Rechtliches

| Pfad | Kurzadresse | Datei |
|---|---|---|
| `/impressum` | `/imprint` | `impressum/index.html` |
| `/datenschutz` | `/privacy` | `datenschutz/index.html` |
| `/agb` | `/terms` | `agb/index.html` |
| `/support` | `/hilfe` | `support/index.html` (FAQ, Kontakt) |
