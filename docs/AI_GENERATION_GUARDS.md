# DJ AI Studio credit and attempt controls

The authenticated image tool reserves a credit before calling Gemini. The old, unmounted Listening Room endpoint returns HTTP 410 without parsing a body or calling a provider. No database migration is required for these controls.

## Admission and credits

- Preserve existing balances, purchased/referral credits and the additive allowance of 12 credits on a new server-calendar month. GET usage now applies the same atomic monthly reset as POST, so the displayed balance is current.
- Allow one PENDING generation per user. Count all generation statuses toward rolling limits of 12 attempts per user and 24 globally over 24 hours. These are attempt limits, not a promised currency-cost ceiling.
- Serialize admission in a short PostgreSQL transaction with a shared advisory lock. Initialize/reset the account with atomic increments, conditionally decrement a positive balance, and create PENDING plus its linked USAGE(-1) reservation together. Provider work happens after commit, outside the transaction.
- On completion, settle the generation, usage counters and reservation description atomically. On a definitive failure, transition once to FAILED and add one linked USAGE(+1) reversal. A second settlement cannot repeat a debit or refund. Failed attempts remain in the rolling counts.
- A legacy PENDING row without a linked reservation debit cannot be automatically refunded. Existing account-provisioning and referral-award routes are outside this change; generation admission limits still apply regardless of how a balance was obtained.

## Unknown results

The provider transport has a 45-second abort deadline. An aborted connection does not prove that remote work stopped. An unknown result, or a database failure after provider success, keeps the reservation PENDING and blocks another generation for that user. The response asks the user to check history or contact Bright Ears; it does not claim a background reviewer is already acting.

For recovery, inspect the specific user's generation, its linked reservation and any authoritative provider result. Use the conditional settlement helper only for a substantiated final outcome. Never clear PENDING, delete attempts, issue an unlinked balance adjustment or retry provider work merely because time elapsed. There is no public settlement/retry endpoint. A missing or invalid provider key is a separate configuration issue; a successful build or stubbed generation test does not establish live generation availability.

## Focused verification

`npm run test:agency` covers the retained agency projections/calendar/export rules and closed conversation endpoint. `npm run test:ai` covers request guards, SDK transport classification and real-PostgreSQL reservation/settlement concurrency with a counted stub provider.

The integration suite requires a disposable fixture database. Its connection guard permits only `127.0.0.1:55440/ai_guards_test` locally, or `127.0.0.1:5432/ai_guards_test` with `CI=true`. Never point it at an operational database. Example local command, after creating and applying the current schema to that disposable database:

```sh
AI_GENERATION_TEST_DATABASE_URL='postgresql://fixture@127.0.0.1:55440/ai_guards_test?schema=public' npm run test:ai
```

CI creates PostgreSQL 15 for these tests. Production builds generate Prisma types but do not push schemas, seed data or call an AI provider. Request validation counts streamed bytes before parsing and checks supported image headers, canonical base64, dates and bounded text; it is not a full image-decoder or content-moderation service.
