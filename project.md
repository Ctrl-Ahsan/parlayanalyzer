# Parlay Analyzer - Project Overview

## Project Overview
The Parlay Analyzer is a specialized sports betting application designed for casual sports bettors who enjoy placing parlays. Unlike traditional sports analytics platforms that focus on deep statistical analysis, this app provides a simplified interface that displays key player prop performance data and confidence metrics to help users make informed parlay decisions.

## Purpose
- **Primary Goal**: Simplify parlay betting decisions for casual sports bettors
- **Target Audience**: Recreational sports bettors who prefer parlays over single bets
- **Value Proposition**: Quick, visual insights into player prop performance without overwhelming statistical complexity
- **Differentiation**: Focus on parlay-specific insights rather than comprehensive sports analytics

## Tech Stack
- **Frontend**: Next.js 15.5.2 (App Router)
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: shadcn/ui
- **Language**: TypeScript 5.9.2
- **Development**: ESLint, PostCSS, Autoprefixer

## Project Status
- ✅ **Project Initialized**: Next.js app with TypeScript and Tailwind CSS
- ✅ **shadcn/ui Integration**: Button component successfully implemented
- ✅ **Development Server**: Running on http://localhost:3000
- ✅ **Dependencies**: All packages properly installed and configured
- ✅ **Build System**: PostCSS and Tailwind compilation working

## Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Tailwind + shadcn/ui styles
│   ├── layout.tsx         # Root layout with Inter font
│   └── page.tsx           # Home page with demo UI
├── components/
│   └── ui/
│       └── button.tsx     # shadcn/ui button component
└── lib/
    └── utils.ts           # Utility functions (cn helper)
```

## Sports Support
- **Phase 1**: NFL (starting point)
- **Future**: NBA and other sports

## Core Concept
Simple bet slip-like display showing:
- How many times a player prop hit in the last N games
- Simple, yet insightful metrics to indicate confidence in the bet
- Clean interface for building parlays

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

---

*This document will be continuously updated as the project evolves and new requirements are identified.*
