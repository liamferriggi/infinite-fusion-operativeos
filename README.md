# Infinite Fusion OperativeOS MVP

OperativeOS is a workflow-to-agent SaaS prototype branded with the Infinite Fusion web app system. The first slice focuses on a gym admin workflow: capture an expert process, generate a deep SOP, turn the SOP into a structured agent workflow, and review agent runs with human approval.

## Run

Open `index.html` directly in a browser, or serve the folder with any static web server.

Current local dev URL:

```text
http://localhost:4177
```

Production URL:

```text
https://liamferriggi.github.io/infinite-fusion-operativeos/
```

## Branding

Brand assets and tokens come from `liamferriggi/infinitefusion-branding`.

Copied assets:

- `brand/logo-stacked.png`
- `brand/logo-wordmark.png`
- `brand/logo-mark.jpg`

Applied tokens:

- Navy: `#0B0C2A`
- Blue: `#2B35FF`
- Light blue: `#EEF0FF`
- Background: `#F5F6FA`
- Border: `#E4E6EF`
- Font: `Segoe UI`

## MVP Loop

1. Capture or load workflow steps.
2. Generate a deep SOP.
3. Generate agent workflow JSON.
4. Simulate a supervised run.
5. Use human corrections to improve the workflow.

## Next Build Steps

- Add persistent workflow storage.
- Add editable step details.
- Add browser extension event capture.
- Add Playwright execution from the workflow JSON.
- Add authentication, workspaces, and audit logs.
