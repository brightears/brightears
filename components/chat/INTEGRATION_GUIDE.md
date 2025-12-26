# ChatWidget Integration Guide

## Quick Start (3 Minutes)

### Step 1: Import the Component

```tsx
// app/[locale]/layout.tsx
import ChatWidget from '@/components/chat/ChatWidget';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <ChatWidget /> {/* Add this line */}
      </body>
    </html>
  );
}
```

### Step 2: Verify API Endpoint

Ensure `/api/conversation/send` is deployed and working:

```bash
curl -X POST https://brightears.onrender.com/api/conversation/send \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","conversationHistory":[]}'
```

**Expected Response:**
```json
{
  "response": "What color lives between silence and sound?",
  "timestamp": 1703001234567
}
```

### Step 3: Test in Browser

1. Visit your site: `https://brightears.onrender.com`
2. Click the cyan floating button (bottom-right)
3. Type a message and press Enter
4. Verify AI response appears

**Done!** The widget is now live.

---

## Advanced Integration

### Option 1: Conditional Rendering

Only show widget on specific pages:

```tsx
// app/[locale]/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import ChatWidget from '@/components/chat/ChatWidget';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Show on homepage and contact page only
  const showChat = pathname === '/' || pathname.includes('/contact');

  return (
    <html>
      <body>
        {children}
        {showChat && <ChatWidget />}
      </body>
    </html>
  );
}
```

### Option 2: Custom Trigger

Use your own button to open the widget:

```tsx
// components/chat/ChatWidget.tsx (modify)

// Add imperative handle
export interface ChatWidgetHandle {
  open: () => void;
  close: () => void;
}

const ChatWidget = forwardRef<ChatWidgetHandle>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  }));

  // ... rest of component
});

// Usage in parent component
import { useRef } from 'react';
import ChatWidget, { ChatWidgetHandle } from '@/components/chat/ChatWidget';

export default function Page() {
  const chatRef = useRef<ChatWidgetHandle>(null);

  return (
    <>
      <button onClick={() => chatRef.current?.open()}>
        Ask AI
      </button>
      <ChatWidget ref={chatRef} />
    </>
  );
}
```

### Option 3: Event Tracking

Track user interactions with analytics:

```tsx
// components/chat/ChatWidget.tsx

const handleSendMessage = async () => {
  // ... existing code

  // Track message sent
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'chat_message_sent', {
      message_length: trimmedInput.length,
      conversation_length: messages.length
    });
  }

  // ... rest of function
};

const handleOpen = () => {
  setIsOpen(true);

  // Track widget opened
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'chat_widget_opened', {
      page_path: window.location.pathname
    });
  }
};
```

---

## Customization

### Brand Colors

Modify colors to match your theme:

```tsx
// Current: Brand cyan (#00bbe4)
className="bg-brand-cyan"

// Custom: Purple theme
className="bg-purple-600"

// Multiple changes needed:
// 1. FAB button background
// 2. Header gradient
// 3. User message bubbles
// 4. Focus ring on input
// 5. Send button background
```

**Files to modify:**
- `components/chat/ChatWidget.tsx` (search for `brand-cyan`)

### Modal Size

Change dimensions for different layouts:

```tsx
// Current: 360x480px desktop
className="md:w-[360px] md:h-[480px]"

// Larger: 480x600px desktop
className="md:w-[480px] md:h-[600px]"

// Sidebar style: 320x100vh (full height)
className="md:w-[320px] md:h-screen"
```

### Initial Greeting

Use a custom greeting instead of random prompt:

```tsx
// Option 1: Static greeting
const greeting: Message = {
  role: 'assistant',
  content: 'Welcome to Bright Ears! How can I help you today?',
  timestamp: Date.now()
};

// Option 2: Time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning! What brings you here?';
  if (hour < 18) return 'Good afternoon! How can I assist?';
  return 'Good evening! What can I help with?';
};
```

### Message Limits

Adjust conversation history limits:

```tsx
// Current: 50 messages max in localStorage
const MAX_MESSAGES = 50;

// Unlimited (use with caution)
const MAX_MESSAGES = Infinity;

// Only recent messages
const MAX_MESSAGES = 20;

// Current: 10 messages sent to API
const conversationHistory = messages.slice(-10);

// More context
const conversationHistory = messages.slice(-20);

// Less context (faster API)
const conversationHistory = messages.slice(-5);
```

