# CLAUDE.md — Filthy Rich Soil Co. Website

This repo is the site **filthyrichsoilco.com** — an **Astro** static site deployed via **GitHub Pages**.
You develop it **in the background, on a branch.** You edit existing page **content**, and you **integrate replacement pages that are authored for you as finished `.astro` files** — you don't originate design. For this rebuild, every public page has been re-authored outside the repo; your job is placement, link repointing, deletions, and the build. You never touch the live site directly — only the owner merges to live.

## Source of truth
- Page content lives in the Obsidian vault: `<<SET ABSOLUTE PATH>>/FRSC/Website Content/`
- Start with `00 - FRSC Website - Site Map & Rules.md`. It maps every live route to its content file and lists the current build decisions. Follow it.
- The upstream strategy docs (Stewardship, Employee & Labor Model, Design & Build, the P&L, the Client Acquisition Plan, the Website Change Brief) are internal "why" only. **Never** copy their pricing, competitor, capacity, or compensation reasoning into public copy.

## Public-copy rules — apply to every edit, every tier
These are decisions, not suggestions. If a content file in the vault contradicts one of these, stop and flag it rather than choosing.

- **No fabricated proof.** No testimonials, project photos, stats, videos, or "field notes" that imply client work or an operating history that hasn't happened. The company launches spring 2027. Stock photography is fine as atmosphere; it is never captioned as an FRSC property or result.
- **No Henslow Farm content on this site.** No farm, pasture, hay, livestock, nursery-hand, or working-land services or roles. FRSC is estate land stewardship only. Where the Testing Garden is mentioned, it is described as a Henslow Farm nursery experiment that FRSC *documents* — the two names stay distinct.
- **Audience is estates.** No condo, townhome, HOA, or commercial options or copy.
- **Pricing on the site is the assessment fee only** ($550 Soil & Site Assessment, credited toward a one-year agreement). No weekly or seasonal program prices, no spend brackets, no quote generation.
- **Compensation in public copy:** the open Apprentice Steward role says **"Starting at $25/hr"** and nothing more. No band caps, no figures for Steward or Lead, no raise schedule. Upper rungs are described qualitatively ("each level carries its own pay band").
- **Hours in public copy:** "Nobody works more than 40 hours a week" and "you go home to your family." Do **not** state weekly hours, seasonal weeks, or that the role is part-time or seasonal.
- **Benefits in public copy:** unspecified by design. The sanctioned line is that profit sharing and benefits are "where this is going" and will be discussed directly. Do not list specific benefits, start dates for them, or percentages.
- **The specialist is not a trainer.** Any copy about training says the *owner* trains the Apprentice. The specialist is described as a skilled practitioner the Apprentice works alongside — never as a manager, mentor, or supervisor.
- **Free vs. paid:** the site offers a *free site walkthrough* (30–45 min, no report) and a *paid assessment*. The words "free consultation," "free assessment," "free estimate," "no commitment," and "no obligation" do not appear anywhere.
- **No bios.** No founder or specialist background, no "about" or "meet the team" content, no names other than the contact email. If a content file asks for one, stop and flag.
- **The CTA target is `/contact` and the CTA label is "Request a Walkthrough."** There is no `/consultation` route. If you find a `consultation.astro` in the repo, it is a superseded draft — delete it in work-order item 6.

## Working mode — background only
- Do all work on a dedicated branch (e.g. `site-rebuild`). **Never commit to `main`** — that's the branch GitHub Pages deploys.
- Review every change on Astro's local preview (`npm run dev`) before it's considered done.
- **Merging to `main` (going live) is the owner's decision, never yours.** Propose; don't deploy.
- Commit per unit of work, with a clear message, so any single change can be reverted.

## Permission tiers — latitude depends on the type of work

**Tier 1 — Editing an existing page's copy** (currently only `terms.astro`): **content only.**
- Edit the visible words in the HTML body. Preserve every surrounding tag, class, and attribute exactly — including inline wrappers like `<span class="value-em">…</span>`. The words change; the markup does not.
- Never edit a `<style is:global>` block or `src/styles/global.css`.
- These pages already have good design. Do not restyle them.

**Tier 2 — Integrating a NEW or REPLACEMENT page** (`index`, `values`, `creations`, `careers`, `media`, `contact`): **the page is authored elsewhere and handed to you as a finished `.astro` file. Place it, wire the route, verify it builds — do not originate or alter its design.**
- Drop the provided file into `src/pages/`, confirm it imports `Base` and builds cleanly on `npm run dev`.
- For a **replacement**: the provided file replaces the existing `src/pages/<name>.astro` in full. Before replacing, diff the `<style is:global>` block of the new file against the old — it must be identical. If it isn't, stop and flag; that means the handoff touched design and needs Tier 3 sign-off. Orphaned CSS rules inside the preserved style block are intentional — do not strip them.
- For the **new** `contact.astro`: it was derived from the `consultation.astro` draft, so diff its style block against *that* file if it exists; otherwise just confirm it imports `Base` and builds.
- If something doesn't render, report what and where — don't redesign it. Small fixes to make it build are fine; restyling is not.
- New-page design happens outside the repo, with the full design system in view, precisely so you never have to freelance design in-repo.

