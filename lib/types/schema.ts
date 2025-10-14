import { VALIDATION_MODE } from '../useForm/createFormControl';
// lib/types/schema.ts
export type FormSchema = {
  id: string;
  name: string;
  title?: string;
  description?: string;
  fields: FormField[];
  buttons?: FormButton[];
  mode?: keyof typeof VALIDATION_MODE;
}

export interface FormField {
  id: string;
  label: string;
  name: string;
  type: 'text' | 'email' | 'number' | 'date' | 'tel' | 'password' | 'checkbox' | 'radio' | 'textarea' | 'select';
  defaultValue?: string | number | boolean;
  disabled?: boolean;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
}

// Add this interface
export type FormButton = {
  id: string;
  label: string;
  type: 'submit' | 'reset' | 'button';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  //action?: string; // For custom actions like 'clear', 'cancel', etc.
}