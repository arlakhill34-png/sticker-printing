# TODO

- [x] Update sticker sizing to be user-controllable in `src/routes/index.tsx` (widthMm/heightMm inputs with mm, min/max, validation, defaults 36×30).
- [ ] Pass `widthMm` and `heightMm` props into `<Sticker mode="preview" ... />` and `<Sticker mode="print" ... />`.
- [ ] Refactor `src/components/sticker/Sticker.tsx`:
  - [ ] Implement a shared proportional sizing engine derived from widthMm/heightMm.
  - [ ] Use dynamic typography + spacing + padding in BOTH preview and print.
  - [ ] Ensure wrapping rules remain (word-break/overflow-wrap/whiteSpace normal), left alignment, no clipping.
- [ ] Update `src/styles.css` print media rules:
  - [ ] Remove/stop hardcoded `36mm × 30mm` for `[data-sticker-mode="print"]`.
  - [ ] Apply sizing using CSS variables set via inline styles/props, so each sticker prints at the selected mm dimensions.
- [ ] Ensure print output reflows correctly for variable sticker sizes (avoid overlap/gaps).
- [ ] Ensure preview remains a realistic aspect-ratio simulation (px sizing derived from mm dimensions).
- [ ] Run `npm run build` and verify TS/formatting.
- [ ] Manually sanity-check browser print preview for multiple sizes (e.g., 50×40, 25×20).
