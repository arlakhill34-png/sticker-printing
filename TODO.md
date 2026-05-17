# TODO - Sticker preview/print refactor

- [x] Understand current sticker implementation and locate truncation + spacing issues.
- [x] Approved redesign plan for Sticker modes and layout reflow.

## Step list (in progress)
- [ ] Implement Sticker redesign in `src/components/sticker/Sticker.tsx`
  - [x] Remove ALL truncation behavior (ellipsis/nowrap/hidden text clipping)
  - [x] Add wrap-safe text styles (word-break/overflow-wrap/white-space normal/line-height)
  - [x] Replace layout with explicit vertical row stack (company, email, PID, EXIM, MRP)
  - [x] Remove EXIM↔MRP gap fragile spacing; use natural reflow/controlled gap
  - [x] Use conditional rendering for EXIM (no visibility hacks)
  - [x] Increase preview width to ~420–480px and ensure responsive/clipping-free
  - [x] Keep print exact 36mm × 30mm in print mode
  - [x] Ensure typography hierarchy and centered premium appearance
- [ ] Verify build/dev output
- [ ] Validate long-text wrapping and responsive preview
- [ ] Validate print preview accuracy (36mm × 30mm) and no overlaps

