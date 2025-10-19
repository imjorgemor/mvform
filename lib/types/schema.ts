import { VALIDATION_MODE } from '../useForm/createFormControl';
import { z } from 'zod';
// lib/types/schema.ts
export const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  fields: z.array(
    z.object({
      defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
      disabled: z.boolean().optional(),
      id: z.string(),
      label: z.string(),
      name: z.string(),
      placeholder: z.string().optional(),
      readonly: z.boolean().optional(),
      required: z.boolean().optional(),
      type: z.enum(['text', 'email', 'number', 'date', 'tel', 'password', 'checkbox', 'radio', 'textarea', 'select']),
      options: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      ).optional(),
    })
  ),
  buttons: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      type: z.enum(['submit', 'reset', 'button']),
      variant: z.enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']).optional(),
    })
  ).optional(),
  mode: z.enum(Object.keys(VALIDATION_MODE) as Array<keyof typeof VALIDATION_MODE>).optional(),
});


export type FormSchema = {
  id: string;
  name: string;
  fields: FormField[] | undefined;
  buttons?: FormButton[] | undefined;
  description?: string;
  mode?: keyof typeof VALIDATION_MODE;
  title?: string;
}

export interface FormField {
  defaultValue?: string | number | boolean;
  disabled?: boolean;
  id: string;
  label: string;
  name: string;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  type: 'text' | 'email' | 'number' | 'date' | 'tel' | 'password' | 'checkbox' | 'radio' | 'textarea' | 'select';
}

// Add this interface
export type FormButton = {
  id: string;
  label: string;
  type: 'submit' | 'reset' | 'button';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}