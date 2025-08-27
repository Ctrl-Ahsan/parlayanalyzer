# Parlay Analyzer

A Next.js application for analyzing and optimizing parlay bets with a modern UI built using Tailwind CSS and shadcn/ui.

## Features

- Modern React with Next.js 14
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui components for consistent design
- ESLint for code quality
- Responsive design

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/           # Next.js app directory
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/    # Reusable UI components
└── lib/          # Utility functions
    └── utils.ts
```

## Adding shadcn/ui Components

To add new shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

For example:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```
