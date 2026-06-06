# Architecture

## Current Architecture

The current app is a client-only Vite application.

```text
index.html
  -> app.js
  -> styles.css
  -> brand assets
```

There is no backend in the current deployed version.

## Runtime Flow

```text
User loads app
  -> app restores workflow state from localStorage
  -> user loads sample or edits workflow
  -> app renders capture timeline
  -> app generates SOP text
  -> app generates agent workflow JSON
  -> app renders simulated review cards
  -> app saves workflow state back to localStorage
```

## Main Files

| File | Purpose |
|---|---|
| `index.html` | App shell, views, workflow form, modal editor |
| `styles.css` | Infinite Fusion branded UI styles |
| `app.js` | Workflow state, SOP generator, JSON generator, review simulation |
| `package.json` | Vite scripts and dependency metadata |
| `vite.config.js` | Relative asset base for GitHub Pages |
| `.github/workflows/deploy.yml` | GitHub Pages deployment workflow |
| `brand/` | Infinite Fusion logo assets |

## State Model

State is held in memory and persisted to `localStorage`.

Storage key:

```text
operativeos.mvp.v1
```

Workflow state shape:

```json
{
  "meta": {
    "name": "Failed payment recovery",
    "goal": "Recover overdue payments without losing member goodwill.",
    "application": "Gym management portal",
    "notes": "Operator notes..."
  },
  "steps": [
    {
      "title": "Open overdue payments report",
      "description": "Navigate to Billing > Failed Payments...",
      "actionType": "navigate",
      "selector": "nav.billing a[href='/failed-payments']",
      "decision": false,
      "risk": false,
      "expected": "A list of members with failed payments is visible."
    }
  ],
  "savedAt": "2026-06-06T16:00:00.000Z"
}
```

## Generated SOP

The SOP generator produces:

- Business goal.
- Source system.
- Operator notes.
- Required inputs.
- Step-by-step procedure.
- Decision points.
- Exception handling.
- Agent completion criteria.

## Generated Agent Workflow

The agent JSON contains:

- Workflow name.
- Vertical.
- Source application.
- Objective.
- Execution mode.
- Confidence threshold.
- Required inputs.
- Step list.
- Per-step instruction, action type, target selector, expected result, approval requirement, and fallback rule.
- Audit configuration.

## Future Architecture

Recommended production architecture:

```text
Browser Extension / Desktop Recorder
  -> Capture API
  -> Object Storage for screenshots and recordings
  -> Workflow Database
  -> AI SOP Extractor
  -> Workflow Builder
  -> Agent Runtime
  -> Human Review Console
  -> Correction Learning Loop
```

Recommended services:

- Frontend: Next.js or Vite + React.
- Backend: Node/TypeScript API.
- Database: Postgres.
- Auth: Clerk, Auth.js, or Supabase Auth.
- Storage: S3-compatible object storage.
- Execution: Playwright workers.
- Queue: BullMQ, Temporal, or a managed queue.
- Observability: structured logs, screenshots, run traces.

## Future Data Model

```text
Workspace
User
Workflow
WorkflowVersion
Step
CaptureSession
CaptureEvent
Artifact
Run
RunStep
Approval
Correction
IntegrationCredential
```

