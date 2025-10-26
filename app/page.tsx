"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { Loader2, Copy, Check } from 'lucide-react';

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarContent, SidebarFooter, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from "@/components/ui/textarea";
import { FormRenderer } from "@/components/form-renderer";
import { PasswordOverlay } from "@/components/password-overlay";


import { FormSchema, formSchema } from "@/lib/types/schema";
import { generateCode } from "@/lib/generate-code";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [urlSchema, setUrlSchema] = useState<FormSchema | null>(null);

  const { object, submit, isLoading } = useObject({
    api: '/api/chat',
    schema: formSchema,
    onFinish: ({ object }) => {
      if (object) {
        setUrlSchema(object);
        const jsonString = JSON.stringify(object);
        const encodedSchema = Buffer.from(jsonString, 'utf-8').toString('base64');
        // Update URL without page reload
        router.push(`?schema=${encodedSchema}`);
      }
    }
  });
  const schema = urlSchema ?? object;
  const code = generateCode(urlSchema ?? schema as FormSchema);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
    const access = localStorage.getItem("appAccess");
    if (access === "granted") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const schemaParam = searchParams.get('schema');
    if (schemaParam) {
      const jsonString = Buffer.from(schemaParam, 'base64').toString('utf-8');
      setUrlSchema(JSON.parse(jsonString));
    }
  }, []);


  return (
    <div>
      {!isAuthenticated && <PasswordOverlay onCorrectPassword={handleAuthentication} />}
      <main>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "22rem",
            } as React.CSSProperties
          }
        >
          <AppSidebar>
            <SidebarContent></SidebarContent>
            <SidebarFooter>
              <div className="p-4">
                <div className="flex flex-col items-center gap-2">
                  <Textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder="Example: Create a contact form with name, email, phone, and message fields"
                    className="flex-1 resize-none mb-4 text-base"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() =>{ 
                      submit(prompt);
                      setUrlSchema(null);
                      router.replace("/");
                    
                    }}
                    disabled={isLoading || !prompt.trim()}
                    size="lg"
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Form'
                    )}
                  </Button>


                </div>
              </div>
            </SidebarFooter>
          </AppSidebar>
          <SidebarInset className="p-2">
            <div>
              <SidebarTrigger />
            </div>
            <div className="flex flex-col">
              {!schema ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <p className="text-lg">No form generated yet</p>
                    <p className="text-sm mt-2">Enter a prompt and click "Generate"</p>
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="preview" className="flex-1 flex flex-col">
                  <div className="px-6 pt-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      <TabsTrigger value="code">Code</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent
                    value="preview"
                    className="flex-1 overflow-auto p-6 mt-0"
                  >
                    <div className="mx-auto">
                      <FormRenderer
                        key={"form-renderer-" + (schema.fields ? schema.fields?.at(-1)?.id : 'empty')}
                        id={schema.id}
                        name={schema.name}
                        title={schema.title}
                        description={schema.description}
                        fields={schema?.fields as FormSchema['fields']}
                        buttons={schema?.buttons as FormSchema['buttons']}
                        mode={schema?.mode}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="code"
                    className="flex-1 overflow-auto p-6 mt-0"
                  >
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 z-10"
                        onClick={handleCopy}
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                      <pre className="bg-slate-950 text-slate-50 p-6 rounded-lg overflow-auto text-sm leading-relaxed">
                        <code>{code}</code>
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </main>
    </div>
  );
}
