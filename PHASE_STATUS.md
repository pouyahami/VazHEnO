# Vazheno rebuild status (2026-11-03)

## Phase 1 stabilization — completed in isolated draft PR
- Created isolated branch: `phase1-stabilization-2026-11-03`
- Opened draft PR #19; not merged and not deployed.
- Progress sync now ignores stale Firestore responses after account switches.
- Delayed progress saves are bound to the account that created them; they cannot follow a later account switch.
- Cloud writes are blocked until the active account's cloud read succeeds, preventing default/empty progress from overwriting remote progress after a read failure.
- Firestore read errors now propagate to the caller instead of being converted into a "new account" result.
- Fixed TypeScript inference issues in DailyLearning and ExpandedLessons exposed by CI.
- CI now runs typecheck, lesson-content validation, and production build via `npm run ci`.
- Removed the duplicate pull-request build trigger; the main build workflow covers PR checks.
- Added a targeted override to patched `@grpc/grpc-js` 1.14.7; latest security audit reports 0 vulnerabilities.
- Latest CI: typecheck, content validation, and production build passed.
- Latest production build still warns that the main JS bundle is about 880 kB minified; code splitting is a follow-up optimization.

## Done in earlier batch
- Backup branch: backup-2026-11-03-pre-rebuild-audit
- Shared types.ts
- Firestore progress sync (load/merge/save) + firestore.rules
- Content validation script (structural)
- package.json scripts: typecheck, validate:content, ci
- Home page declutter + quick search
- Sticky header: font, theme, CEFR select (persisted)
- StageAssessment linked in nav/sidebar
- Local streak uses local calendar date
- Re-complete lesson does not inflate studiedToday

## Still incomplete (honest)
- ExtraLessons generative content not fully replaced with 240 unique hand-authored lessons
- Listening still browser TTS (no licensed real audio files in repo)
- Speaking similarity is not pronunciation scoring (no fake scores)
- Writing module still thin
- IELTS still lightweight workshop, not full timed official simulation
- No Vitest suite yet
- CSP connect-src remains broad https:
- No committed package-lock.json yet; dependency installation is not fully reproducible

## Owner actions required before production rollout
1. Deploy firestore.rules in Firebase console and verify the rules in the correct Firebase project.
2. Confirm VITE_FIREBASE_* environment variables on Cloudflare Pages.
3. Authorize vazheno.pages.dev in Firebase Auth authorized domains.
4. Review the draft PR and decide when to merge; merging may trigger the production deployment.
