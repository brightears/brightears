import assert from 'node:assert/strict';
import { after, beforeEach, test } from 'node:test';
import { PrismaClient } from '@prisma/client';
import { createAiGenerationHandlers, reserveGeneration, settleGeneration, type GenerationUser } from '../ai-generation-service';
import { AiGenerationError, AiProviderError } from '../ai-generation-policy';
import type { GenerateContentResult } from '../api/gemini-image-client';
import type { AiGenerationInput } from '../ai-generation-input';

// Destructive cleanup is permitted ONLY in this dedicated, local fixture DB.
// There is deliberately no DATABASE_URL fallback or optional/skip mode.
const fixtureUrl = process.env.AI_GENERATION_TEST_DATABASE_URL;
if (!fixtureUrl) throw new Error('AI_GENERATION_TEST_DATABASE_URL is required for integration tests');
const parsed = new URL(fixtureUrl);
if (parsed.protocol !== 'postgresql:' || parsed.hostname !== '127.0.0.1' || parsed.pathname !== '/ai_guards_test'
  || !(parsed.port === '55440' || (process.env.CI === 'true' && parsed.port === '5432')) || parsed.search !== '?schema=public') {
  throw new Error('Refusing integration tests outside the exact loopback ai_guards_test fixture');
}
const db = new PrismaClient({ datasources: { db: { url: fixtureUrl } } });
const other = new PrismaClient({ datasources: { db: { url: fixtureUrl } } });
const NOW = new Date('2026-09-11T12:00:00.000Z');
const OLD_MONTH = new Date('2026-08-11T12:00:00.000Z');
const NEXT_MONTH = new Date('2026-10-11T12:00:00.000Z');
const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aBl8AAAAASUVORK5CYII=';
const input: AiGenerationInput = { image: png, imageMimeType: 'image/png', contentType: 'EVENT_POSTER', artistName: 'ดีเจ Fixture', eventDate: '2026-12-31' };
const result: GenerateContentResult = { imageBase64: png, imageMimeType: 'image/png', caption: 'คืนนี้ Live music', hashtags: ['#BrightEars', '#ดนตรี'] };
const user = (id = 'fixture-user', role = 'CORPORATE'): GenerationUser => ({ id, role });
const request = () => new Request('http://fixture.invalid/api/ai/generate-content', { method: 'POST', body: JSON.stringify(input) });
const handlers = (who = user(), generate: () => Promise<GenerateContentResult> = async () => result, client = db, now = () => NOW) => createAiGenerationHandlers({ db: client, getCurrentUser: async () => who, generate, isConfigured: () => true, now });
const failed = { status: 'FAILED' as const, reason: 'rejected' as const, processingTimeMs: 12 };
const completed = { status: 'COMPLETED' as const, result, processingTimeMs: 12 };
const account = (id = 'fixture-user', balance = 12, freeMonthlyResetAt = NOW) => db.creditAccount.create({ data: { userId: id, balance, freeMonthlyResetAt } });
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(done => { resolve = done; }); return { promise, resolve }; }
const rejectsStatus = (status: number) => (error: unknown) => error instanceof AiGenerationError && error.status === status;
async function seedAttempts(count: number, who: string, createdAt = NOW, status: 'FAILED' | 'COMPLETED' = 'FAILED') {
  await db.aIGeneration.createMany({ data: Array.from({ length: count }, () => ({ userId: who, contentType: 'EVENT_POSTER', status, createdAt, hashtags: [] })) });
}

beforeEach(async () => {
  await db.creditTransaction.deleteMany();
  await db.aIGeneration.deleteMany();
  await db.creditAccount.deleteMany();
});
after(async () => { await Promise.all([db.$disconnect(), other.$disconnect()]); });

test('one credit and two clients admit exactly one provider call; provider work does not hold the global transaction', async () => {
  await account(undefined, 1);
  const entered = deferred<void>(), finish = deferred<GenerateContentResult>();
  let calls = 0;
  const first = handlers(user(), async () => { calls++; entered.resolve(); return finish.promise; }).POST(request());
  await entered.promise;
  assert.equal((await db.creditAccount.findUniqueOrThrow({ where: { userId: user().id } })).balance, 0);
  const second = await handlers(user(), async () => { calls++; return result; }, other).POST(request());
  assert.equal(second.status, 409);
  // A distinct user can inspect credits while the first provider call waits.
  assert.equal((await handlers(user('other-user'), undefined, other).GET()).status, 200);
  finish.resolve(result);
  const response = await first;
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.imageDataUrl, `data:image/png;base64,${png}`);
  assert.equal(body.caption, result.caption);
  assert.deepEqual(body.hashtags, result.hashtags);
  assert.deepEqual(body.usage, { balance: 0, freeUsed: 1, freeLimit: 12 });
  assert.equal(calls, 1);
  assert.equal(await db.aIGeneration.count(), 1);
  assert.equal(await db.creditTransaction.count({ where: { amount: -1 } }), 1);
  assert.equal(await db.creditTransaction.count({ where: { amount: 1 } }), 0);
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
});

