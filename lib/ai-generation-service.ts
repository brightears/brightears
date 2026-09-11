import type { Prisma, PrismaClient, CreditAccount } from '@prisma/client';
import type { GenerateContentInput, GenerateContentResult } from './api/gemini-image-client';
import { readGenerationInput, type AiGenerationInput } from './ai-generation-input';
import { AiGenerationError, AiProviderError, FREE_MONTHLY_LIMIT, GLOBAL_ATTEMPTS_PER_DAY, USER_ATTEMPTS_PER_DAY, type GenerationUsage } from './ai-generation-policy';

export type GenerationUser = { id: string; role: string; artist?: { id: string } };
type Clock = () => Date;
export type Reservation = { generationId: string; userId: string };
const DAY_MS = 86_400_000;
const ADMISSION_LOCK = 783441103;
const headers = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex' };

// Preserve the existing server-calendar-month entitlement policy.
function sameMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}
function usage(account: CreditAccount): GenerationUsage {
  return { balance: account.balance, freeUsed: account.freeMonthlyUsed, freeLimit: FREE_MONTHLY_LIMIT };
}
async function locked<T>(db: PrismaClient, work: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  return db.$transaction(async tx => {
    // Shared across processes; counts and PENDING creation cannot race.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${ADMISSION_LOCK})`;
    return work(tx);
  }, { maxWait: 5_000, timeout: 5_000 });
}
async function accountForPeriod(tx: Prisma.TransactionClient, userId: string, now: Date) {
  // The no-op increment also locks this row. Never replace concurrent
  // purchase/referral increments with a balance read from an earlier snapshot.
  let account = await tx.creditAccount.upsert({
    where: { userId },
    create: { userId, balance: FREE_MONTHLY_LIMIT, freeMonthlyUsed: 0, freeMonthlyResetAt: now },
    update: { balance: { increment: 0 } },
  });
  if (!sameMonth(account.freeMonthlyResetAt, now)) {
    account = await tx.creditAccount.update({ where: { id: account.id },
      data: { balance: { increment: FREE_MONTHLY_LIMIT }, freeMonthlyUsed: 0, freeMonthlyResetAt: now } });
  }
  return account;
}

export async function reserveGeneration(db: PrismaClient, user: GenerationUser, input: AiGenerationInput, clock: Clock = () => new Date()): Promise<Reservation> {
  return locked(db, async tx => {
    const now = clock();
    // Do not expire PENDING automatically: provider outcome can be unknown.
    // Legacy pending rows are held too; an owner must reconcile them explicitly.
    if (await tx.aIGeneration.findFirst({ where: { userId: user.id, status: 'PENDING' }, select: { id: true } })) {
      throw new AiGenerationError(409, 'A previous generation is pending or needs review. Check its history or contact Bright Ears before trying again.');
    }
    const createdAt = { gte: new Date(now.getTime() - DAY_MS) };
    const [perUser, global] = await Promise.all([
      tx.aIGeneration.count({ where: { userId: user.id, createdAt } }),
      tx.aIGeneration.count({ where: { createdAt } }),
    ]);
    if (perUser >= USER_ATTEMPTS_PER_DAY || global >= GLOBAL_ATTEMPTS_PER_DAY) {
      throw new AiGenerationError(429, 'The generation attempt allowance has been reached. Please try again after earlier attempts leave the 24-hour window.');
    }
    const account = await accountForPeriod(tx, user.id, now);
    const reserved = await tx.creditAccount.updateMany({ where: { id: account.id, balance: { gte: 1 } }, data: { balance: { decrement: 1 } } });
    if (reserved.count !== 1) throw new AiGenerationError(402, 'No credits remaining. Purchase more credits to continue generating content.', usage(account));
    const generation = await tx.aIGeneration.create({ data: {
      userId: user.id, artistId: user.role === 'ARTIST' ? user.artist?.id : undefined,
      contentType: input.contentType, artistName: input.artistName, venueName: input.venueName,
      eventDate: input.eventDate ? new Date(`${input.eventDate}T00:00:00.000Z`) : undefined,
      genre: input.genre, customPrompt: input.customPrompt, status: 'PENDING',
      modelUsed: 'gemini-2.5-flash-image', createdAt: now,
    } });
    // This debit proves reservation. A legacy PENDING row has no debit and must
    // never receive an automatic refund merely because its status is PENDING.
    await tx.creditTransaction.create({ data: { accountId: account.id, type: 'USAGE', amount: -1,
      description: 'Reserved credit for AI generation', relatedGenerationId: generation.id } });
    return { generationId: generation.id, userId: user.id };
  });
}

