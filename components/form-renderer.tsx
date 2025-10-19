'use client';

import { Button } from '@/components/ui/button';
import { DynamicField } from './dynamic-field';
import { useFormHook as useForm } from '@/lib/useForm/useFormHook';
import type { FormSchema } from '@/lib/types/schema';
import type { FieldValues, Resolver } from '@/lib/useForm/typesV1';

type FormRendererProps = {
  id: string | undefined
  name: string | undefined
  title?: string | undefined
  description?: string | undefined
  fields?: Partial<FormSchema['fields']> 
  buttons?: Partial<FormSchema['buttons']>
  mode?: keyof typeof import('@/lib/useForm/createFormControl').VALIDATION_MODE
}

const FormRenderer = (props: FormRendererProps) => {
  const { id, name, title, description, fields, buttons, mode="all" } = props;

  const resolver = fields?.reduce((acc, field) => {
    if (field?.required) {
      acc[field.name] = (value) => {
        if (value === '' || value === undefined || value === null) {
          return `${field.name} is required`;
        }
        return false;
      };
    }
    return acc;
  }, {} as Resolver<FieldValues>);

  const { register, formState: { errors }, reset, handleSubmit, } = useForm({
    defaultValues: fields?.reduce((acc, field) => {
      if (field){
        acc[field.name] = field.defaultValue; //|| (field.type === 'checkbox' ? false : '');
        return acc;
      } else {
        return acc;
      }
    }, {} as Record<string, any>),
    resolver,
    mode
  })

  const onSubmit = (data: FieldValues) => {
    console.log('Form submitted:', data);
    window.alert('Form submitted! Check console for data:' + JSON.stringify(data, null, 2));
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} id={id} name={name}>
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4'>
          {fields?.map((field, index) => (
            field &&
            <DynamicField
              key={field?.id ? field.id : `$${index}-"field"`}
              field={field}
              register={register}
              error={errors[field.name]}
            />
          ))}
        </div>

        <div className="flex gap-2 justify-end">
          {buttons?.map((button) => (
            button &&
            <Button
              size="lg"
              key={button.id}
              type={button.type}
              variant={button.variant || 'default'}
              onClick={
                button.type === 'submit'
                  ? handleSubmit(onSubmit)
                  : button.type === 'reset'
                    ? handleReset
                    : undefined
              }
            >
              {button.label}
            </Button>
          ))}
        </div>
      </form>
    </div>
  );
}
export { FormRenderer }