test('concurrent first-account reads initialize once; concurrent admission reserves only once', async () => {
  const reads = await Promise.all([handlers().GET(), handlers(user(), undefined, other).GET()]);
  assert.deepEqual(await Promise.all(reads.map(async response => (await response.json()).credits.balance)), [12, 12]);
  assert.equal(await db.creditAccount.count(), 1);
  const reservations = await Promise.allSettled([reserveGeneration(db, user(), input, () => NOW), reserveGeneration(other, user(), input, () => NOW)]);
  assert.equal(reservations.filter(value => value.status === 'fulfilled').length, 1);
  const rejected = reservations.find(value => value.status === 'rejected') as PromiseRejectedResult;
  assert.equal(rejectsStatus(409)(rejected.reason), true);
  assert.equal((await db.creditAccount.findUniqueOrThrow({ where: { userId: user().id } })).balance, 11);
});

test('concurrent first-account POSTs create one account and one reservation', async () => {
  const reservations = await Promise.allSettled([reserveGeneration(db, user(), input, () => NOW), reserveGeneration(other, user(), input, () => NOW)]);
  assert.equal(reservations.filter(value => value.status === 'fulfilled').length, 1);
  assert.equal(await db.creditAccount.count(), 1);
  assert.equal(await db.aIGeneration.count(), 1);
  assert.equal((await db.creditAccount.findUniqueOrThrow({ where: { userId: user().id } })).balance, 11);
});

test('rollover happens once and preserves independent grants, purchased totals and legacy balances', async () => {
  await db.creditAccount.create({ data: { userId: user().id, balance: 40, totalPurchased: 100, totalEarnedReferrals: 15, totalUsed: 80, freeMonthlyUsed: 8, freeMonthlyResetAt: OLD_MONTH } });
  await Promise.all([
    handlers().GET(), handlers(user(), undefined, other).GET(),
    other.creditAccount.update({ where: { userId: user().id }, data: { balance: { increment: 7 }, totalEarnedReferrals: { increment: 7 } } }),
  ]);
  const saved = await db.creditAccount.findUniqueOrThrow({ where: { userId: user().id } });
  assert.equal(saved.balance, 59);
  assert.equal(saved.freeMonthlyUsed, 0);
  assert.equal(saved.freeMonthlyResetAt.toISOString(), NOW.toISOString());
  assert.equal(saved.totalPurchased, 100);
  assert.equal(saved.totalEarnedReferrals, 22);
  assert.equal(saved.totalUsed, 80);
  await account('legacy-three', 3);
  assert.equal((await (await handlers(user('legacy-three')).GET()).json()).credits.balance, 3);
});

test('POST rollover and concurrent GET cannot add entitlement twice', async () => {
  await account(undefined, 3, OLD_MONTH);
  const [reservation, response] = await Promise.all([reserveGeneration(db, user(), input, () => NOW), handlers(user(), undefined, other).GET()]);
  assert.ok(reservation.generationId);
  assert.equal(response.status, 200);
  assert.equal((await db.creditAccount.findUniqueOrThrow({ where: { userId: user().id } })).balance, 14);
});

test('zero-credit requests call no provider and create no generation or debit', async () => {
  await account(undefined, 0);
  let calls = 0;
  const response = await handlers(user(), async () => { calls++; return result; }).POST(request());
  assert.equal(response.status, 402);
  assert.deepEqual((await response.json()).usage, { balance: 0, freeUsed: 0, freeLimit: 12 });
  assert.equal(calls, 0);
  assert.equal(await db.aIGeneration.count(), 0);
  assert.equal(await db.creditTransaction.count(), 0);
});

test('twelve failed attempts consume the user allowance despite refunds; thirteenth makes no provider call', async () => {
  await account(undefined, 1);
  let calls = 0;
  const api = handlers(user(), async () => { calls++; throw new AiProviderError('rejected'); });
  for (let i = 0; i < 12; i++) assert.equal((await api.POST(request())).status, 422);
  assert.equal((await api.POST(request())).status, 429);
  assert.equal(calls, 12);
  assert.equal(await db.aIGeneration.count({ where: { status: 'FAILED' } }), 12);
  const saved = await db.creditAccount.findUniqueOrThrow({ where: { userId: user().id } });
  assert.equal(saved.balance, 1);
  assert.equal(saved.totalUsed, 0);
  assert.equal(saved.freeMonthlyUsed, 0);
  assert.equal(await db.creditTransaction.count({ where: { amount: 1 } }), 12);
});

