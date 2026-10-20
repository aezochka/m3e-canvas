# Mobile editor

The phone layout uses the same document, component catalog, Inspector, FrameInspector,
LayersPanel, theme panels and preview as desktop. It no longer replaces the document
with a buttons-only seed or forces phone-screen/select mode at a breakpoint.

## Controls

- **Parts / +:** tap any component to insert once. Swipe the catalog to scroll; this
  never inserts or drags a component. Desktop palette dragging is unchanged.
- **Choose screen:** add/select a screen and open its full inspector. Rename it,
  switch phone/desktop dimensions, change background/length, tidy, set swipe actions,
  duplicate/delete, edit description, copy its prompt or save a real PNG.
- **Edit:** the same Design/Trigger panel as desktop, including sizes, alignment,
  actions, transition destinations, behavior notes and item-specific controls.
- **Tools:** select/hand mode, multiselect, copy/paste, group/ungroup, zoom, fit,
  preview, layers, full color/shape/type/motion settings, AI and project actions.
- **Select:** drag a component or screen bezel/label. Empty canvas pans on touch.
  **Hand:** drag anywhere to pan without editing. Two fingers pan/zoom; the second
  finger cancels item/frame/resize gestures rather than starting another edit.
- **Multi-select:** tap multiple items, then Group or edit alignment. Grouped parts
  move as one; Ungroup separates them. Layer rows and lock/reorder handles work by touch.
- **Prompt:** edit text directly, select Android/Web, expand Project for app name/brief,
  or the screen outline to jump to a section. Copy/reset use the generated shared prompt.
  Phones do not open the desktop three-column editing cover.
- **Project:** JSON save/open, share link/AI draft entry, clear. Import is confirmed and
  undoable. AI settings are available from both Tools and the share dialog.
- Undo/redo, preview and fit remain in the top row. Panels respect safe-area insets
  and the visual viewport while typing; Escape or the top handle button closes a sheet.

## Reproducing verification

```sh
npm ci
npm run typecheck
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:mobile
```

`test:mobile` serves the real static production output on an ephemeral loopback port
and runs five Playwright browser scripts. Artifacts go to ignored `test-results/`.
`M3E_URL` can point the suite at a deployed origin/base path. Chromium is not a runtime
dependency: the shipped app is still entirely static and browser-local.

Verified in Chromium touch emulation:
- 320/390/768px phone/tablet geometry and 1280px desktop regression; reduced motion.
- Catalog one-tap insertion and native swipe without accidental insertion.
- Shared inspectors, screen creation/name/preset/height and actual PNG bytes.
- Item drag, screen label drag, hand pan, two-finger pinch without document mutation.
- Multiselect/group/ungroup, copy/paste and undo/redo, layer lock and touch reordering.
- All theme and AI configuration panels; share dialog → AI configuration.
- Navigation target editing, editable prompt/platform/metadata and clipboard contents.
- JSON download/import, confirmation and persisted blank-canvas mode after reload.
- Preview open/close and keyboard viewport sizing (synthetic visualViewport fixture).

## Boundaries

- No physical iPhone/Android device or Safari/WebKit run was performed. Soft keyboard
  behavior has a deterministic browser regression test, not a hardware certification.
- AI configuration and draft entry points are wired to the original provider logic;
  no paid third-party generation request was made and no API key is bundled.
- Browser clipboard/download APIs still require browser permissions and a secure origin.
- Existing upstream dependency audit reports three high-severity production dependency
  advisories. Dependency upgrades are separate from this mobile port; deployment is a
  static export, not a running Next server. Do not expose a development server publicly.
- Independent model review could not complete (quota/provider errors); claims above
  are based on executed tests and manual code inspection, not an external sign-off.
