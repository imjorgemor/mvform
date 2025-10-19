import { FormSchema } from "./types/schema";

export const generateCode = (schema: FormSchema): string => {

  const imports = `
import { useForm } from '@/lib/useForm';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Radio } from '@components/ui/radio';
import { Field, FieldDescription, FieldError, FieldLabel, FieldSet } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FormField } from '@/lib/types/schema';
import type { UseFormRegister, FieldValues } from '@/lib/useForm/typesV1';`;

  const defaultValues = schema?.fields?.reduce((acc, field) => {
    if (field) {
      acc[field.name] = field.defaultValue || (field.type === 'checkbox' ? false : '');
      return acc
    }
    return acc;
  }, {} as Record<string, any>);

  const fieldsJSX = schema?.fields
    ?.map((field) => {

      if (field.type === 'radio') {
        return `<FieldSet>
          <FieldLabel htmlFor="${field.id}">
            ${field.label}
            ${field.required} && <span>*</span>}
          </FieldLabel>
          <FieldDescription>
            ${field.placeholder}
          </FieldDescription>
          ${field.options?.map((option) => `
            <Field orientation="horizontal" key="${option.value}">
              <Radio
                {...register('${field.name}')}
                aria-invalid={!!errors.${field.name}}
                defaultChecked={${field.defaultValue === option.value}}
                id="${option.value}"
                value="${option.value}"
              />
              <FieldLabel htmlFor="${option.value}" className="font-normal">
                ${option.label}
              </FieldLabel>
            </Field>
          `).join('')}
        </FieldSet>`
      }

      if (field.type === 'textarea') {
        return `<Field>
          <FieldLabel htmlFor="${field.id}">
            ${field.label}
            ${field.required} && <span>*</span>}
          </FieldLabel>
          <Textarea
            {...register('${field.name}')}
            aria-invalid={!!errors.${field.name}}
            className="min-h-[120px]"
            id="${field.id}"
            placeholder="${field.placeholder}"
          />
          <FieldError>{errors.${field.name}?.message}</FieldError>
        </Field>`;
      }

      if (field.type === 'checkbox') {
        return `<FieldSet>
            <Field orientation="horizontal">
              <Checkbox
                {...register('${field.name}')}
                defaultChecked={${field.defaultValue === true}}
                aria-invalid={!!errors.${field.name}}
                id="${field.id}"
              />
              <FieldLabel htmlFor="${field.id}" className='font-normal'>
                ${field.label}
              </FieldLabel>
            </Field>
         </FieldSet>`;
      }

      return `<Field>
            <FieldLabel htmlFor="${field.id}">
              ${field.label}
              ${field.required} && <span>*</span>}
            </FieldLabel>
            <Input
              {...register('${field.name}')}
              aria-invalid={!!error}
              id="${field.id}"
              placeholder="${field.placeholder}"
              type="${field.type}"
            />
          </Field>`;
    })
    .join('\n\n');

  return `${imports}

export default function ${schema?.name}() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: ${JSON.stringify(defaultValues, null, 2)},
  });

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    // add here your server connection logic
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">${schema?.name}</h2>
        ${schema?.description ? `<p className="text-muted-foreground mt-1">${schema?.description}</p>` : ''}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} id="${schema?.id}" name="${schema?.name}">
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4'>
          ${fieldsJSX}
        </div>
          <div className="flex gap-2 justify-end">
            <Button size="lg"type="submit" className="w-full" onClick={handleSubmit(onSubmit)}>
              Submit
            </Button>
        </div>
      </form>
    </div>
  );
}`;
}