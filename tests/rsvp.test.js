import { test } from "node:test";
import assert from "node:assert/strict";
import { validateRsvp } from "../rsvp.js";

test("accepts a valid RSVP", () => {
  assert.equal(validateRsvp({ name: "Aida", email: "a@b.co" }).ok, true);
});
test("rejects an empty name", () => {
  assert.equal(validateRsvp({ name: " ", email: "a@b.co" }).errors.name, "Please enter your name.");
});
test("rejects a bad email", () => {
  assert.ok(validateRsvp({ name: "A", email: "nope" }).errors.email);
});
