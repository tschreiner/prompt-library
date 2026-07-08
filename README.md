# Prompt Hub

Prompt Hub ist eine static-first Web-App zum Pflegen, Durchsuchen und Ausfuellen von Prompt-Templates. Prompt-Dateien liegen als YAML im Repository, werden beim Entwickeln und Bauen validiert und als statisches Artefakt in die React-App uebernommen.

Das Projekt ist fuer Teams und Einzelpersonen gedacht, die eine kleine, nachvollziehbare Prompt-Bibliothek ohne Backend betreiben wollen.

Repository: [tschreiner/prompt-library](https://github.com/tschreiner/prompt-library)

## Status

- Oeffentlich veroeffentlichbar als statische App
- Keine Pflicht zu Laufzeit-Environment-Variablen
- Build, Lint und Produktion-Bundle sind reproduzierbar
- Tests sind vorhanden, aber noch bewusst schlank

## Features

- Prompt-Templates als einzelne YAML-Dateien im Repository pflegen
- Variablen automatisch aus `{{variable_name}}` erkennen
- Eingabefelder live rendern und finalen Prompt generieren
- Finalen Prompt in die Zwischenablage kopieren
- Nach Titel, Kategorie und Tags filtern
- Rein statisches Deployment ohne Backend

## Tech Stack

- Vite
- React 18
- TypeScript im Strict Mode
- Zod fuer Datenschema-Validierung
- YAML als Prompt-Quellformat
- Vitest und Testing Library
- ESLint und Prettier

## Projektstruktur

- `prompts/`: Quell-Dateien fuer Prompt-Templates
- `scripts/render-prompts.ts`: validiert YAML und erzeugt das generierte Frontend-Artefakt
- `src/domain/`: Typen, Parsing, Rendering und Sortierung
- `src/data/generatedTemplates.ts`: generierte Templates fuer die App
- `src/data/templateStore.ts`: Ladepunkt fuer Templates
- `src/App.tsx`: UI-Komposition und Client-State
- `src/**/*.test.ts(x)`: Unit- und UI-Tests

## Voraussetzungen

- Node.js `22` oder neuer
- npm `10` oder neuer

## Quickstart

```bash
npm install
npm run dev
```

Die App ist danach lokal ueber die von Vite ausgegebene URL erreichbar, typischerweise `http://localhost:5173`.

## Entwicklung

Der Dev-Server rendert Prompt-Dateien beim Start automatisch und beobachtet `prompts/*.yaml` sowie `prompts/*.yml` auf Aenderungen.

Wichtige Skripte:

```bash
npm run dev
npm run prompts:render
npm run prompts:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run check
```

`npm run check` fuehrt die zentralen Qualitaetspruefungen in CI-Reihenfolge aus.

## Prompt-Dateien

Jede Prompt-Datei beschreibt genau ein Template. Fuer neue Templates sind keine TypeScript-Aenderungen noetig.

Minimalbeispiel:

```yaml
id: meeting-actions
title: Meeting-Notizen in Aufgabenliste
description: Extrahiert Entscheidungen, Verantwortliche, Fristen und offene Fragen.
category: Automation
tags:
  - meeting-notes
template: |
  Notizen:
  {{meeting_notes}}
```

`variables` wird absichtlich nicht manuell gepflegt. Das Render-Skript leitet die Liste stabil aus Platzhaltern wie `{{meeting_notes}}` im `template`-Text ab.

Beim Validieren und Rendern gilt:

- Nur die erwarteten Felder sind erlaubt
- Doppelte `id`-Werte brechen den Build ab
- Fehler nennen Datei und Feld moeglichst konkret

## Konfiguration

Die aktuelle Version benoetigt keine Pflicht-Environment-Variablen. `.env.example` ist nur ein Platzhalter fuer spaetere Erweiterungen und enthaelt bewusst keine echten Werte.

Falls die App unter einem Repository-Subpfad deployed wird, muss `base` in [vite.config.ts](/C:/Users/Admin/Documents/prompt-library/vite.config.ts) passend gesetzt werden.

## Tests und Build

```bash
npm run check
npm run build
```

`npm run build` fuehrt zuerst das Prompt-Rendering aus und erstellt anschliessend den Vite-Produktionsbuild in `dist/`.

## Deployment

Geeignet fuer statische Hosts wie GitHub Pages, Netlify oder Vercel.

- Build Command: `npm run build`
- Publish Directory: `dist`

## Sicherheit

- Keine API-Keys oder Tokens sind fuer den Betrieb erforderlich
- Prompt-Inhalte werden als Text verarbeitet, nicht als HTML ausgefuehrt
- React escaped Inhalte standardmaessig
- Prompt-YAML wird vor der Uebernahme in die App validiert
- Clipboard-Zugriff behandelt Fehler ohne Crash der Anwendung

Hinweise zu Sicherheitsmeldungen stehen in [SECURITY.md](/C:/Users/Admin/Documents/prompt-library/SECURITY.md).

## Einschränkungen

- Derzeit keine Benutzerkonten, keine Rechteverwaltung und kein Backend
- Prompt-Sammlungen werden aus Dateien gebaut, nicht zur Laufzeit bearbeitet
- Die Testabdeckung fokussiert aktuell auf Kernlogik und einen UI-Basistest

## Mitwirken

Beitraege sind willkommen. Einstiegspunkte:

- [CONTRIBUTING.md](/C:/Users/Admin/Documents/prompt-library/CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](/C:/Users/Admin/Documents/prompt-library/CODE_OF_CONDUCT.md)
- [CHANGELOG.md](/C:/Users/Admin/Documents/prompt-library/CHANGELOG.md)

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Details siehe [LICENSE](/C:/Users/Admin/Documents/prompt-library/LICENSE).

## Maintainer

Aktuell gepflegt von `Tedd Schreiner`. Fuer allgemeine Rueckfragen oder Sicherheitsmeldungen: `info@teddschreiner.de`.
