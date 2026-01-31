# Internationalization (i18n)

## Setup
- Library: next-intl
- Locales: `en` (English), `th` (Thai)
- Translation files: `messages/en.json`, `messages/th.json`

## Usage

### In Components
```typescript
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('namespace');
  return <h1>{t('title')}</h1>;
}
```

### In Server Components
```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('namespace');
  return <h1>{t('title')}</h1>;
}
```

## Translation File Structure
```json
{
  "namespace": {
    "title": "English text",
    "nested": {
      "key": "More text"
    }
  }
}
```

## Common Issues

### "Translation key not found"
1. Check key exists in BOTH `en.json` and `th.json`
2. Verify namespace matches: `useTranslations('correct.namespace')`
3. Check for typos in key path

### Literal Keys Rendering (e.g., "footer.faq")
1. Missing translation in one or both locale files
2. Wrong namespace in component
3. JSON syntax error in messages file

## Best Practices
- Always add translations to BOTH files simultaneously
- Use descriptive namespace paths: `venuePortal.schedule.title`
- Keep Thai translations culturally appropriate, not just literal
