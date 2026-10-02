// Pure RSVP validation. No DOM access here; app.js wires this to the form.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_GUESTS = 1;
const MAX_GUESTS = 4;

export function validateRsvp({ name = "", email = "", guests = "" }) {
  const errors = {};
  const cleanName = String(name).trim();
  const cleanEmail = String(email).trim().toLowerCase();
  const guestCount = Number(String(guests).trim());

  if (!cleanName) errors.name = "Please enter your name.";
  if (!EMAIL_PATTERN.test(cleanEmail)) errors.email = "Please enter a valid email address.";
  if (!Number.isInteger(guestCount) || guestCount < MIN_GUESTS || guestCount > MAX_GUESTS) {
    errors.guests = `Guests must be a number from ${MIN_GUESTS} to ${MAX_GUESTS}.`;
  }

  const ok = Object.keys(errors).length === 0;
  return ok
    ? { ok, errors, value: { name: cleanName, email: cleanEmail, guests: guestCount } }
    : { ok, errors };
}
