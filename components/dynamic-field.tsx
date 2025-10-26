import { Checkbox } from './ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from './ui/textarea';
import { Radio } from './ui/radio';
import { Field, FieldDescription, FieldError, FieldLabel, FieldSet } from './ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { FormField } from '@/lib/types/schema';
import type { UseFormRegister, FieldValues } from '@/lib/useForm/typesV1';

type DynamicFieldProps = {
  field: FormField;
  register: UseFormRegister<FieldValues>;
  error?: string;
}

const DynamicField = ({ field, register, error }: DynamicFieldProps) => {

  if (field.type === 'select') {
    const { onChange, ...rest } = register(field.name);
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
            {field.options?.map((option, idx) => (
              <SelectItem key={`option-${idx}-${option.value}`} value={option.value}>
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
        <FieldLabel htmlFor={field.id}>{field.label} {field.required && <span>*</span>}</FieldLabel>
        <FieldDescription>
          {field.placeholder}
        </FieldDescription>
        {field.options?.map((option) => (
          <Field orientation="horizontal" key={option.value} id={field.id}>
            <Radio
              {...register(field.name)}
              aria-invalid={!!error}
              defaultChecked={field.defaultValue === option.value}
              id={option.value}
              value={option.value}
            />
            <FieldLabel htmlFor={option.value} className="font-normal">
              {option.label}
            </FieldLabel>
          </Field>
        ))}
        <FieldError>{error}</FieldError>
      </FieldSet>
    );
  }

  if (field.type === 'textarea') {
    return (
      <Field>
        <FieldLabel htmlFor={field.id}>
          {field.label} {field.required && <span>*</span>}
        </FieldLabel>
        <Textarea
          {...register(field.name)}
          aria-invalid={!!error}
          className="min-h-[120px]"
          id={field.id}
          placeholder={field.placeholder}
        />
        <FieldError>{error}</FieldError>
      </Field>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <FieldSet>
        <Field orientation="horizontal" className='min-h-11 items-center'>
          <Checkbox
            {...register(field.name)}
            aria-invalid={!!error}
            defaultChecked={field.defaultValue as boolean}
            id={field.id}
          />
          <FieldLabel htmlFor={field.id} className='font-normal'>
            {field.label}
          </FieldLabel>
        </Field>
        <FieldError>{error}</FieldError>
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
        {...register(field.name)}
        aria-invalid={!!error}
        id={field.id}
        placeholder={field.placeholder}
        type={field.type}
      />
      <FieldError>{error}</FieldError>
    </Field>

  );
}
export { DynamicField };
