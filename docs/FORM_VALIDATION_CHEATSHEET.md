# Form Validation Cheat Sheet

Quick reference for implementing forms with React Hook Form + Zod.

---

## Basic Setup

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email')
});

type FormData = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
  mode: 'onBlur'
});
```

---

## Common Zod Validations

```typescript
// String
z.string()
  .min(2, 'Too short')
  .max(50, 'Too long')
  .email('Invalid email')
  .url('Invalid URL')
  .regex(/^[0-9]+$/, 'Numbers only')
  .trim()
  .toLowerCase()

// Number
z.number()
  .min(0, 'Must be positive')
  .max(100, 'Too large')
  .int('Must be integer')
  .positive('Must be positive')
  .nonnegative('Cannot be negative')

// Boolean
z.boolean()
  .refine(val => val === true, 'Must be checked')

// Optional
z.string().optional()
z.union([z.literal(''), z.string().email()])

// Enum
z.enum(['DJ', 'BAND', 'SINGER'])

// Date
z.string().refine(
  date => new Date(date) >= new Date(),
  'Must be future date'
)

// Custom validation
z.string().refine(
  val => val.startsWith('0'),
  'Must start with 0'
)

// Async validation
z.string().refine(
  async val => {
    const res = await fetch(`/api/check?val=${val}`);
    return (await res.json()).available;
  },
  'Already taken'
)

// Cross-field validation
z.object({
  password: z.string(),
  confirm: z.string()
}).refine(
  data => data.password === data.confirm,
  { message: 'Must match', path: ['confirm'] }
)
```

---

## Form Modes

```typescript
useForm({
  // When to validate
  mode: 'onBlur',     // Validate on blur (recommended)
  mode: 'onChange',   // Validate on every change
  mode: 'onSubmit',   // Only validate on submit
  mode: 'onTouched',  // Validate when touched
  mode: 'all',        // Validate on blur and change

  // When to re-validate after first error
  reValidateMode: 'onChange',  // Re-validate on change (recommended)
  reValidateMode: 'onBlur',    // Re-validate on blur
  reValidateMode: 'onSubmit',  // Re-validate on submit
})
```

---

## Input Components

### RHFInput
```tsx
<RHFInput
  label="Name"
  {...register('name')}
  error={errors.name}
  showSuccess={!!dirtyFields.name}
  required
/>
```

### RHFTextarea
```tsx
<RHFTextarea
  label="Message"
  {...register('message')}
  error={errors.message}
  showCharCount
  maxLength={500}
  required
/>
```

### RHFSelect
```tsx
<RHFSelect
  label="Category"
  {...register('category')}
  error={errors.category}
  options={[{ value: 'a', label: 'A' }]}
  required
/>
```

### RHFPhoneInput
```tsx
<RHFPhoneInput
  name="phone"
  control={control}
  label="Phone"
  error={errors.phone}
  required
/>
```

### RHFDatePicker
```tsx
<RHFDatePicker
  label="Date"
  {...register('date')}
  error={errors.date}
  minDate="today"
  required
/>
```

---

## Common Patterns

### Watch Field Values
```tsx
const email = watch('email');
const [name, age] = watch(['name', 'age']);
const allValues = watch();
```

### Set Field Value
```tsx
setValue('name', 'John', { shouldValidate: true });
```

### Trigger Validation
```tsx
trigger('email');           // Single field
trigger(['name', 'email']); // Multiple
trigger();                  // All fields
```

### Get Field State
```tsx
const { isDirty, isTouched, error } = getFieldState('email');
```

### Reset Form
```tsx
reset();                    // Reset to default values
reset({ name: 'John' });    // Reset to new values
```

### Set Focus
```tsx
setFocus('email');
```

---

## Form State

```tsx
const {
  errors,           // Field errors
  isDirty,          // Form has been modified
  isValid,          // Form is valid
  isSubmitting,     // Form is being submitted
  isSubmitted,      // Form was submitted
  isValidating,     // Form is being validated
  dirtyFields,      // Which fields are dirty
  touchedFields,    // Which fields are touched
  defaultValues,    // Default values
  submitCount       // Number of submit attempts
} = formState;
```

---

## Thai-Specific Schemas

### Thai Phone
```typescript
const thaiPhone = z.string()
  .regex(/^[0-9]+$/, 'Digits only')
  .length(10, 'Must be 10 digits')
  .refine(
    phone => ['06', '08', '09'].some(p => phone.startsWith(p)),
    'Must start with 06, 08, or 09'
  );