---

## API Integration Details

### Request Format

```typescript
POST /api/conversation/send

Headers:
  Content-Type: application/json

Body:
{
  message: string,              // User's message (1-500 chars)
  conversationHistory?: Message[] // Last N messages for context
}
```

### Response Format

**Success (200 OK):**
```json
{
  "response": "What texture does that feeling have?",
  "timestamp": 1703001234567
}
```

**Error (400 Bad Request):**
```json
{
  "error": "Message is required",
  "response": "The silence listens... but heard no words"
}
```

**Error (429 Rate Limit):**
```json
{
  "error": "Rate limit exceeded",
  "response": "The voices are silent... try asking again in a moment"
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Internal server error",
  "response": "The resonance falters... breathe and try once more"
}
```

### Message Interface

```typescript
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// Example
{
  role: 'user',
  content: 'I feel blue and gray',
  timestamp: 1703001234567
}
```

---

## LocalStorage Schema

### Key
```
brightears-chat-history
```

### Value (JSON array)
```json
[
  {
    "role": "assistant",
    "content": "What color lives between silence and sound?",
    "timestamp": 1703001234567
  },
  {
    "role": "user",
    "content": "Blue and gray",
    "timestamp": 1703001245678
  },
  {
    "role": "assistant",
    "content": "What texture does that feeling have?",
    "timestamp": 1703001256789
  }
]
```

### Storage Limits
- **Max Messages**: 50 (last 50 only)
- **Max Size**: ~5KB per message (including JSON overhead)
- **Total**: ~250KB max (well within 5-10MB localStorage limit)

### Manual Access

```javascript
// Read chat history
const history = JSON.parse(localStorage.getItem('brightears-chat-history'));

// Clear chat history
localStorage.removeItem('brightears-chat-history');

// Check storage size
const size = new Blob([localStorage.getItem('brightears-chat-history')]).size;
console.log(`Chat history size: ${size} bytes`);
```

---

## Performance Optimization

### Lazy Loading

Load widget only when needed:

```tsx
// app/[locale]/layout.tsx
import dynamic from 'next/dynamic';

const ChatWidget = dynamic(() => import('@/components/chat/ChatWidget'), {
  ssr: false, // Only load on client
  loading: () => null // No loading state
});

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
```

**Bundle Impact:**
- Before: 8KB added to initial bundle
- After: 8KB loaded on-demand (when user clicks FAB)

### Preloading

Preload API endpoint for faster first message:

```tsx
// app/[locale]/layout.tsx
export default function Layout({ children }) {
  useEffect(() => {
    // Preload API route
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = '/api/conversation/send';
    link.as = 'fetch';
    document.head.appendChild(link);
  }, []);

  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}
```

### Throttling

Prevent spam by throttling send button:

```tsx
// Add to ChatWidget.tsx
import { useState, useRef } from 'react';

const THROTTLE_MS = 2000; // 2 seconds between messages

const ChatWidget = () => {
  const [lastSentTime, setLastSentTime] = useState(0);

  const handleSendMessage = async () => {
    const now = Date.now();
    if (now - lastSentTime < THROTTLE_MS) {
      setError('Please wait before sending another message');
      return;
    }

    setLastSentTime(now);
    // ... rest of function
  };
};
```

---

## Security Considerations

### Input Sanitization

The component already validates:
- ✅ Message length (0-500 characters)
- ✅ Empty message prevention
- ✅ Trimming whitespace

**Additional sanitization (optional):**

```tsx
// Add XSS protection
import DOMPurify from 'dompurify';

const handleSendMessage = async () => {
  const sanitized = DOMPurify.sanitize(inputValue);
  // ... use sanitized instead of inputValue
};
```

### Rate Limiting

**Client-side (basic protection):**
Already implemented in `/api/conversation/send`

**Server-side (recommended for production):**