test('twenty-four attempts globally include failures and stop further users', async () => {
  let calls = 0;
  const generate = async () => { calls++; throw new AiProviderError('quota'); };
  for (const id of ['one', 'two']) for (let i = 0; i < 12; i++) assert.equal((await handlers(user(id), generate).POST(request())).status, 429);
  const stopped = await handlers(user('three'), generate).POST(request());
  assert.equal(stopped.status, 429);
  assert.match((await stopped.json()).error, /24-hour/);
  assert.equal(calls, 24);
  assert.equal(await db.aIGeneration.count(), 24);
  assert.equal(await db.creditAccount.count({ where: { userId: 'three' } }), 0);
});

test('global admission is serialized across two clients at the final available slot', async () => {
  await seedAttempts(23, 'previous-user');
  let calls = 0;
  const provider = async () => { calls++; throw new AiProviderError('rejected'); };
  const responses = await Promise.all([handlers(user('one'), provider).POST(request()), handlers(user('two'), provider, other).POST(request())]);
  assert.deepEqual(responses.map(value => value.status).sort(), [422, 429]);
  assert.equal(calls, 1);
  assert.equal(await db.aIGeneration.count(), 24);
});

test('rolling window includes its exact boundary and ignores older completed/failed attempts', async () => {
  const boundary = new Date(NOW.getTime() - 86_400_000);
  await seedAttempts(12, user().id, boundary);
  await assert.rejects(reserveGeneration(db, user(), input, () => NOW), rejectsStatus(429));
  await db.aIGeneration.updateMany({ data: { createdAt: new Date(boundary.getTime() - 1) } });
  assert.ok((await reserveGeneration(db, user(), input, () => NOW)).generationId);
});

test('FAILED settlement is idempotent across concurrent clients and refunds only one reserved credit', async () => {
  await account(undefined, 10);
  const reservation = await reserveGeneration(db, user(), input, () => NOW);
  const settled = await Promise.all([settleGeneration(db, reservation, failed), settleGeneration(other, reservation, failed)]);
  assert.equal(settled.filter(value => value.changed).length, 1);
  assert.equal((await db.creditAccount.findUniqueOrThrow({ where: { userId: user().id } })).balance, 10);
  assert.equal(await db.creditTransaction.count({ where: { relatedGenerationId: reservation.generationId, amount: 1 } }), 1);
  const lateSuccess = await settleGeneration(db, reservation, completed);
  assert.equal(lateSuccess.status, 'FAILED');
  assert.equal(lateSuccess.changed, false);
});

test('COMPLETED settlement cannot be refunded or charged a second time', async () => {
  await account(undefined, 10);
  const reservation = await reserveGeneration(db, user(), input, () => NOW);
  const settled = await Promise.all([settleGeneration(db, reservation, completed), settleGeneration(other, reservation, completed)]);
  assert.equal(settled.filter(value => value.changed).length, 1);
  assert.equal((await settleGeneration(db, reservation, failed)).status, 'COMPLETED');
  const saved = await db.creditAccount.findUniqueOrThrow({ where: { userId: user().id } });
  assert.equal(saved.balance, 9);
  assert.equal(saved.totalUsed, 1);
  assert.equal(saved.freeMonthlyUsed, 1);
  assert.equal(await db.creditTransaction.count({ where: { amount: 1 } }), 0);
});

test('old PENDING and legacy unreserved rows fail closed without automatic refunds', async () => {
  await account(undefined, 3);
  const legacy = await db.aIGeneration.create({ data: { userId: user().id, contentType: 'EVENT_POSTER', status: 'PENDING', createdAt: OLD_MONTH, hashtags: [] } });
  await assert.rejects(reserveGeneration(db, user(), input, () => NOW), rejectsStatus(409));
  await assert.rejects(settleGeneration(db, { generationId: legacy.id, userId: user().id }, failed), rejectsStatus(409));
  assert.equal((await db.creditAccount.findUniqueOrThrow({ where: { userId: user().id } })).balance, 3);
  assert.equal(await db.creditTransaction.count(), 0);
});

