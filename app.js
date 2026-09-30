import { validateRsvp } from "./rsvp.js";

const form = document.querySelector("#rsvp-form");
const status = document.querySelector("#form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const { ok, errors } = validateRsvp(data);
  status.textContent = ok
    ? `Thanks ${data.name.trim()}, you're on the list!`
    : Object.values(errors).join(" ");
  if (ok) form.reset();
});
