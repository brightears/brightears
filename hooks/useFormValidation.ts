import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  custom?: (value: any, allValues?: Record<string, any>) => boolean | string;
  asyncValidator?: (value: any) => Promise<boolean | string>;
}

export interface UseFormValidationReturn {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isValidating: Record<string, boolean>;
  handleChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (field: string) => () => void;
  handleSubmit: (callback: (values: Record<string, any>) => void | Promise<void>) => (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, error: string) => void;
  validateField: (field: string) => Promise<string>;
}

export default function useFormValidation(
  initialValues: Record<string, any>,
  validationRules: Record<string, ValidationRule>
): UseFormValidationReturn {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState<Record<string, boolean>>({});

  const validateField = useCallback(async (field: string, value?: any): Promise<string> => {
    const fieldValue = value !== undefined ? value : values[field];
    const rules = validationRules[field];

    if (!rules) return '';

    // Required validation
    if (rules.required) {
      const isEmpty = fieldValue === undefined ||
                     fieldValue === null ||
                     fieldValue === '' ||
                     (Array.isArray(fieldValue) && fieldValue.length === 0);

      if (isEmpty) {
        return typeof rules.required === 'string'
          ? rules.required
          : `This field is required`;
      }
    }

    // Don't validate other rules if field is empty and not required
    if (!fieldValue && !rules.required) {
      return '';
    }

    // MinLength validation
    if (rules.minLength && String(fieldValue).length < rules.minLength.value) {
      return rules.minLength.message;
    }

    // MaxLength validation
    if (rules.maxLength && String(fieldValue).length > rules.maxLength.value) {
      return rules.maxLength.message;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.value.test(String(fieldValue))) {
      return rules.pattern.message;
    }

    // Custom validation
    if (rules.custom) {
      const result = rules.custom(fieldValue, values);
      if (result !== true) {
        return typeof result === 'string' ? result : 'Invalid value';
      }
    }

    // Async validation (e.g., uniqueness checks)
    if (rules.asyncValidator) {
      setIsValidating(prev => ({ ...prev, [field]: true }));
      try {
        const result = await rules.asyncValidator(fieldValue);
        if (result !== true) {
          return typeof result === 'string' ? result : 'Validation failed';
        }
      } finally {
        setIsValidating(prev => ({ ...prev, [field]: false }));
      }
    }

    return '';
  }, [values, validationRules]);

  const handleChange = useCallback((field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

      setValues(prev => ({ ...prev, [field]: value }));

      // Progressive validation: only validate on change if field has been touched and has an error
      if (touched[field] && errors[field]) {
        validateField(field, value).then(error => {
          setErrors(prev => ({ ...prev, [field]: error }));
        });
      }
    }, [touched, errors, validateField]);

  const handleBlur = useCallback((field: string) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));

    // Validate on blur
    validateField(field).then(error => {
      setErrors(prev => ({ ...prev, [field]: error }));
    });
  }, [validateField]);

  const handleSubmit = useCallback((callback: (values: Record<string, any>) => void | Promise<void>) =>
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Mark all fields as touched
      const allTouched = Object.keys(validationRules).reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setTouched(allTouched);

      // Validate all fields
      const allErrors: Record<string, string> = {};
      for (const field in validationRules) {
        const error = await validateField(field);
        if (error) {
          allErrors[field] = error;
        }
      }

      setErrors(allErrors);

      // Only submit if no errors
      if (Object.keys(allErrors).length === 0) {
        try {
          await callback(values);
        } catch (error) {
          console.error('Form submission error:', error);
        }
      }

      setIsSubmitting(false);
    }, [validationRules, validateField, values]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsValidating({});
  }, [initialValues]);

  const setFieldValue = useCallback((field: string, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const isValid = Object.keys(errors).every(key => !errors[key]);

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    isValidating,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    validateField
  };
}
