import { validateRsvp } from "./rsvp.js";

const form = document.querySelector("#rsvp-form");
const status = document.querySelector("#rsvp-status");
const fields = ["name", "email", "guests"];

function showErrors(errors) {
  for (const field of fields) {
    const input = form.elements[field];
    const message = form.querySelector(`#${field}-error`);
    const text = errors[field] ?? "";
    message.textContent = text;
    input.setAttribute("aria-invalid", text ? "true" : "false");
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const result = validateRsvp({
    name: form.elements.name.value,
    email: form.elements.email.value,
    guests: form.elements.guests.value,
  });
  showErrors(result.errors);

  if (!result.ok) {
    status.textContent = "Please fix the highlighted fields.";
    form.querySelector("[aria-invalid='true']").focus();
    return;
  }

  submitRsvp(result.value);
});

async function submitRsvp(rsvp) {
  const button = form.querySelector("button[type='submit']");
  button.disabled = true;
  status.textContent = "Sending your confirmation...";
  try {
    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rsvp),
    });
    if (response.status === 409) {
      const { error } = await response.json();
      status.textContent = error;
      return;
    }
    if (!response.ok) throw new Error(`server responded ${response.status}`);
    const { sent } = await response.json();
    const seats = rsvp.guests === 1 ? "1 seat" : `${rsvp.guests} seats`;
    status.textContent = sent
      ? `Thanks, ${rsvp.name}. We have reserved ${seats} and emailed a confirmation to ${rsvp.email}.`
      : `Thanks, ${rsvp.name}. We have reserved ${seats}, but the confirmation email could not be sent.`;
    form.reset();
    showErrors({});
  } catch {
    status.textContent = "We could not save your RSVP. Please try again in a moment.";
  } finally {
    button.disabled = false;
  }
}
