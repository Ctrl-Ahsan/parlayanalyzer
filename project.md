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
- **Backend Database**: Supabase (PostgreSQL)

## Project Status
- ✅ **Project Initialized**: Next.js app with TypeScript and Tailwind CSS
- ✅ **shadcn/ui Integration**: Button component successfully implemented
- ✅ **Development Server**: Running on http://localhost:3000
- ✅ **Dependencies**: All packages properly installed and configured
- ✅ **Build System**: PostCSS and Tailwind compilation working
- ✅ **NFL Data Pipeline**: Python scripts for data collection implemented
- ✅ **Supabase Integration**: Database connection and table creation completed
- ✅ **Data Architecture**: Hybrid approach implemented (static data in frontend, weekly stats in database)

## Project Structure
```
parlayanalyzer/
├── src/                    # Next.js application
│   ├── app/               # Next.js App Router
│   │   ├── globals.css    # Tailwind + shadcn/ui styles
│   │   ├── layout.tsx     # Root layout with Inter font
│   │   └── page.tsx       # Home page with demo UI
│   ├── components/         # React components
│   │   └── ui/
│   │       └── button.tsx # shadcn/ui button component
│   └── lib/
│       ├── utils.ts       # Utility functions (cn helper)
│       └── data/          # Static NFL data (teams, rosters, schedule)
├── scripts/                # Python data collection scripts
│   ├── requirements.txt   # Python dependencies
│   ├── update_nfl_data.py # Downloads league data and saves to src/lib/data
│   ├── update_nfl_stats.py # Downloads player stats and inserts into Supabase
├── .env                    # Environment variables for Supabase credentials
└── temp_*.csv             # Temporary backup files from data collection
```

## Environment Variables
```
SUPABASE_URL
SUPABASE_ANON_KEY
```

## Python Data Scripts

### **Setup:**
```bash
cd scripts
pip install -r requirements.txt
```

### **Scripts:**
- **`update_nfl_data.py`**: Downloads teams, rosters, schedule data
  - Runs weekly during NFL season
  - Saves data to `src/lib/data/` as JavaScript files
  - Creates: `teams.js`, `rosters.js`, `schedule.js`

- **`update_nfl_stats.py`**: Downloads weekly player performance data
  - Runs daily during NFL season
  - Inserts data into Supabase database

## Database

### Schema
The `nfl` table stores player performance data with columns for:
- Player identification (ID, name, position, team)
- Game context (week, season, opponent)
- Performance stats (passing, rushing, receiving, fantasy points)


---

*This document will be continuously updated as the project evolves and new requirements are identified.*
