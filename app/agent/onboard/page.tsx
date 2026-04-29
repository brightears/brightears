/**
 * Venue Agent — onboarding wizard.
 *
 * Single-page form: tenant name + slug + first venue.
 * Calls the onboardTenant server action and redirects on success.
 *
 * Started 2026-04-29 day 2.
 */

import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { onboardTenant } from '@/lib/agent/onboarding';

export const dynamic = 'force-dynamic';

async function handleOnboard(formData: FormData) {
  'use server';

  const tenantName = String(formData.get('tenantName') ?? '');
  const tenantSlug = String(formData.get('tenantSlug') ?? '');
  const brandName = String(formData.get('brandName') ?? '') || undefined;
  const venueName = String(formData.get('venueName') ?? '') || undefined;

  const result = await onboardTenant({
    tenantName,
    tenantSlug,
    brandName,
    firstVenue: venueName ? { name: venueName } : undefined,
  });

  if (!result.ok) {
    redirect(`/agent/onboard?error=${encodeURIComponent(result.error)}`);
  }

  redirect(`/agent/${tenantSlug}/dashboard`);
}

export default async function OnboardPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await props.searchParams;
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <Link
          href="/agent"
          className="text-sm text-slate-500 underline"
        >
          ← Back
        </Link>
      </div>
      <h2 className="mb-2 text-xl font-semibold">Create your workspace</h2>
      <p className="mb-8 text-sm text-slate-600">
        A workspace holds one or more venues. You'll be the owner. You can invite
        managers later.
      </p>

      {error && (
        <div className="mb-6 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form action={handleOnboard} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="tenantName">
            Workspace name
          </label>
          <p className="mt-1 text-xs text-slate-500">
            Your business or property — e.g. "Sato San Hotel" or "Centara F&B".
          </p>
          <input
            id="tenantName"
            name="tenantName"
            required
            maxLength={120}
            className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="tenantSlug">
            Slug
          </label>
          <p className="mt-1 text-xs text-slate-500">
            2–40 chars, lowercase, hyphens OK. Used in URLs (no spaces).
          </p>
          <input
            id="tenantSlug"
            name="tenantSlug"
            required
            pattern="[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?"
            maxLength={40}
            className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="brandName">
            Brand name (optional)
          </label>
          <p className="mt-1 text-xs text-slate-500">
            How the brand should appear to your DJs and inside the dashboard.
            Defaults to workspace name.
          </p>
          <input
            id="brandName"
            name="brandName"
            maxLength={120}
            className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <label className="block text-sm font-medium text-slate-700" htmlFor="venueName">
            First venue (optional)
          </label>
          <p className="mt-1 text-xs text-slate-500">
            Add your first venue now, or skip and add it from settings later.
          </p>
          <input
            id="venueName"
            name="venueName"
            maxLength={120}
            placeholder="e.g. Sato San Rooftop"
            className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Create workspace
        </button>
      </form>

      <p className="mt-8 text-xs text-slate-400">
        14-day free trial. No credit card. You can switch to paid or cancel
        anytime from settings.
      </p>
    </div>
  );
}
