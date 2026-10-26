# Security policy — Vazheno

## Current security status

Vazheno is a client-side React/Vite application. At the time of this document, learning progress is stored in the current browser's `localStorage`; there is not yet a server-backed account system. Local browser storage is not a secure account database and can be edited by the device owner. Do not store passwords, authentication tokens, or sensitive personal data in it.

## Security principles for future accounts

- Passwords must be handled by a maintained authentication provider or a well-maintained server-side authentication library and stored only as a modern password hash (never plaintext or reversible encryption).
- Authentication secrets, service-role keys, database credentials, and signing keys must never be placed in frontend code, Vite `VITE_*` variables, or committed to Git.
- Every private data read/write must be authorized server-side. A user-supplied user ID is not proof of authorization.
- Database policies must default to deny and explicitly restrict each user's records to that authenticated user. Admin access must be separate and least-privileged.
- Use verified email addresses, single-use expiring password-reset links, secure session handling, rate limits, and multi-factor authentication for administrators.
- Use HTTPS, secure response headers, dependency updates, backups, and regular security tests.
- Collect the minimum personal data needed and publish a clear privacy notice before public registration.

## Reporting a vulnerability

Please do not publish exploitable details in a public issue. Contact the repository owner privately with a description, impact, and reproduction steps. Do not include real user data or passwords in reports.

## Important limitation

No web application can be guaranteed impossible to compromise. Security needs to be validated against the deployed system, hosting configuration, authentication provider, and database policies—not only the frontend source code.
