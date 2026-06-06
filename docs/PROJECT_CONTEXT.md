# Workflow Agent Project Context

## Origin

This project started as a SaaS idea for capturing how an expert human works inside an app, turning that captured process into a deep SOP, and then converting the SOP into a supervised AI agent workflow.

The intended product direction is not a generic RPA replacement. The stronger market wedge is a vertical workflow-to-agent system:

> Record your best operator once. Turn their workflow into a supervised AI worker. Improve the workflow from every human correction.

## Current Product Name

The current app is branded as:

- Product: `OperativeOS`
- Brand system: `Infinite Fusion`
- Repo backup target: `liamferriggi/workflow-agent`
- Public deployment repo: `liamferriggi/infinite-fusion-operativeos`
- Live URL: `https://liamferriggi.github.io/infinite-fusion-operativeos/`

## Current MVP

The MVP is a static Vite app that demonstrates the core product loop:

1. Capture or define workflow steps.
2. Generate a deep SOP from those steps.
3. Generate structured agent workflow JSON.
4. Simulate a human-in-the-loop review console.
5. Persist the workflow locally in the browser.

The included sample workflow targets a gym-admin use case:

- Workflow: failed payment recovery
- Source system: gym management portal
- Actions: open overdue payment report, inspect member payment history, validate contact details, send payment message, escalate repeated failures.

## Product Thesis

Documentation-only tools such as SOP recorders are cheap and crowded. Enterprise RPA tools are powerful but heavy and brittle. The opportunity is the middle layer:

> SOPs that run.

This means:

- Capture expert work.
- Produce human-readable documentation.
- Produce machine-readable execution instructions.
- Run with approval gates.
- Learn from corrections.

## Recommended Vertical Wedge

The best initial wedge is a narrow operational workflow where:

- The work is repetitive.
- The workflow happens daily or weekly.
- The process touches a clunky app or portal.
- Mistakes cost real money or time.
- The business owner would pay for reduced admin load.

Strong candidate verticals:

- Gym and wellness studio admin operations.
- Accounting and bookkeeping monthly close.
- Insurance broker quote entry and renewals.
- Recruiting agency CRM and outreach operations.
- Real estate transaction coordination.

The current MVP uses gym-admin operations because it is concrete, easy to demo, and has clear workflows around payments, cancellations, bookings, and onboarding.

## Important Decisions Already Made

- Use Infinite Fusion branding from `liamferriggi/infinitefusion-branding`.
- Start with a simple static app, not a heavy backend.
- Use GitHub Pages for the first production deployment because Vercel CLI had an invalid saved token.
- Use Vite for build tooling.
- Keep data local in browser storage for the first MVP.
- Use GitHub Actions for deployment.
- Use relative asset paths via `vite.config.js` so GitHub Pages repo-subpath deployment works.

## Current Limitations

- No real browser extension capture yet.
- No backend database.
- No authentication or multi-user workspace.
- No live Playwright execution runner.
- No real AI model calls.
- Local persistence only uses browser `localStorage`.
- Human review console is simulated from workflow metadata.

## Next Product Milestone

Build the real capture-to-agent loop:

1. Browser extension or injected capture script.
2. Event timeline with DOM selectors, screenshots, and operator notes.
3. AI SOP generation using an LLM.
4. Workflow JSON refinement.
5. Playwright execution runner.
6. Human approval queue with correction capture.

