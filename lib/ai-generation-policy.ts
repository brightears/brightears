export const FREE_MONTHLY_LIMIT = 12;
export const USER_ATTEMPTS_PER_DAY = 12;
export const GLOBAL_ATTEMPTS_PER_DAY = 24;
export const GENERATION_TIMEOUT_MS = 45_000;
export type GenerationUsage = { balance: number; freeUsed: number; freeLimit: number };

/** Only controlled messages from this class may be returned to visitors. */
export class AiGenerationError extends Error {
  constructor(readonly status: number, message: string, readonly usage?: GenerationUsage) {
    super(message);
    this.name = 'AiGenerationError';
  }
}

/** A timeout/unknown transport error is not proof that provider work stopped. */
export class AiProviderError extends Error {
  constructor(readonly kind: 'quota' | 'rejected' | 'unavailable' | 'unknown') {
    super(kind);
    this.name = 'AiProviderError';
  }
}
