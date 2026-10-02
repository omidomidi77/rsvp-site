import { test } from "node:test";
import assert from "node:assert/strict";
import { buildConfirmationEmail } from "../email.js";

test("builds a confirmation addressed to the attendee with their seat count", () => {
  // Arrange
  const rsvp = { name: "Ada Lovelace", email: "ada@example.com", guests: 2 };
  // Act
  const message = buildConfirmationEmail(rsvp, "Toronto AI Meetup <onboarding@resend.dev>");
  // Assert
  assert.equal(message.to, "ada@example.com");
  assert.equal(message.from, "Toronto AI Meetup <onboarding@resend.dev>");
  assert.equal(message.subject, "Your RSVP for the Toronto AI Meetup");
  assert.match(message.text, /Ada Lovelace/);
  assert.match(message.text, /2 seats/);
});

test("uses singular wording for one seat", () => {
  // Arrange
  const rsvp = { name: "Ada", email: "ada@example.com", guests: 1 };
  // Act
  const message = buildConfirmationEmail(rsvp, "Toronto AI Meetup <onboarding@resend.dev>");
  // Assert
  assert.match(message.text, /1 seat\b/);
  assert.doesNotMatch(message.text, /1 seats/);
});
