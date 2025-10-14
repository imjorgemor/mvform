import { Checkbox } from './ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from './ui/textarea';
import { Radio } from './ui/radio';
import { Field, FieldDescription, FieldError, FieldLabel, FieldSet } from './ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from './ui/select';
import type { FormField } from '@/lib/types/schema';
import type { UseFormRegister, FieldValues } from '@/lib/useForm/typesV1';

type DynamicFieldProps = {
  field: FormField;
  register: UseFormRegister<FieldValues>;
  error?: string;
}

const DynamicField = ({ field, register, error }: DynamicFieldProps) => {

  if (field.type === 'select') {
    const {onChange, ...rest} = register(field.name);
    return (
      <Field>
        <FieldLabel htmlFor={field.id}>
          {field.label}
          {field.required && <span>*</span>}
        </FieldLabel>
        <Select
          {...rest}
          onValueChange={(value) => onChange({ target: { value, name: field.name, type: "text" } })}
          aria-invalid={!!error}
          defaultValue={field.defaultValue as string}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder || 'Select an option'} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError>{error}</FieldError>
      </Field>
    );
  }

  if (field.type === 'radio') {
    return (
      <FieldSet>
        <FieldLabel>{field.label}</FieldLabel>
        <FieldDescription>
          {field.placeholder}
        </FieldDescription>
        {field.options?.map((option) => (
          <Field orientation="horizontal" key={option.value}>
            <Radio
              {...register(field.name)}
              defaultChecked={field.defaultValue === option.value}
              aria-invalid={!!error}
              value={option.value}
              id={option.value}
            />
            <FieldLabel htmlFor={option.value} className="font-normal">
              {option.label}
            </FieldLabel>
          </Field>
        ))}
        {error && (
          <FieldError>{error}</FieldError>
        )}
      </FieldSet>
    );
  }

  if (field.type === 'textarea') {
    return (
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor="form-rhf-textarea-about">
          More about you
        </FieldLabel>
        <Textarea
          id={field.id}
          {...register(field.name)}
          aria-invalid={!!error}
          placeholder={field.placeholder}
          className="min-h-[120px]"
        />
        <FieldDescription>
          Tell us more about yourself. This will be used to help us
          personalize your experience.
        </FieldDescription>
        {error && (
          <FieldError>{error}</FieldError>
        )}
      </Field>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <FieldSet>
        <FieldDescription>
          {field.placeholder}
        </FieldDescription>
        <Field orientation="horizontal">
          <Checkbox
            id={field.id}
            {...register(field.name)}
            defaultChecked={field.defaultValue as boolean}
            aria-invalid={!!error}
          />
          <FieldLabel
            htmlFor={field.id}
            className="font-normal"
          >
            {field.label}
          </FieldLabel>
        </Field>
      </FieldSet>
    );
  }

  return (
    <Field>
      <FieldLabel htmlFor={field.id}>
        {field.label}
        {field.required && <span>*</span>}
      </FieldLabel>
      <Input
        id={field.id}
        {...register(field.name)}
        aria-invalid={!!error}
        type={field.type}
        placeholder={field.placeholder}
      />
      <FieldError>{error}</FieldError>
    </Field>

  );
}
export { DynamicField };
