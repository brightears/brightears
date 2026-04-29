/**
 * Venue Agent — top-level layout.
 *
 * Lives outside the locale-aware marketing tree (app/[locale]/*) on purpose.
 * Agent dashboard is for tenant managers, not site visitors. Bypasses i18n
 * and the marketing chrome.
 *
 * Started 2026-04-29.
 */

import { ReactNode } from 'react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'BrightEars Agent',
  description: 'Venue entertainment management agent',
  robots: { index: false, follow: false },
};

export default function AgentLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <header className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                BrightEars Agent
              </h1>
              <p className="text-sm text-slate-500">
                Entertainment programming, on autopilot.
              </p>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
