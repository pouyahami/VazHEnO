# Vazheno rebuild status (2026-11-03)

## Done this batch
- Backup branch: backup-2026-11-03-pre-rebuild-audit
- Shared types.ts
- Firestore progress sync (load/merge/save) + firestore.rules
- Content validation script (structural)
- package.json scripts: typecheck, validate:content, ci
- Home page declutter + quick search
- Sticky header: font, theme, CEFR select (persisted)
- handleUserChange wires cloud progress merge
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

## Owner actions required
1. Deploy firestore.rules in Firebase console
2. Confirm VITE_FIREBASE_* env on Cloudflare Pages
3. Authorize vazheno.pages.dev in Firebase Auth domains