```typescript
// lib/rate-limiter.ts
import { LRUCache } from 'lru-cache';

const ratelimit = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minute
});

export function checkRateLimit(ip: string): boolean {
  const count = (ratelimit.get(ip) as number) || 0;
  if (count >= 10) return false; // 10 messages per minute

  ratelimit.set(ip, count + 1);
  return true;
}

// In API route
import { checkRateLimit } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  // ... rest of API
}
```

### Privacy

**Current implementation:**
- ✅ All data stored client-side (localStorage)
- ✅ No user tracking or analytics
- ✅ No conversation history sent to server beyond context window

**GDPR Compliance:**
- Add "Clear history" button (already implemented)
- Add privacy notice in modal footer
- Allow users to opt-out of localStorage

---

## Troubleshooting

### Widget Not Visible

**Check 1: Component imported?**
```tsx
// ✅ Correct
import ChatWidget from '@/components/chat/ChatWidget';
<ChatWidget />

// ❌ Wrong
// Missing import or component not added to JSX
```

**Check 2: Z-index conflicts?**
```css
/* Widget uses z-40 for FAB, z-50 for modal */
/* If another element uses higher z-index, adjust: */

.fixed.bottom-4.right-4 {
  z-index: 9999 !important; /* Override conflicts */
}
```

**Check 3: CSS loaded?**
```bash
# Rebuild Tailwind
npm run build

# Check browser console for CSS errors
```

### Messages Not Saving

**Check 1: LocalStorage available?**
```javascript
// Test in browser console
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('LocalStorage available');
} catch (e) {
  console.error('LocalStorage disabled:', e);
}
```

**Check 2: Private browsing mode?**
- Safari Private: LocalStorage disabled
- Chrome Incognito: Limited localStorage
- Firefox Private: Cleared on close

**Check 3: Storage quota exceeded?**
```javascript
// Check quota
navigator.storage.estimate().then(estimate => {
  console.log(`Used: ${estimate.usage} / ${estimate.quota}`);
});
```

### API Errors

**Check 1: Endpoint accessible?**
```bash
# Test API
curl -X POST http://localhost:3000/api/conversation/send \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

**Check 2: CORS issues?**
```typescript
// Add to API route if needed
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
```

**Check 3: Environment variables set?**
```bash
# Check .env.local
echo $GEMINI_API_KEY

# Check Render dashboard
# Settings → Environment → GEMINI_API_KEY
```

### Mobile Issues

**Check 1: Viewport blocking FAB?**
```css
/* Ensure body allows fixed positioning */
body {
  position: relative;
  overflow-x: hidden; /* Not overflow: hidden */
}
```

**Check 2: Input zooming on iOS?**
```css
/* Prevent zoom on focus (iOS Safari) */
input {
  font-size: 16px; /* Minimum to prevent zoom */
}
```

**Check 3: Modal not full-screen on mobile?**
```tsx
// Ensure responsive classes
className="w-full md:w-[360px] h-[600px] md:h-[480px]"
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] Run `npm run build` locally (catch TypeScript errors)
- [ ] Run `npm run lint` (ensure code quality)
- [ ] Test on Chrome, Firefox, Safari (desktop)
- [ ] Test on iOS Safari, Chrome Android (mobile)
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Test screen reader (VoiceOver, NVDA)
- [ ] Verify API endpoint working (`/api/conversation/send`)
- [ ] Check environment variables in Render dashboard
- [ ] Review error handling (simulate API failures)

### Post-Deployment

- [ ] Open widget on production site
- [ ] Send test message and verify response
- [ ] Check browser console for errors
- [ ] Verify localStorage persistence (reload page)
- [ ] Test on mobile devices (real devices, not emulators)
- [ ] Monitor API logs for errors (Render dashboard)
- [ ] Set up error tracking (Sentry, LogRocket, etc.)

### Monitoring

**Key Metrics:**
- Widget open rate (FAB clicks / page views)
- Messages sent per session
- API error rate (4xx, 5xx)
- Average response time
- Conversation length (messages per user)

**Tools:**
- Google Analytics (custom events)
- Sentry (error tracking)
- Render logs (API performance)

---

## Support

**Questions or issues?**
- GitHub: [brightears/brightears](https://github.com/brightears/brightears)
- Email: dev@brightears.io
- Docs: See README.md in same directory

---

**Last Updated:** December 26, 2025
**Version:** 1.0.0
