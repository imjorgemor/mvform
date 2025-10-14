# AI Agent Instructions for my-ai

## Project Overview
This is a Next.js 15.5 application that generates dynamic forms using AI. The app uses Claude AI to generate form schemas based on natural language prompts, then renders them using a custom form engine.

## Core Architecture

### Form Generation Flow
1. User provides natural language prompt (`app/api/chat/route.ts`)
2. Claude AI generates form schema matching `FormSchema` type
3. Schema is rendered using `FormRenderer` component
4. Form state managed by custom `useForm` hook

### Key Components
- `components/form-renderer.tsx`: Main form rendering engine
- `components/dynamic-field.tsx`: Renders individual form fields
- `lib/useForm`: Custom form state management system
- `lib/types/schema.ts`: Core type definitions for form schemas

## Development Workflow

### Setup
```bash
pnpm install
```

### Running Locally
```bash
pnpm dev
```
Uses Turbopack for faster builds (configured in package.json scripts)

### Environment Variables
Required:
- `ANTHROPIC_API_KEY`: Claude API key for form generation

## Project Conventions

### Component Structure
- UI components use shadcn/ui patterns (see components/ui/)
- Custom components live in components/ root
- Page components in app/ directory (Next.js App Router)

### State Management
- Form state handled by useForm hook system
- No global state management - uses React Context where needed
- API responses cached using Next.js cache system

### Styling
- TailwindCSS with shadcn/ui preset
- Component aliases configured in components.json
- Custom styles in app/globals.css

### File Organization
- /components: Reusable React components
- /lib: Core utilities and hooks
- /app: Next.js pages and API routes
- /public: Static assets