// Pure validation logic — kept separate from the DOM so it can be unit tested.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRsvp({ name = "", email = "" }) {
  const errors = {};
  if (!name.trim()) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(email.trim())) errors.email = "Please enter a valid email.";
  return { ok: Object.keys(errors).length === 0, errors };
}
