# CLAUDE.md — Filthy Rich Soil Co. Website

This repo is the site **filthyrichsoilco.com** — an **Astro** static site deployed via **GitHub Pages**.
You develop it **in the background, on a branch.** You edit existing page **content**, and you **integrate new pages that are authored for you as finished `.astro` files** — you don't originate design. You never touch the live site directly — only the owner merges to live.

## Source of truth
- Page content lives in the Obsidian vault: `<<SET ABSOLUTE PATH>>/FRSC/Website Content/`
- Start with `00 - FRSC Website - Site Map & Rules.md`. It maps every live route to its content file and lists the current build decisions. Follow it.
- The upstream strategy docs (Stewardship, Employee & Labor Model, Design & Build) are internal "why" only. **Never** copy their pricing, competitor, or compensation reasoning into public copy.

## Working mode — background only
- Do all work on a dedicated branch (e.g. `site-rebuild`). **Never commit to `main`** — that's the branch GitHub Pages deploys.
- Review every change on Astro's local preview (`npm run dev`) before it's considered done.
- **Merging to `main` (going live) is the owner's decision, never yours.** Propose; don't deploy.
- Commit per unit of work, with a clear message, so any single change can be reverted.

## Permission tiers — latitude depends on the type of work

**Tier 1 — Editing an existing page's copy** (Home, Values, Creations, Careers, Media): **content only.**
- Edit the visible words in the HTML body. Preserve every surrounding tag, class, and attribute exactly — including inline wrappers like `<span class="value-em">…</span>`. The words change; the markup does not.
- Never edit a `<style is:global>` block or `src/styles/global.css`.
- These pages already have good design. Do not restyle them.

**Tier 2 — Integrating a NEW page** (Projects, Consultation): **the page is authored elsewhere and handed to you as a finished `.astro` file. Place it, wire the route, verify it builds — do not originate or alter its design.**
- Drop the provided file into `src/pages/`, confirm it imports `Base` and builds cleanly on `npm run dev`.
- If something doesn't render, report what and where — don't redesign it. Small fixes to make it build are fine; restyling is not.
- New-page design happens outside the repo, with the full design system in view, precisely so you never have to freelance design in-repo.

**Tier 3 — Redesigning an existing page's layout, OR editing `global.css` / shared tokens / `Base.astro` / `Nav.astro` / `Footer.astro` design:** **explicit per-change sign-off + a before/after preview, every time.**
- A shared-system change ripples across every page. Never casual. Propose, show the preview, wait for an explicit yes.
- (Repointing CTA `href` values is sanctioned in the work order below and is the one exception — change the href only, nothing else.)

## Always — regardless of tier
- **Propose before editing.** Show a diff or short summary and wait for approval before changing files. No silent rewrites.
- One page / one unit at a time.
- Review the diff *and* the rendered preview before committing.
- A Tier-1 diff should be text-only; if it touches a CSS class, tag, or image, you've crossed a tier — stop and flag it.

## How the Astro code is organized
- Each page is `src/pages/<name>.astro`: frontmatter import → one `<style is:global>` block (all CSS) → HTML body (the copy).
- Shared chrome and design live outside the pages: `src/layouts/Base.astro`, `src/components/Nav.astro`, `src/components/Footer.astro`, and design tokens in `src/styles/global.css`.

## First task (read-only — change nothing)
Map where each page's copy lives, confirm the component/layout structure, and note how the `/consult` quiz (`consult.astro` + `src/scripts/`) is wired. Report back. Do not edit on this pass.

## Work order (after recon, one item at a time, each gated on approval)
1. Add the pre-authored `/consultation` page (provided as a finished `.astro`; simple "request a free consultation" — Formspree form + phone). **Tier 2 (integrate).**
2. Repoint **all 8** "Begin Consultation" links from `/consult` to the new page. Change the `href` value **only**:
   - `src/components/Nav.astro` — line 21 (desktop nav CTA) and line 34 (mobile-menu CTA)
   - `src/components/Footer.astro` — line 23 (footer contact)
   - `src/pages/index.astro` — lines 265, 327, 410 (hero, split, bottom CTA)
   - `src/pages/values.astro` — line 176
   - `src/pages/creations.astro` — line 230
   - (Line numbers are from the current source — re-verify before editing. `media.astro`, `careers.astro`, `privacy.astro`, `terms.astro` have no `/consult` links.)
3. Remove the `/consult` route (`src/pages/consult.astro`) only **after** all 8 are repointed. Its quiz engine — the entire `src/scripts/` folder (`calculations.js`, `state.js`, `filtering.js`, `email-builder.js`, `form-submission.js`, `event-handlers.js`, `navigation.js`) plus `src/pages/_consult.astro.backup` — becomes orphaned. Flag for removal, but confirm nothing else imports it first.
4. Add the pre-authored `/projects` page (provided as a finished `.astro`). **Tier 2 (integrate).**
5. Strip all farm / livestock content (the "Farm & Nursery Hand" role; pasture / hay / livestock options). FRSC is ecological land care only — no Henslow content. **Tier 1.**
6. Update remaining page copy (`Home.md`, `Values.md`, `Creations.md`, `Careers.md`) per their files. **Tier 1.**

## Stack constraints
- Preserve the existing Astro build and GitHub Pages setup. Add no dependencies without sign-off.
- No Google or Microsoft dependencies. Forms use Formspree; email is Zoho. Keep it that way.
