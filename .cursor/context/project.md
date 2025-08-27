# Parlay Analyzer - Project Overview

## Project Overview
The Parlay Analyzer is a specialized sports betting application designed for casual sports bettors who enjoy placing parlays. Unlike traditional sports analytics platforms that focus on deep statistical analysis, this app provides a simplified interface that displays key player prop performance data and confidence metrics to help users make informed parlay decisions.

## Purpose
- **Primary Goal**: Simplify parlay betting decisions for casual sports bettors
- **Target Audience**: Recreational sports bettors who prefer parlays over single bets
- **Value Proposition**: Quick, visual insights into player prop performance without overwhelming statistical complexity
- **Differentiation**: Focus on parlay-specific insights rather than comprehensive sports analytics

## Tech Stack
- **Frontend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui
- **Language**: TypeScript
- **Build Tools**: PostCSS, Autoprefixer
- **Code Quality**: ESLint with Next.js config

## Sports Support
- **Phase 1**: NFL (starting point)
- **Future**: NBA and other sports

## Core Concept
Simple bet slip-like display showing:
- How many times a player prop hit in the last N games
- Simple, yet insightful metrics to indicate confidence in the bet
- Clean interface for building parlays

## Project Setup & Configuration

### Initial Setup (Completed)
- ✅ **Next.js 15** project initialized with TypeScript and App Router
- ✅ **Tailwind CSS 3.4** configured with PostCSS and Autoprefixer
- ✅ **shadcn/ui** component system integrated with proper configuration
- ✅ **ESLint** setup with Next.js core web vitals rules
- ✅ **TypeScript** configuration with path aliases (`@/*` → `./src/*`)
- ✅ **Project structure** established with organized directories

### Project Structure
```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Tailwind + shadcn/ui styles
│   ├── layout.tsx         # Root layout with Inter font
│   └── page.tsx           # Home page with demo UI
├── components/             # Reusable UI components
│   └── ui/                # shadcn/ui components
│       └── button.tsx     # Button component (example)
└── lib/                   # Utility functions
    └── utils.ts           # shadcn/ui utility functions
```

### Configuration Files
- **`tailwind.config.js`** - Tailwind CSS with shadcn/ui theme
- **`postcss.config.js`** - PostCSS with Tailwind and Autoprefixer
- **`components.json`** - shadcn/ui configuration
- **`tsconfig.json`** - TypeScript with Next.js and path aliases
- **`.eslintrc.json`** - ESLint with Next.js rules

### Dependencies
- **Core**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **UI**: shadcn/ui, Radix UI primitives, Lucide React icons
- **Utilities**: clsx, tailwind-merge, class-variance-authority

### Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

---

*This document will be continuously updated as the project evolves and new requirements are identified.*
