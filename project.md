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
- ✅ **Project Initialized**: Next.js app with TypeScript, shadcn/ui and Tailwind CSS
- ✅ **shadcn/ui Integration**: Button component successfully implemented
- ✅ **Development Server**: Running on http://localhost:3000
- ✅ **Dependencies**: All packages properly installed and configured
- ✅ **Build System**: PostCSS and Tailwind compilation working
- ✅ **NFL Data Pipeline**: Python scripts for data collection implemented
- ✅ **Supabase Integration**: Database connection and table creation completed
- ✅ **Data Architecture**: Hybrid approach implemented (static data in frontend, weekly stats in database)
- ✅ **UI Layout**: Complete navigation structure with sport toggle, secondary navigation, and responsive betslip
- ✅ **Teams View**: NFL teams display with real data, colors, and conference organization
- ✅ **Enhanced Team Panels**: Expanded design with team colors as backgrounds, logos and white text
- ✅ **Player Cards**: Interactive team-to-player navigation with position-based grouping
- ✅ **Smart Player Filtering**: Snap count-based filtering to show only relevant offensive players (450 players vs 3,215 total)
- ✅ **Expanded Player Panel**: Player detail view with prop buttons displaying season averages for position-specific stats (QB, RB, WR, TE)
- ✅ **Game Logs Table**: ESPN-style game log display with position-specific stats and color-coded performance metrics
- ✅ **Real Data Integration**: Game logs connected to Supabase database with live player performance data
- ✅ **Betslip Functionality**: Complete prop-to-betslip integration with compact design and real-time data
- ✅ **Visual Hit Rate Counters**: Circular progress bars showing hit rates with color-coded performance (red/yellow/green)
- ✅ **Dynamic Hit Rate Calculations**: Real-time hit rate updates based on time frame selection and prop value adjustments
- ✅ **API Optimization**: Eliminated duplicate API calls by storing game logs data and reusing for betslip processing
- ✅ **Code Refactoring**: Modularized dashboard into focused components for better maintainability and reusability

## Project Structure
```
parlayanalyzer/
├── src/                    # Next.js application
│   ├── app/               # Next.js App Router
│   │   ├── globals.css    # Tailwind + shadcn/ui styles
│   │   ├── layout.tsx     # Root layout with Inter font
│   │   ├── page.tsx       # Main dashboard with navigation and content
│   │   └── api/           # API routes
│   │       └── nfl/       # NFL data API endpoints
│   │           └── game-logs/
│   │               └── route.ts # Game logs API endpoint
│   ├── components/         # React components
│   │   ├── dashboard/     # Dashboard feature components
│   │   │   ├── index.tsx  # Main dashboard orchestrator
│   │   │   ├── games.tsx  # Games view
│   │   │   ├── teams.tsx  # Teams grid view
│   │   │   ├── roster.tsx # Team roster view
│   │   │   └── player.tsx # Player detail view
│   │   ├── ui/            # Reusable UI components
│   │   │   ├── button.tsx # Button component
│   │   │   ├── tabs.tsx   # Tabs component
│   │   │   ├── select.tsx # Select component
│   │   │   ├── slider.tsx # Slider component
│   │   │   ├── tooltip.tsx # Tooltip component
│   │   │   ├── collapsible.tsx # Collapsible component
│   │   │   ├── team-card.tsx # Team card component
│   │   │   ├── player-card.tsx # Player card component
│   │   │   ├── player-props.tsx # Player props section
│   │   │   └── game-logs-table.tsx # Game logs table
│   │   ├── navigation.tsx # Top navigation with sport toggle
│   │   ├── secondary-nav.tsx # Secondary navigation (Games/Teams)
│   │   └── betslip.tsx    # Bet slip component (responsive)
│   └── lib/
│       ├── utils.ts       # Utility functions (cn helper)
│       └── data/          # Static NFL data (teams, rosters, schedule)
│           ├── teams.js   # NFL teams data
│           ├── rosters.js # Player rosters data
│           └── schedule.js # Game schedule data
├── scripts/                # Python data collection scripts
│   ├── requirements.txt   # Python dependencies
│   ├── update_nfl_data.py # Downloads league data and saves to src/lib/data
│   ├── update_nfl_stats.py # Downloads player stats and inserts into Supabase
│   └── setup_database.sql # Database schema setup script
├── .env                    # Environment variables for Supabase credentials
├── temp_*.csv             # Temporary backup files from data collection
├── components.json         # shadcn/ui configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Node.js dependencies
└── README.md              # Project documentation
```