**Tier 3 — Redesigning an existing page's layout, OR editing `global.css` / shared tokens / `Base.astro` / `Nav.astro` / `Footer.astro` design:** **explicit per-change sign-off + a before/after preview, every time.**
- A shared-system change ripples across every page. Never casual. Propose, show the preview, wait for an explicit yes.
- Three sanctioned text-only exceptions, listed in the work order: repointing CTA `href` values, changing the CTA button label text in `Nav.astro` and `Footer.astro`, and updating the default `description` string in `Base.astro`. Change the string only, nothing else.

## Always — regardless of tier
- **Propose before editing.** Show a diff or short summary and wait for approval before changing files. No silent rewrites.
- One page / one unit at a time.
- Review the diff *and* the rendered preview before committing.
- A Tier-1 diff should be text-only; if it touches a CSS class, tag, or image, you've crossed a tier — stop and flag it.
- Check every edit against **Public-copy rules** above before proposing it.

## How the Astro code is organized
- Each page is `src/pages/<name>.astro`: frontmatter import → one `<style is:global>` block (all CSS) → HTML body (the copy).
- Shared chrome and design live outside the pages: `src/layouts/Base.astro`, `src/components/Nav.astro`, `src/components/Footer.astro`, and design tokens in `src/styles/global.css`.
- Nav (desktop + mobile) and Footer link: Home, Values (footer label "About & Values"), Creations, Media, Careers, and a CTA button. The CTA becomes "Request a Walkthrough" → `/contact` in item 3.

## First task (read-only — change nothing)
Map where each page's copy lives, confirm the component/layout structure, and note how the `/consult` quiz (`consult.astro` + `src/scripts/`) is wired. Report back. Do not edit on this pass.

## Work order (after recon, one item at a time, each gated on approval)

Every public page arrives as a finished `.astro`. Order matters: the site must never be in a state where the primary CTA 404s, so `contact` lands before anything points at it, and `/consult` is removed last.

1. **Place `contact.astro` at `src/pages/contact.astro`. Tier 2 (new).** Confirm it imports `Base` and builds. Its form action is the placeholder `YOUR_CONTACT_FORM_ID` — **stop and ask the owner for the real Formspree ID** before this item is considered done. Do not reuse the Careers form ID `xaqdrpnl`.

2. **Replace the five public pages. Tier 2 (replacement), one file per commit, in this order:** `index.astro`, `values.astro`, `creations.astro`, `careers.astro`, `media.astro`. For each: diff the style block against the current file (must be identical), replace, `npm run dev`, click through, commit. All five already point their CTAs at `/contact`. `media.astro` contains the placeholder `YOUR_YOUTUBE_CHANNEL_URL` — ask the owner for the channel URL; if there isn't one yet, leave the placeholder and flag it in your report rather than inventing a link.

3. **Repoint and relabel the shared CTAs. Tier 3 text-only exception.**
   - `src/components/Nav.astro`: desktop CTA and mobile-menu CTA — `href` `/consult` → `/contact`; label "Begin Consultation" → "Request a Walkthrough".
   - `src/components/Footer.astro`: contact link — `href` `/consult` → `/contact`; label "Begin Consultation" → "Request a Walkthrough".
   - Then `grep -rn 'href="/consult"' src/` — expected result: **zero** matches outside `consult.astro` itself. Report the count.

4. **Update the `Base.astro` default `description`. Tier 3 text-only exception.** Replace the "residential and commercial properties" sentence with: `Whole-property regenerative land stewardship for estates in Chester County, PA. Soil-first, chemical-free, one-year agreements — every property documented from the first visit.` String only.

5. **Edit `terms.astro`. Tier 1.** The "Consultation Estimates and Proposals" section references Quick Quote and Full Discovery forms and generated estimates. Rewrite that section's text to say: the walkthrough is complimentary and produces no report or pricing; the Soil & Site Assessment is a paid deliverable (a written report) whose fee is credited against a signed stewardship agreement; program scope and pricing are set only in a signed agreement. Words only; keep every tag.

6. **Delete the retired routes and their engine.** Only after items 1–3 are verified:
   - `src/pages/consult.astro`, `src/pages/_consult.astro.backup`, and `src/pages/consultation.astro` if present.
   - The entire `src/scripts/` folder (`calculations.js`, `state.js`, `filtering.js`, `email-builder.js`, `form-submission.js`, `event-handlers.js`, `navigation.js`). Grep for every import first and report what you find; nothing outside `consult.astro` should reference them.
   - `npm run dev` one more time; click every CTA on every page including the mobile menu.

7. **Final repo-wide check.** `grep -rni` for: `farm`, `pasture`, `hay`, `livestock`, `commercial`, `condo`, `HOA`, `free consultation`, `free estimate`, `no commitment`, `no obligation`, `Begin Consultation`, `/consultation`. Expected: zero hits in `src/` except the hero background CSS in `creations.astro` (an Unsplash URL, which is fine). Report every hit.

8. **`/projects` — deferred.** Do not create. It will be authored and handed over when there are real projects to show.

## Stack constraints
- Preserve the existing Astro build and GitHub Pages setup. Add no dependencies without sign-off.
- No Google or Microsoft dependencies. Forms use Formspree; email is Zoho. Keep it that way.