test('unknown transport outcome holds the reservation and blocks blind retries without leaking provider details', async () => {
  await account(undefined, 5);
  let calls = 0;
  const api = handlers(user(), async () => { calls++; throw new Error('fixture-source-image-and-secret-provider-url'); });
  const response = await api.POST(request());
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.match(body.error, /unknown and needs review/);
  assert.match(body.error, /Do not submit/);
  assert.doesNotMatch(body.error, /fixture-source|actively|being reviewed/);
  assert.equal((await api.POST(request())).status, 409);
  assert.equal(calls, 1);
  const saved = await db.aIGeneration.findFirstOrThrow();
  assert.equal(saved.status, 'PENDING');
  assert.equal(saved.errorMessage, 'provider_outcome_unknown');
  assert.equal(saved.sourceImageUrl, null);
  assert.equal((await db.creditAccount.findUniqueOrThrow({ where: { userId: user().id } })).balance, 4);
  assert.equal(await db.creditTransaction.count({ where: { amount: 1 } }), 0);
});

test('known provider configuration errors return sanitized 503 and refund the reserved credit once', async () => {
  await account(undefined, 3);
  const response = await handlers(user(), async () => { throw new AiProviderError('unavailable'); }).POST(request());
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.doesNotMatch(body.error, /different photo|key|API_KEY/);
  assert.equal(body.usage.balance, 3);
  assert.equal((await db.aIGeneration.findFirstOrThrow()).status, 'FAILED');
  assert.equal(await db.creditTransaction.count({ where: { amount: 1 } }), 1);
});

test('a successful provider result followed by settlement-write failure stays PENDING, held, and cannot run again', async () => {
  await account(undefined, 2);
  // Fail a late write inside the REAL transaction, after status/counter writes.
  // This verifies PostgreSQL rolls all completion writes back together.
  const failingDb = new Proxy(db, { get(target, property) {
    if (property === '$transaction') return (work: (tx: unknown) => Promise<unknown>, options: unknown) => target.$transaction(async tx => work(new Proxy(tx, { get(transaction, key) {
      if (key === 'creditTransaction') return new Proxy(transaction.creditTransaction, { get(delegate, action) { if (action === 'update') return async () => { throw new Error('fixture-settlement-write-failure'); }; return Reflect.get(delegate, action); } });
      return Reflect.get(transaction, key);
    } })), options as { maxWait: number; timeout: number });
    return Reflect.get(target, property);
  } }) as PrismaClient;
  let calls = 0;
  const api = handlers(user(), async () => { calls++; return result; }, failingDb);
  const response = await api.POST(request());
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.doesNotMatch(body.error, /fixture-settlement/);
  assert.match(body.error, /could not be finalized and needs review/);
  assert.match(body.error, /Do not submit/);
  assert.equal((await handlers(user(), async () => { calls++; return result; }).POST(request())).status, 409);
  assert.equal(calls, 1);
  const generation = await db.aIGeneration.findFirstOrThrow();
  assert.equal(generation.status, 'PENDING');
  assert.equal(generation.caption, null);
  const saved = await db.creditAccount.findUniqueOrThrow({ where: { userId: user().id } });
  assert.equal(saved.balance, 1);
  assert.equal(saved.totalUsed, 0);
  assert.equal(saved.freeMonthlyUsed, 0);
  assert.equal(await db.creditTransaction.count({ where: { amount: 1 } }), 0);
});

test('month rollover during a pending request preserves the new usage period and additive balance on success/failure', async () => {
  for (const [id, outcome, expectedBalance, expectedUsed] of [['success', completed, 16, 1], ['failure', failed, 17, 0]] as const) {
    await account(id, 5);
    const reservation = await reserveGeneration(db, user(id), input, () => NOW);
    assert.equal((await handlers(user(id), undefined, other, () => NEXT_MONTH).GET()).status, 200);
    await settleGeneration(db, reservation, outcome);
    const saved = await db.creditAccount.findUniqueOrThrow({ where: { userId: id } });
    assert.equal(saved.balance, expectedBalance);
    assert.equal(saved.totalUsed, expectedUsed);
    assert.equal(saved.freeMonthlyUsed, 0);
    assert.equal(saved.freeMonthlyResetAt.toISOString(), NEXT_MONTH.toISOString());
  }
});

test('reservation ownership and current roles remain enforced without exposing another user history', async () => {
  const reservation = await reserveGeneration(db, { id: 'artist-user', role: 'ARTIST', artist: { id: 'fixture-artist' } }, input, () => NOW);
  assert.equal((await db.aIGeneration.findUniqueOrThrow({ where: { id: reservation.generationId } })).artistId, 'fixture-artist');
  await account('other-user', 5);
  await assert.rejects(settleGeneration(db, { ...reservation, userId: 'other-user' }, failed), rejectsStatus(409));
  const history = await (await handlers(user('other-user')).GET()).json();
  assert.deepEqual(history.recentGenerations, []);
  assert.equal((await db.creditAccount.findUniqueOrThrow({ where: { userId: 'other-user' } })).balance, 5);
});
