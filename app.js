const sampleSteps = [
  {
    title: "Open overdue payments report",
    description:
      "Navigate to Billing > Failed Payments and filter to members with a failed charge in the last 7 days.",
    actionType: "navigate",
    selector: "nav.billing a[href='/failed-payments']",
    decision: false,
    risk: false,
    expected: "A list of members with failed payments is visible.",
  },
  {
    title: "Review member payment history",
    description:
      "Open the first member record and check whether this is the first failed payment or a repeated failure.",
    actionType: "inspect",
    selector: "[data-member-row]:first-child",
    decision: true,
    risk: false,
    expected: "Member billing profile and recent payment attempts are available.",
  },
  {
    title: "Confirm contact details",
    description:
      "Verify that email and phone number are present before sending any payment recovery message.",
    actionType: "validate",
    selector: "#member-contact-panel",
    decision: true,
    risk: false,
    expected: "At least one valid contact method exists.",
  },
  {
    title: "Send payment update message",
    description:
      "If this is the first failed payment, send a friendly payment update email using the saved template.",
    actionType: "message",
    selector: "button[data-template='payment-update']",
    decision: true,
    risk: true,
    expected: "Message is queued or sent and the activity log is updated.",
  },
  {
    title: "Escalate repeated failures",
    description:
      "If the member has two or more failed payments, assign a manager follow-up task instead of sending another automated message.",
    actionType: "create_task",
    selector: "button[data-action='assign-manager-followup']",
    decision: true,
    risk: true,
    expected: "Manager follow-up task exists with the member record attached.",
  },
];

let steps = [];
let editingStepIndex = null;
const storageKey = "operativeos.mvp.v1";

const views = {
  capture: document.querySelector("#captureView"),
  sop: document.querySelector("#sopView"),
  agent: document.querySelector("#agentView"),
  review: document.querySelector("#reviewView"),
};

const timeline = document.querySelector("#timeline");
const sopOutput = document.querySelector("#sopOutput");
const agentOutput = document.querySelector("#agentOutput");
const reviewList = document.querySelector("#reviewList");

const workflowName = document.querySelector("#workflowName");
const workflowGoal = document.querySelector("#workflowGoal");
const workflowApp = document.querySelector("#workflowApp");
const operatorNotes = document.querySelector("#operatorNotes");
const stepDialog = document.querySelector("#stepDialog");
const stepForm = document.querySelector("#stepForm");
const stepTitle = document.querySelector("#stepTitle");
const stepDescription = document.querySelector("#stepDescription");
const stepActionType = document.querySelector("#stepActionType");
const stepSelector = document.querySelector("#stepSelector");
const stepExpected = document.querySelector("#stepExpected");
const stepDecision = document.querySelector("#stepDecision");
const stepRisk = document.querySelector("#stepRisk");

function workflowMeta() {
  return {
    name: workflowName.value.trim() || "Untitled workflow",
    goal: workflowGoal.value.trim() || "No goal provided.",
    application: workflowApp.value.trim() || "Unknown application",
    notes: operatorNotes.value.trim() || "No operator notes provided.",
  };
}

function renderTimeline() {
  timeline.innerHTML = "";

  if (!steps.length) {
    timeline.innerHTML =
      '<li class="timeline-item"><span class="step-number">0</span><div><h3>No workflow captured yet</h3><p>Load the sample or add a manual step to start building the agent blueprint.</p></div></li>';
    updateMetrics();
    return;
  }

  steps.forEach((step, index) => {
    const item = document.createElement("li");
    item.className = "timeline-item";
    item.innerHTML = `
      <span class="step-number">${index + 1}</span>
      <div>
        <h3>${escapeHtml(step.title)}</h3>
        <p>${escapeHtml(step.description)}</p>
        <div class="tag-row">
          <span class="tag">${escapeHtml(step.actionType)}</span>
          ${step.decision ? '<span class="tag decision">decision</span>' : ""}
          ${step.risk ? '<span class="tag risk">approval</span>' : ""}
        </div>
      </div>
      <button class="remove-step" type="button" aria-label="Edit step" data-index="${index}">Edit</button>
    `;
    timeline.appendChild(item);
  });

  updateMetrics();
}

