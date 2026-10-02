import { test } from "node:test";
import assert from "node:assert/strict";
import { validateRsvp, isDuplicateEmail } from "../rsvp.js";

test("accepts a complete, well-formed RSVP", () => {
  // Arrange
  const fields = { name: "Ada Lovelace", email: "ada@example.com", guests: "2" };
  // Act
  const result = validateRsvp(fields);
  // Assert
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, {});
  assert.deepEqual(result.value, { name: "Ada Lovelace", email: "ada@example.com", guests: 2 });
});

test("rejects a blank or whitespace-only name", () => {
  // Arrange
  const fields = { name: "   ", email: "ada@example.com", guests: "1" };
  // Act
  const result = validateRsvp(fields);
  // Assert
  assert.equal(result.ok, false);
  assert.equal(result.errors.name, "Please enter your name.");
});

test("rejects a malformed email", () => {
  // Arrange
  const fields = { name: "Ada", email: "not-an-email", guests: "1" };
  // Act
  const result = validateRsvp(fields);
  // Assert
  assert.equal(result.ok, false);
  assert.equal(result.errors.email, "Please enter a valid email address.");
});

test("rejects a guest count outside 1 to 4", () => {
  // Arrange
  const tooMany = { name: "Ada", email: "ada@example.com", guests: "5" };
  const notANumber = { name: "Ada", email: "ada@example.com", guests: "abc" };
  // Act
  const first = validateRsvp(tooMany);
  const second = validateRsvp(notANumber);
  // Assert
  assert.equal(first.ok, false);
  assert.equal(first.errors.guests, "Guests must be a number from 1 to 4.");
  assert.equal(second.ok, false);
  assert.equal(second.errors.guests, "Guests must be a number from 1 to 4.");
});

test("trims and lower-cases the email in the returned value", () => {
  // Arrange
  const fields = { name: " Ada ", email: "  Ada@Example.COM ", guests: "1" };
  // Act
  const result = validateRsvp(fields);
  // Assert
  assert.equal(result.ok, true);
  assert.equal(result.value.name, "Ada");
  assert.equal(result.value.email, "ada@example.com");
});

test("flags an email that already RSVP'd, ignoring case and whitespace", () => {
  // Arrange
  const existing = ["ada@example.com", "grace@example.com"];
  // Act
  const sameEmail = isDuplicateEmail(existing, "  ADA@Example.com ");
  const newEmail = isDuplicateEmail(existing, "linus@example.com");
  // Assert
  assert.equal(sameEmail, true);
  assert.equal(newEmail, false);
});

test("treats an empty list as having no duplicates", () => {
  // Arrange
  const existing = [];
  // Act
  const result = isDuplicateEmail(existing, "ada@example.com");
  // Assert
  assert.equal(result, false);
});
