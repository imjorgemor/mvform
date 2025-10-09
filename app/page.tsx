"use client";

import { useState } from "react";
import { Loader2, Copy, Check } from 'lucide-react';

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarContent, SidebarFooter, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from "@/components/ui/textarea";
import {FormRenderer} from "@/components/form-renderer";

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [schema, setSchema] = useState<any | null>(null); //formSchema
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setSchema(null);
    setCode('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setSchema(data.schema);
      setCode(data.code);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div>
      <main>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "22rem",
            } as React.CSSProperties
          }
        >
          <AppSidebar>
            <SidebarContent>

            </SidebarContent>
            <SidebarFooter>
              <div className="p-4">
                <div className="flex flex-col items-center gap-2">
                  <Textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder="Example: Create a contact form with name, email, phone, and message fields"
                    className="flex-1 resize-none mb-4 text-base"
                    disabled={loading}
                  />
                  <Button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    size="lg"
                    className="w-full"
                  >
                    {loading ? (
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
                    <p className="text-sm mt-2">Enter a prompt and click Generate</p>
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

                  {/* Preview Tab */}
                  <TabsContent
                    value="preview"
                    className="flex-1 overflow-auto p-6 mt-0"
                  >
                    <div className="mx-auto">
                      <FormRenderer {...schema} />
                    </div>
                  </TabsContent>

                  {/* Code Tab */}
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
