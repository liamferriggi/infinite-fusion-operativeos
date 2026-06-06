# Roadmap

## Phase 1: MVP Demo

Status: complete.

Delivered:

- Infinite Fusion branded static app.
- Workflow capture timeline.
- Editable workflow steps.
- Deep SOP generator.
- Agent workflow JSON generator.
- Human review simulation.
- Browser local persistence.
- GitHub Pages deployment.

## Phase 2: Real Capture

Goal: capture real expert workflows from a browser.

Recommended features:

- Browser extension.
- Click, input, navigation, and DOM event capture.
- URL and app context capture.
- Screenshot capture per step.
- Optional voice notes or text notes.
- Capture review screen where the user can clean up noisy events.

Output:

```text
CaptureSession -> normalized Step list -> SOP draft -> agent workflow draft
```

## Phase 3: AI SOP Builder

Goal: use an LLM to turn raw capture data into high-quality SOPs.

Recommended features:

- Prompt templates for SOP extraction.
- Decision point detection.
- Exception and fallback detection.
- Required inputs extraction.
- Validation checklist generation.
- Risk and approval gate detection.

## Phase 4: Execution Runner

Goal: run generated workflows under supervision.

Recommended features:

- Playwright-based browser execution.
- Step-by-step run log.
- Screenshots before and after each step.
- Selector healing.
- Confidence scoring.
- Human approval gates.
- Stop/resume behavior.

## Phase 5: Human Correction Loop

Goal: improve workflows from user corrections.

Recommended features:

- Correction capture.
- Step diffing.
- SOP versioning.
- Workflow JSON versioning.
- Approval history.
- Run analytics.

## Phase 6: SaaS Foundations

Goal: turn the prototype into a real multi-tenant product.

Recommended features:

- Auth.
- Workspaces.
- Roles.
- Workflow library.
- Billing.
- Audit logs.
- Team sharing.
- Integration credentials vault.

## Phase 7: Vertical Productization

Start with one vertical.

Recommended vertical: gym and wellness admin operations.

Template workflows:

- Failed payment recovery.
- New member onboarding.
- Membership cancellation.
- Booking change follow-up.
- No-show follow-up.
- Membership freeze request.
- Lead follow-up.

Pricing hypothesis:

- Setup: `$2,000-$10,000`.
- SaaS: `$500-$1,500/month` per operational agent package.
- Usage: optional per completed workflow run.

