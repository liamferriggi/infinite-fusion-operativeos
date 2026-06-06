# Backup Manifest

## Backup Date

2026-06-06

## Backup Target

```text
https://github.com/liamferriggi/workflow-agent
```

## Included

- Full application source.
- Infinite Fusion copied brand assets.
- Package lockfile.
- Vite config.
- GitHub Pages workflow.
- Project context.
- Architecture notes.
- Deployment runbook.
- Market research summary.
- Product roadmap.
- Branding notes.

## Not Included

- `node_modules`
- `dist`
- `.vercel`
- Local browser storage data.

These are intentionally excluded by `.gitignore`.

## Source Repo at Time of Backup

```text
https://github.com/liamferriggi/infinite-fusion-operativeos
```

## Live Deployment at Time of Backup

```text
https://liamferriggi.github.io/infinite-fusion-operativeos/
```

## Verification Commands

```bash
npm install
npm run build
npm audit
curl -I https://liamferriggi.github.io/infinite-fusion-operativeos/
```

Expected:

- Build succeeds.
- Audit reports 0 vulnerabilities.
- Live deployment returns HTTP 200.