export async function settleGeneration(db: PrismaClient, reservation: Reservation, outcome:
  | { status: 'COMPLETED'; result: GenerateContentResult; processingTimeMs: number }
  | { status: 'FAILED'; reason: 'quota' | 'rejected' | 'unavailable'; processingTimeMs: number },
) {
  return locked(db, async tx => {
    const generation = await tx.aIGeneration.findFirst({ where: { id: reservation.generationId, userId: reservation.userId } });
    if (!generation) throw new AiGenerationError(409, 'Generation status could not be confirmed. Contact Bright Ears.');
    const account = await tx.creditAccount.findUnique({ where: { userId: reservation.userId } });
    if (!account) throw new AiGenerationError(409, 'Generation status could not be confirmed. Contact Bright Ears.');
    if (generation.status !== 'PENDING') return { status: generation.status, usage: usage(account), changed: false };
    const debit = await tx.creditTransaction.findFirst({ where: { accountId: account.id, relatedGenerationId: generation.id, type: 'USAGE', amount: -1 } });
    if (!debit) throw new AiGenerationError(409, 'This pending generation needs review by Bright Ears.');
    const processingTimeMs = Math.max(0, Math.min(2_147_483_647, Math.round(outcome.processingTimeMs)));
    const completed = outcome.status === 'COMPLETED';
    const transition = await tx.aIGeneration.updateMany({ where: { id: generation.id, userId: reservation.userId, status: 'PENDING' }, data: outcome.status === 'COMPLETED' ? {
      status: 'COMPLETED', errorMessage: null, processingTimeMs,
      generatedImageUrl: `data:${outcome.result.imageMimeType};base64,${outcome.result.imageBase64}`.substring(0, 500),
      caption: outcome.result.caption, hashtags: outcome.result.hashtags,
    } : { status: 'FAILED', errorMessage: outcome.reason, processingTimeMs } });
    if (transition.count !== 1) throw new AiGenerationError(409, 'Generation status changed. Check its history.');
    const updated = await tx.creditAccount.update({ where: { id: account.id }, data: completed ? {
      totalUsed: { increment: 1 },
      // An old request completing after GET applied a month reset must not
      // increment that new month's usage. Failures never decrement usage.
      ...(sameMonth(generation.createdAt, account.freeMonthlyResetAt) ? { freeMonthlyUsed: { increment: 1 } } : {}),
    } : { balance: { increment: 1 } } });
    if (completed) {
      await tx.creditTransaction.update({ where: { id: debit.id }, data: { description: `Generated ${generation.contentType.toLowerCase().replaceAll('_', ' ')}` } });
    } else {
      // Positive USAGE reverses a reservation, not a purchase/referral/admin grant.
      await tx.creditTransaction.create({ data: { accountId: account.id, type: 'USAGE', amount: 1,
        description: 'Refund of failed AI generation reservation', relatedGenerationId: generation.id } });
    }
    return { status: outcome.status, usage: usage(updated), changed: true };
  });
}

async function holdUnknown(db: PrismaClient, reservation: Reservation) {
  await db.aIGeneration.updateMany({ where: { id: reservation.generationId, userId: reservation.userId, status: 'PENDING' }, data: { errorMessage: 'provider_outcome_unknown' } });
}
function errorResponse(error: unknown) {
  if (error instanceof AiGenerationError) return Response.json({ error: error.message, ...(error.usage ? { usage: error.usage } : {}) }, { status: error.status, headers });
  return Response.json({ error: 'Generation is temporarily unavailable. Please check its history before trying again.' }, { status: 503, headers });
}

