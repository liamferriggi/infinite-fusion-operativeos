# Deployment Runbook

## Current Deployment

The app is deployed with GitHub Pages from:

```text
https://github.com/liamferriggi/infinite-fusion-operativeos
```

Live URL:

```text
https://liamferriggi.github.io/infinite-fusion-operativeos/
```

Backup/documentation repo:

```text
https://github.com/liamferriggi/workflow-agent
```

## Local Development

Install dependencies:

```bash
npm install
```

Start local dev server:

```bash
npm run dev
```

Build production assets:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Audit dependencies:

```bash
npm audit
```

## GitHub Pages Deployment

Deployment is handled by:

```text
.github/workflows/deploy.yml
```

The workflow:

1. Checks out the repo.
2. Installs Node 22.
3. Runs `npm ci`.
4. Runs `npm run build`.
5. Uploads `dist`.
6. Deploys to GitHub Pages.

## Important Vite Setting

GitHub Pages serves the app under a repository subpath:

```text
/infinite-fusion-operativeos/
```

The app uses relative built asset paths:

```js
export default defineConfig({
  base: "./",
});
```

This is required so generated assets load correctly at the Pages URL.

## Deployment Verification

Check HTTP status:

```bash
curl -I https://liamferriggi.github.io/infinite-fusion-operativeos/
```

Expected:

```text
HTTP/2 200
```

Smoke test:

1. Open the live URL.
2. Confirm Infinite Fusion branding loads.
3. Click `Load sample`.
4. Confirm captured steps count changes to `5`.
5. Open `Agent`.
6. Confirm JSON contains `"mode": "supervised"`.
7. Confirm browser console has no errors.

## Known Deployment Notes

- Vercel CLI was installed locally but had an invalid saved token at the time of deployment.
- GitHub Pages was used instead and deployed successfully.
- GitHub Actions may print a Node 20 deprecation warning for upstream actions. The workflow sets `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true`, and deployment succeeds.

