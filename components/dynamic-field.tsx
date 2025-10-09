import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from './ui/field';
import type { FormField } from '@/lib/types/schema';
import type { UseFormRegister, FieldValues } from '@/lib/useForm/typesV1';

type DynamicFieldProps = {
  field: FormField;
  register: UseFormRegister<FieldValues>;
  error?: string;
}

const DynamicField = ({ field, register, error }: DynamicFieldProps) => {

  return (
    <Field>
      <FieldLabel htmlFor={field.id}>
        {field.label}
        {field.required && <span>*</span>}
      </FieldLabel>
      <Input id={field.id}
        type={field.type}
        placeholder={field.placeholder}
        {...register(field.name)} aria-invalid={!!error} />
      <FieldError>{error}</FieldError>
    </Field>

  );
}
export { DynamicField };
