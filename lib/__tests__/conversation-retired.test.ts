import assert from 'node:assert/strict';
import test from 'node:test';

test('retired chat does not contact a provider or consume the caller body', async () => {
  const originalFetch = globalThis.fetch;
  let providerCalls = 0;
  globalThis.fetch = async () => {
    providerCalls++;
    throw new Error('The retired endpoint must not call an external service');
  };
  try {
    const { POST, OPTIONS } = await import('../../app/api/conversation/send/route');
    for (const cookie of ['', '__session=fixture-session']) {
      const request = new Request('https://example.invalid/api/conversation/send', {
        method: 'POST',
        headers: { cookie, 'content-type': 'application/json', 'content-length': '999999999' },
        body: 'malformed JSON that must not be parsed',
      });
      const result = await POST(request);
      assert.equal(result.status, 410);
      assert.equal(result.headers.get('cache-control'), 'no-store');
      assert.equal(request.bodyUsed, false);
      const data = await result.json();
      assert.equal(data.contactUrl, 'https://brightears.io/');
      assert.match(data.response, /venue or event/);
    }
    const preflight = await OPTIONS();
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get('cache-control'), 'no-store');
    assert.equal(providerCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