export function createAiGenerationHandlers(deps: {
  db: PrismaClient;
  getCurrentUser: () => Promise<GenerationUser | null>;
  generate: (input: GenerateContentInput) => Promise<GenerateContentResult>;
  isConfigured: () => boolean;
  now?: Clock;
}) {
  const clock = deps.now ?? (() => new Date());
  return {
    POST: async (request: Request) => {
      try {
        const user = await deps.getCurrentUser();
        if (!user) throw new AiGenerationError(401, 'Authentication required');
        if (!deps.isConfigured()) throw new AiGenerationError(503, 'AI generation is temporarily unavailable.');
        const input = await readGenerationInput(request);
        const reservation = await reserveGeneration(deps.db, user, input, clock);
        const start = clock().getTime();
        let result: GenerateContentResult;
        try {
          result = await deps.generate({ sourceImageBase64: input.image, sourceMimeType: input.imageMimeType,
            contentType: input.contentType, artistName: input.artistName, venueName: input.venueName,
            eventDate: input.eventDate, genre: input.genre, customPrompt: input.customPrompt });
        } catch (error) {
          if (!(error instanceof AiProviderError) || error.kind === 'unknown') {
            // Even if this safe metadata update fails, the reservation stays held.
            await holdUnknown(deps.db, reservation).catch(() => undefined);
            throw new AiGenerationError(503, 'The previous generation outcome is unknown and needs review. Your credit is held; check history or contact Bright Ears. Do not submit it again yet.');
          }
          const settlement = await settleGeneration(deps.db, reservation, { status: 'FAILED', reason: error.kind, processingTimeMs: clock().getTime() - start });
          if (settlement.status !== 'FAILED') throw new AiGenerationError(409, 'Generation status changed. Check its history.');
          throw new AiGenerationError(error.kind === 'quota' ? 429 : error.kind === 'rejected' ? 422 : 503,
            error.kind === 'rejected' ? 'The image could not be processed. Try a different photo.' : 'AI service is temporarily unavailable. Please try again later.', settlement.usage);
        }
        // Errors after provider success never enter the refund path. A failed
        // settlement transaction rolls back to the existing PENDING reservation.
        const processingTimeMs = Math.max(0, clock().getTime() - start);
        const settlement = await settleGeneration(deps.db, reservation, { status: 'COMPLETED', result, processingTimeMs }).catch(() => {
          throw new AiGenerationError(503, 'The previous generation could not be finalized and needs review. Your credit is held; check history or contact Bright Ears. Do not submit it again yet.');
        });
        if (settlement.status !== 'COMPLETED') throw new AiGenerationError(409, 'Generation status changed. Check its history.');
        return Response.json({ success: true, generationId: reservation.generationId,
          imageDataUrl: `data:${result.imageMimeType};base64,${result.imageBase64}`, caption: result.caption,
          hashtags: result.hashtags, processingTimeMs, usage: settlement.usage }, { headers });
      } catch (error) { return errorResponse(error); }
    },
    GET: async () => {
      try {
        const user = await deps.getCurrentUser();
        if (!user) throw new AiGenerationError(401, 'Authentication required');
        const account = await locked(deps.db, tx => accountForPeriod(tx, user.id, clock()));
        const recentGenerations = await deps.db.aIGeneration.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 10,
          select: { id: true, contentType: true, artistName: true, venueName: true, status: true, createdAt: true } });
        return Response.json({ credits: { balance: account.balance, totalPurchased: account.totalPurchased,
          totalUsed: account.totalUsed, freeMonthlyUsed: account.freeMonthlyUsed, freeMonthlyLimit: FREE_MONTHLY_LIMIT }, recentGenerations }, { headers });
      } catch (error) { return errorResponse(error); }
    },
  };
}
