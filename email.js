// Pure email composition. No network access here; server.js sends the result.

export function buildConfirmationEmail({ name, email, guests }, from) {
  const seats = guests === 1 ? "1 seat" : `${guests} seats`;
  return {
    from,
    to: email,
    subject: "Your RSVP for the Toronto AI Meetup",
    text: [
      `Hi ${name},`,
      "",
      `We have reserved ${seats} for you at the Toronto AI Meetup.`,
      "Thursday, October 15, 6:30 pm to 9:00 pm",
      "MaRS Discovery District, 101 College St, Toronto",
      "",
      "Reply to this email if your plans change.",
    ].join("\n"),
  };
}
