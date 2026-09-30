---
name: design-system
description: Brand and UI component rules for the RSVP site. Use whenever creating or changing a page section, component, or styles.
---

# Design system

## Tokens (defined in `styles.css` `:root`)
- Background `--color-bg`, surfaces `--color-surface`, text `--color-text`,
  secondary text `--color-muted`, primary action `--color-accent`.
- Corners: `--radius` for cards, 8px for inputs and buttons.
- Spacing: multiples of `--space` only.

## Components
- **Section**: a `<section class="card">` with an `<h2>` that has an id,
  referenced by `aria-labelledby`.
- **Primary button**: accent background, dark text, bold. One primary button per section.
- **List of people (e.g. speakers)**: responsive CSS grid, `repeat(auto-fit, minmax(12rem, 1fr))`,
  each item is a card with name (h3), role (muted), and one-line bio.

## Don'ts
- No new colors, fonts, or icon libraries.
- No inline styles.