```

### Future Date (7 days ahead)
```typescript
const eventDate = z.string().refine(
  date => {
    const selected = new Date(date);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7);
    return selected >= minDate;
  },
  'Must be at least 7 days from today'
);
```

### Thai Baht Range
```typescript
const priceRange = z.object({
  min: z.number().min(500),
  max: z.number().max(50000)
}).refine(
  data => data.min <= data.max,
  { message: 'Min must be ≤ max', path: ['min'] }
);
```

---

## Error Handling

### Display Error
```tsx
{errors.email && (
  <p className="text-red-500 text-sm">
    {errors.email.message}
  </p>
)}
```

### Custom Error
```tsx
setError('email', {
  type: 'manual',
  message: 'Email already exists'
});
```

### Clear Error
```tsx
clearErrors('email');
clearErrors(['email', 'name']);
clearErrors();
```

---

## Submission

### Basic Submit
```tsx
const onSubmit = async (data: FormData) => {
  await fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

<form onSubmit={handleSubmit(onSubmit)} noValidate>
```

### With Error Handling
```tsx
const onSubmit = async (data: FormData) => {
  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const error = await res.json();
      setError('root', { message: error.message });
      return;
    }

    reset();
  } catch (error) {
    setError('root', { message: 'Network error' });
  }
};
```

### Prevent Double Submit
```tsx
<button
  type="submit"
  disabled={isSubmitting}
>
  {isSubmitting ? 'Saving...' : 'Save'}
</button>
```

---

## Accessibility

### Required Field
```tsx
<label>
  Name <span className="text-red-500">*</span>
</label>
<input
  {...register('name')}
  aria-required="true"
  aria-invalid={!!errors.name}
  aria-describedby="name-error"
/>
{errors.name && (
  <span id="name-error" role="alert">
    {errors.name.message}
  </span>
)}
```

### Focus First Error
```tsx
const onSubmit = async (data: FormData) => {
  // Submit logic
};

const onError = (errors: any) => {
  const firstError = Object.keys(errors)[0];
  setFocus(firstError as any);
};

<form onSubmit={handleSubmit(onSubmit, onError)}>
```

---

## Conditional Rendering

```tsx
const eventType = watch('eventType');

{eventType === 'other' && (
  <RHFInput
    label="Specify"
    {...register('otherType')}
    error={errors.otherType}
  />
)}
```

---

## Dynamic Fields (Array)

```tsx
const { fields, append, remove } = useFieldArray({
  control,
  name: 'items'
});

{fields.map((field, index) => (
  <div key={field.id}>
    <RHFInput
      {...register(`items.${index}.name`)}
      error={errors.items?.[index]?.name}
    />
    <button type="button" onClick={() => remove(index)}>
      Remove
    </button>
  </div>
))}

<button type="button" onClick={() => append({ name: '' })}>
  Add Item
</button>
```

---

## Utilities

### Format Thai Phone
```typescript
import { formatThaiPhoneForDisplay } from '@/lib/validation/utils';

formatThaiPhoneForDisplay('0812345678');
// → "081-234-5678"
```

### Format Currency
```typescript
import { formatCurrency } from '@/lib/validation/utils';

formatCurrency(2500);
// → "฿2,500"
```

### Get Min Date
```typescript
import { getMinDate } from '@/lib/validation/utils';

getMinDate(7); // 7 days from today
// → "2025-10-15"
```

---

## Common Mistakes

### ❌ Don't
```tsx
// Missing noValidate
<form onSubmit={handleSubmit(onSubmit)}>

// Wrong error syntax
error={errors.email.message}

// Using register with Controller component
<RHFPhoneInput {...register('phone')} />

// Not spreading register
<input name="email" />
```

### ✅ Do
```tsx
// Include noValidate
<form onSubmit={handleSubmit(onSubmit)} noValidate>

// Correct error syntax
error={errors.email}

// Using control with Controller component
<RHFPhoneInput control={control} name="phone" />

// Spread register
<input {...register('email')} />
```

---

## Quick Checklist

Before submitting PR:
- [ ] Form has `noValidate`
- [ ] All fields have labels
- [ ] Required fields marked with *
- [ ] Error messages are helpful
- [ ] Success states shown
- [ ] Submit button disabled when invalid
- [ ] Form resets after success
- [ ] Tested on mobile
- [ ] Tested with screen reader
- [ ] No console errors

---

## Need Help?

- [Full Guide](/docs/FORM_VALIDATION_GUIDE.md)
- [Testing Guide](/docs/FORM_VALIDATION_TESTING.md)
- [Examples](/docs/examples/)
- [Schemas](/lib/validation/schemas.ts)
