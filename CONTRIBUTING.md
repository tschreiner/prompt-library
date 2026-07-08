# Contributing

Vielen Dank fuer dein Interesse an Prompt Hub.

## Lokale Entwicklung

1. Installiere Node.js `22` oder neuer sowie npm `10` oder neuer.
2. Fuehre `npm install` aus.
3. Starte die App mit `npm run dev`.
4. Fuehre vor einem Pull Request `npm run check` und bei Bedarf `npm run build` aus.

## Erwartete Qualitaetschecks

- `npm run prompts:check`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Beitragsrichtlinien

- Halte Prompt-Dateien klein, klar beschrieben und reproduzierbar.
- Bevorzuge Domain-Logik ausserhalb von JSX, wenn die Logik testbar sein sollte.
- Ergaenze Tests fuer Parsing, Rendering, Filterlogik und Regressionen.
- Fuege keine Placebo-Buttons oder Backend-Anmutungen ohne echte Funktion hinzu.
- Committe keine Secrets, lokalen `.env`-Dateien, Build-Artefakte oder Editor-Dateien.

## Pull Requests

- Beschreibe die sichtbare Aenderung und die Motivation knapp.
- Verweise auf relevante Issues, falls vorhanden.
- Halte Aenderungen moeglichst fokussiert und thematisch zusammenhaengend.

## Sicherheitsrelevante Meldungen

Bitte melde Sicherheitsprobleme nicht oeffentlich in Issues, sondern gemaess [SECURITY.md](/C:/Users/Admin/Documents/prompt-library/SECURITY.md).
