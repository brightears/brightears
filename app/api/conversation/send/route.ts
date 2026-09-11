import { NextResponse } from 'next/server';

// The former Listening Room is no longer mounted in the agency site.
// Close its public model-calling endpoint without parsing caller-supplied history.
// DJ AI Studio has its own authenticated and metered route.
export async function POST(_request: Request) {
  return NextResponse.json(
    {
      error: 'This chat is no longer available.',
      response: 'Visit Bright Ears to explore DJs or enquire about your venue or event.',
      contactUrl: 'https://brightears.io/',
    },
    { status: 410, headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: 'POST, OPTIONS', 'Cache-Control': 'no-store' },
  });
}
