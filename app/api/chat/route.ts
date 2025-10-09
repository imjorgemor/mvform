// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { FormSchema } from '@/lib/types/schema';
import { SYSTEM_PROMPT } from '@/lib/prompts/system-prompt';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2048,
      temperature: 0.2,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Generate a form schema for: ${prompt}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Extract JSON from potential markdown code blocks
    console.log('Raw response:', content.text);
    const jsonText = extractJSON(content.text);

    // Parse the JSON response
    const schema: FormSchema = JSON.parse(jsonText);
    console.log('Parsed schema:', schema);

    // Generate code
    const code = `empty` //generateCode(schema);

    return NextResponse.json({ schema, code });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate form', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to extract JSON from markdown code blocks or plain text
function extractJSON(text: string): string {
  // Remove markdown code blocks if present
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = text.match(codeBlockRegex);

  if (match) {
    return match[1].trim();
  }

  // If no code blocks, return trimmed text
  return text.trim();
}

// function generateCode(schema: FormSchema): string {
//   const imports = `'use client';

// import { useForm } from '@/lib/useForm';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';`;

//   const defaultValues = schema.fields.reduce((acc, field) => {
//     acc[field.name] = field.defaultValue || (field.type === 'checkbox' ? false : '');
//     return acc;
//   }, {} as Record<string, any>);

//   const fieldsJSX = schema.fields
//     .map((field) => {
//       switch (field.type) {
//         case 'textarea':
//           return `      <div className="space-y-2">
//         <Label htmlFor="${field.id}">${field.label}${field.required ? ' *' : ''}</Label>
//         <Textarea
//           id="${field.id}"
//           placeholder="${field.placeholder || ''}"
//           {...form.register('${field.name}')}
//         />
//       </div>`;

//         case 'select':
//           return `      <div className="space-y-2">
//         <Label htmlFor="${field.id}">${field.label}${field.required ? ' *' : ''}</Label>
//         <Select onValueChange={(val) => form.setValue('${field.name}', val)}>
//           <SelectTrigger>
//             <SelectValue placeholder="${field.placeholder || 'Select...'}" />
//           </SelectTrigger>
//           <SelectContent>
// ${field.options?.map((opt) => `            <SelectItem value="${opt.value}">${opt.label}</SelectItem>`).join('\n')}
//           </SelectContent>
//         </Select>
//       </div>`;

//         case 'checkbox':
//           return `      <div className="flex items-center space-x-2">
//         <Checkbox
//           id="${field.id}"
//           {...form.register('${field.name}')}
//         />
//         <Label htmlFor="${field.id}" className="font-normal">
//           ${field.label}
//         </Label>
//       </div>`;

//         case 'radio':
//           return `      <div className="space-y-2">
//         <Label>${field.label}${field.required ? ' *' : ''}</Label>
//         <RadioGroup onValueChange={(val) => form.setValue('${field.name}', val)}>
// ${field.options?.map((opt) => `          <div className="flex items-center space-x-2">
//             <RadioGroupItem value="${opt.value}" id="${field.id}-${opt.value}" />
//             <Label htmlFor="${field.id}-${opt.value}">${opt.label}</Label>
//           </div>`).join('\n')}
//         </RadioGroup>
//       </div>`;

//         default:
//           return `      <div className="space-y-2">
//         <Label htmlFor="${field.id}">${field.label}${field.required ? ' *' : ''}</Label>
//         <Input
//           id="${field.id}"
//           type="${field.type}"
//           placeholder="${field.placeholder || ''}"
//           {...form.register('${field.name}')}
//         />
//       </div>`;
//       }
//     })
//     .join('\n\n');

//   return `${imports}

// export default function ${schema.name}() {
//   const form = useForm({
//     defaultValues: ${JSON.stringify(defaultValues, null, 2)},
//   });

//   const onSubmit = (data: any) => {
//     console.log('Form submitted:', data);
//   };

//   return (
//     <div className="w-full max-w-2xl mx-auto p-6">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold">${schema.name}</h2>
//         ${schema.description ? `<p className="text-muted-foreground mt-1">${schema.description}</p>` : ''}
//       </div>

//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
// ${fieldsJSX}

//         <Button type="submit" className="w-full">
//           Submit
//         </Button>
//       </form>
//     </div>
//   );
// }`;
// }