import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateContentImage, isImageGenerationConfigured } from '@/lib/api/gemini-image-client';
import { createAiGenerationHandlers } from '@/lib/ai-generation-service';

export const runtime = 'nodejs';
export const maxDuration = 60;

const handlers = createAiGenerationHandlers({
  db: prisma, getCurrentUser, generate: generateContentImage,
  isConfigured: isImageGenerationConfigured,
});

export const POST = handlers.POST;
export const GET = handlers.GET;