function saveState() {
  const state = {
    meta: workflowMeta(),
    steps,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return false;

  try {
    const state = JSON.parse(raw);
    workflowName.value = state.meta?.name || workflowName.value;
    workflowGoal.value = state.meta?.goal || workflowGoal.value;
    workflowApp.value = state.meta?.application || workflowApp.value;
    operatorNotes.value = state.meta?.notes || operatorNotes.value;
    steps = Array.isArray(state.steps) ? state.steps : [];
    return true;
  } catch {
    return false;
  }
}

function updateMetrics() {
  const decisionCount = steps.filter((step) => step.decision).length;
  const approvalCount = steps.filter((step) => step.risk).length;
  const confidence = steps.length ? Math.max(58, 94 - approvalCount * 8 - decisionCount * 3) : null;

  document.querySelector("#metricSteps").textContent = steps.length;
  document.querySelector("#metricDecisions").textContent = decisionCount;
  document.querySelector("#metricConfidence").textContent = confidence ? `${confidence}%` : "--";
  document.querySelector("#metricApprovals").textContent = approvalCount;
}

function buildSop() {
  const meta = workflowMeta();
  const decisionSteps = steps.filter((step) => step.decision);
  const approvalSteps = steps.filter((step) => step.risk);

  return `# ${meta.name}

## Business Goal
${meta.goal}

## Source System
${meta.application}

## Operator Notes
${meta.notes}

## Required Inputs
- Member account identifier
- Current billing status
- Contact details
- Payment failure count
- Manager escalation rules

## Procedure
${steps
  .map(
    (step, index) => `${index + 1}. ${step.title}
   - Action: ${step.description}
   - System target: ${step.selector}
   - Expected result: ${step.expected}
   - Human approval required: ${step.risk ? "Yes" : "No"}`
  )
  .join("\n\n")}

## Decision Points
${decisionSteps.length ? decisionSteps.map((step) => `- ${step.title}: ${step.description}`).join("\n") : "- None captured yet."}

## Exception Handling
${approvalSteps.length ? approvalSteps.map((step) => `- Pause before "${step.title}" when confidence is below 85% or customer impact is high.`).join("\n") : "- No high-risk steps captured yet."}

## Agent Completion Criteria
- All required fields are validated.
- Every high-risk step has been approved or escalated.
- The member activity log contains the final action taken.
- The run log contains screenshots and timestamps for audit review.
`;
}

function buildAgentWorkflow() {
  const meta = workflowMeta();

  return {
    name: meta.name,
    vertical: "gym_admin_ops",
    source_application: meta.application,
    objective: meta.goal,
    mode: "supervised",
    confidence_threshold: 0.85,
    inputs: ["member_id", "billing_status", "payment_failure_count", "contact_methods"],
    steps: steps.map((step, index) => ({
      id: `step_${String(index + 1).padStart(2, "0")}`,
      instruction: step.title,
      action_type: step.actionType,
      target: step.selector,
      context: step.description,
      expected_result: step.expected,
      requires_human_approval: step.risk,
      decision_point: step.decision,
      fallback: step.risk
        ? "Pause execution and request manager approval with screenshot evidence."
        : "Retry once, then escalate to human review if the target cannot be found.",
    })),
    audit: {
      retain_screenshots: true,
      retain_event_log: true,
      require_final_summary: true,
    },
  };
}

function generateOutputs() {
  saveState();
  sopOutput.textContent = steps.length ? buildSop() : "Load or add workflow steps first.";
  agentOutput.textContent = steps.length
    ? JSON.stringify(buildAgentWorkflow(), null, 2)
    : "Load or add workflow steps first.";
  renderReview();
}

function renderReview() {
  reviewList.innerHTML = "";

  if (!steps.length) {
    reviewList.innerHTML =
      '<article class="review-card"><div><h3>No run available</h3><p>Generate an agent workflow before simulating a run.</p></div><span class="status needs-review">Waiting</span></article>';
    return;
  }

  steps.forEach((step, index) => {
    const status = step.risk ? "needs-review" : "approved";
    const statusText = step.risk ? "Needs review" : "Auto-approved";
    const card = document.createElement("article");
    card.className = "review-card";
    card.innerHTML = `
      <div>
        <h3>${index + 1}. ${escapeHtml(step.title)}</h3>
        <p>${escapeHtml(step.expected)}</p>
      </div>
      <span class="status ${status}">${statusText}</span>
    `;
    reviewList.appendChild(card);
  });
}

function addManualStep() {
  steps.push({
    title: "New captured step",
    description: "Describe what the operator did and what the agent should learn.",
    actionType: "manual",
    selector: "pending-selector",
    decision: false,
    risk: true,
    expected: "Expected outcome pending.",
  });
  renderTimeline();
  generateOutputs();
  openStepEditor(steps.length - 1);
}

function openStepEditor(index) {
  const step = steps[index];
  if (!step) return;

  editingStepIndex = index;
  stepTitle.value = step.title;
  stepDescription.value = step.description;
  stepActionType.value = step.actionType;
  stepSelector.value = step.selector;
  stepExpected.value = step.expected;
  stepDecision.checked = step.decision;
  stepRisk.checked = step.risk;
  stepDialog.showModal();
}

function closeStepEditor() {
  editingStepIndex = null;
  stepDialog.close();
}

function saveStepFromEditor() {
  if (editingStepIndex === null || !steps[editingStepIndex]) return;

  steps[editingStepIndex] = {
    title: stepTitle.value.trim() || "Untitled step",
    description: stepDescription.value.trim() || "No operator action provided.",
    actionType: stepActionType.value,
    selector: stepSelector.value.trim() || "pending-selector",
    expected: stepExpected.value.trim() || "Expected result pending.",
    decision: stepDecision.checked,
    risk: stepRisk.checked,
  };

  closeStepEditor();
  renderTimeline();
  generateOutputs();
}

function deleteEditingStep() {
  if (editingStepIndex === null) return;
  steps.splice(editingStepIndex, 1);
  closeStepEditor();
  renderTimeline();
  generateOutputs();
}

function switchView(viewName) {
  Object.entries(views).forEach(([name, view]) => {
    view.classList.toggle("active", name === viewName);
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewName);
  });
}

function copyText(element) {
  navigator.clipboard?.writeText(element.textContent || "");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.querySelector("#loadSample").addEventListener("click", () => {
  steps = structuredClone(sampleSteps);
  renderTimeline();
  generateOutputs();
});

document.querySelector("#generateAll").addEventListener("click", generateOutputs);
document.querySelector("#addStep").addEventListener("click", addManualStep);
document.querySelector("#simulateRun").addEventListener("click", renderReview);
document.querySelector("#copySop").addEventListener("click", () => copyText(sopOutput));
document.querySelector("#copyAgent").addEventListener("click", () => copyText(agentOutput));

timeline.addEventListener("click", (event) => {
  const button = event.target.closest(".remove-step");
  if (!button) return;
  openStepEditor(Number(button.dataset.index));
});

stepForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveStepFromEditor();
});

document.querySelector("#closeStepDialog").addEventListener("click", closeStepEditor);
document.querySelector("#deleteStep").addEventListener("click", deleteEditingStep);

[workflowName, workflowGoal, workflowApp, operatorNotes].forEach((field) => {
  field.addEventListener("input", () => {
    generateOutputs();
  });
});

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => switchView(item.dataset.view));
});

loadState();
renderTimeline();
generateOutputs();