## Environment Variables
```
SUPABASE_URL
SUPABASE_ANON_KEY
```

## UI Architecture

### Navigation Structure
- **Top Navigation**: Colored navbar with logo, sport toggle (All/NFL/NBA), and search
- **Secondary Navigation**: Tabs for Games and Teams views
- **Responsive Design**: Mobile-first with desktop optimizations

### Layout Components
- **Sport Toggle**: Dropdown to switch between All, NFL, and NBA sports
- **View Tabs**: Games and Teams navigation
- **Betslip**: Right sidebar on desktop, collapsible bottom panel on mobile
- **Content Area**: Dynamic content based on selected view and sport

## Betslip Features
- **Prop Integration**: Click any prop button on player page to add to betslip with real player data
- **Over/Under Toggle**: Simple single-button toggle between "OVER" and "UNDER" states
- **Value Adjustment**: Interactive slider for adjusting prop values with prop-specific ranges
- **Performance Range Visualization**: Static performance markers (high/low/average) using real player statistics
- **Real Data Storage**: Comprehensive player and prop data stored in betslip for analysis
- **Time Frame Filtering**: Support for different time periods (L5, L10, L20, 2024, 2025) for data analysis
- **Visual Hit Rate Counters**: Circular progress bars displaying hit counts (X/Y format) with color-coded performance thresholds
- **Dynamic Hit Rate Updates**: Real-time recalculation of hit rates when changing time frames, prop values, or over/under selection

### Teams View Features
- **Conference Organization**: AFC and NFC sections with official conference logos
- **Division Organization**: Teams grouped by division (East, North, South, West) with clear headers
- **Enhanced Team Panels**: 
  - Team primary colors as backgrounds
  - Subtle background logos with reduced opacity
  - Stacked logo + text layout for better visual hierarchy
  - Consistent single-line team names with proper spacing
  - White text for optimal contrast against colored backgrounds
- **Interactive Elements**: Hover effects and clickable panels for viewing players

### Player Cards Features
- **Position-Based Grouping**: Players organized by QB, RB, WR, TE with clear headers
- **Smart Filtering**: Only shows players with 50+ offensive snaps (relevant for prop betting)
- **Enhanced Design**: 
  - Team color backgrounds with subtle team logo watermarks
  - Player names prominently displayed at top
  - Natural aspect ratio headshots aligned to bottom
  - Larger, more prominent player images
  - Responsive grid layout (3-5 columns based on screen size)
- **Navigation**: Back button to return to teams view with team header
- **Data Integration**: Real player data from filtered rosters with headshots and team information

### Expanded Player Panel Features
- **Two-Column Layout**: Player info and game logs side-by-side on large screens, stacked on mobile
- **Player Header**: 
  - Circular player photos with light grey background containers
  - Team-colored panel backgrounds
  - Player name, position, jersey number, and basic stats (height, weight, age, experience)
  - Responsive sizing and layout for all screen sizes
- **Player Props Section**: 
  - Position-specific prop buttons (QB: passing/rushing stats, RB: rushing/receiving, WR/TE: receiving)
  - Season average values displayed prominently
  - Clean, clickable interface ready for betslip integration
- **Game Logs Table**: 
  - ESPN-style layout with position-specific stat columns
  - Color-coded performance metrics (blue for yards, green for TDs, red for turnovers)
  - Responsive table design with natural column sizing and horizontal scrolling only when needed
  - Season filter dropdown for historical data access

## Database

### **Schema:**
The `nfl` table stores player performance data with columns for:
- Player identification (ID, name, position, team)
- Game context (week, season, opponent, game result)
- Performance stats (passing, rushing, receiving, fantasy points)
- Metadata (created_at, updated_at timestamps)

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
  - **Smart Filtering**: Uses snap counts to filter rosters to only relevant offensive players (QB, RB, WR, TE with 50+ snaps)
  - **Data Reduction**: Filters from 3,215 total players to 450 relevant players (86% reduction)

- **`update_nfl_stats.py`**: Downloads weekly player performance data
  - Runs daily during NFL season
  - Inserts data into Supabase database


---

*This document will be continuously updated as the project evolves and new requirements are identified.*
