function text(selector, value) {
  const target = document.querySelector(selector);
  if (target) target.textContent = value;
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.getAttribute("data-action");

  if (action === "privacy-check") {
    const form = button.closest("[data-tool='privacy-checker']");
    const checked = [...form.querySelectorAll("input[type='checkbox']:checked")];
    if (!checked.length) {
      text("[data-output='privacy-result']", "Select at least one information type first.");
      return;
    }
    const score = checked.reduce((total, item) => total + Number(item.value), 0);
    const reasons = checked.map((item) => item.dataset.reason).filter(Boolean);
    let level = "Low risk";
    let advice = "Use a short prompt, avoid unnecessary details, and verify the output.";
    if (score >= 8) {
      level = "High risk";
      advice = "Do not paste this into a general AI tool. Remove sensitive data, use an approved tool, or ask for policy guidance.";
    } else if (score >= 4) {
      level = "Medium risk";
      advice = "Sanitize the prompt first. Replace identifiers, remove private details, and share only what the task requires.";
    }
    text("[data-output='privacy-result']", level + "\n\n" + advice + "\n\nWhy:\n- " + reasons.join("\n- "));
  }

  if (action === "build-email-prompt") {
    const form = button.closest("[data-tool='email-builder']");
    const data = new FormData(form);
    const prompt = "Draft an email to " + data.get("audience") + " to " + data.get("purpose") + ".\n\n"
      + "Tone: " + data.get("tone") + ".\n"
      + "Length: 120-180 words.\n"
      + "Boundary: " + data.get("boundary") + ".\n\n"
      + "Use placeholders for private details. Keep the message specific, clear, and easy to review. End with one practical next step.";
    const output = form.querySelector("[data-output='email-prompt']");
    if (output) output.value = prompt;
  }

  if (action === "pick-tool") {
    const form = button.closest("[data-tool='tool-picker']");
    const data = new FormData(form);
    const task = data.get("task");
    const sensitivity = data.get("sensitivity");
    const sources = data.get("sources");
    const map = {
      writing: "Start with a general AI writing assistant and ask for options, critique, and concise rewrites.",
      research: "Use an AI assistant that can cite or open sources, then verify every important claim in the original source.",
      spreadsheet: "Use an assistant that can explain formulas and cleanup steps, but keep final calculations in the spreadsheet.",
      coding: "Use a coding-focused assistant with file context and tests, then run the code before trusting it.",
      study: "Use a tutor-style assistant for hints, quizzes, and feedback rather than complete answers."
    };
    let warning = "Public or fictional information is easiest to test with.";
    if (sensitivity === "internal") warning = "Check your workplace policy before pasting internal context.";
    if (sensitivity === "sensitive") warning = "Use only an approved tool for sensitive data, and avoid pasting raw records.";
    const sourceNote = sources === "yes"
      ? "Because current facts matter, require source links and open them yourself."
      : "Because this is mostly drafting, focus on clarity, tone, and human review.";
    text("[data-output='tool-picker-result']", map[task] + "\n\n" + warning + "\n\n" + sourceNote);
  }
});

