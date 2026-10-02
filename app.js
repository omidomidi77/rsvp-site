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

  const { name, guests } = result.value;
  const seats = guests === 1 ? "1 seat" : `${guests} seats`;
  status.textContent = `Thanks, ${name}. We have reserved ${seats} for you.`;
  form.reset();
  showErrors({});
});
