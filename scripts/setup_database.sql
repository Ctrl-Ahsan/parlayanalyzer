-- Database setup script for NFL data
-- Run this in the Supabase SQL Editor

-- Create the nfl table with proper schema
CREATE TABLE IF NOT EXISTS nfl (
    id SERIAL PRIMARY KEY,
    player_id TEXT NOT NULL,
    player_name TEXT NOT NULL,
    player_display_name TEXT,
    position TEXT,
    position_group TEXT,
    team TEXT NOT NULL,
    week INTEGER NOT NULL,
    season INTEGER NOT NULL,
    season_type TEXT,
    opponent_team TEXT,
    game_result TEXT DEFAULT 'N/A',
    
    -- Passing stats
    completions INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    passing_yards INTEGER DEFAULT 0,
    passing_tds INTEGER DEFAULT 0,
    interceptions INTEGER DEFAULT 0,
    sacks INTEGER DEFAULT 0,
    
    -- Rushing stats
    carries INTEGER DEFAULT 0,
    rushing_yards INTEGER DEFAULT 0,
    rushing_tds INTEGER DEFAULT 0,
    
    -- Receiving stats
    receptions INTEGER DEFAULT 0,
    targets INTEGER DEFAULT 0,
    receiving_yards INTEGER DEFAULT 0,
    receiving_tds INTEGER DEFAULT 0,
    
    -- Fantasy stats
    fantasy_points DECIMAL(5,2) DEFAULT 0,
    fantasy_points_ppr DECIMAL(5,2) DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint for player/team/week/season combination
CREATE UNIQUE INDEX IF NOT EXISTS idx_nfl_unique ON nfl (player_id, team, week, season);

-- Create common query indexes
CREATE INDEX IF NOT EXISTS idx_nfl_player_season ON nfl (player_id, season);
CREATE INDEX IF NOT EXISTS idx_nfl_team_season ON nfl (team, season);
CREATE INDEX IF NOT EXISTS idx_nfl_position ON nfl (position);
CREATE INDEX IF NOT EXISTS idx_nfl_week ON nfl (week, season);
CREATE INDEX IF NOT EXISTS idx_nfl_opponent ON nfl (opponent_team);

-- Create performance indexes for common queries
CREATE INDEX IF NOT EXISTS idx_nfl_passing_yards ON nfl (passing_yards) WHERE passing_yards > 0;
CREATE INDEX IF NOT EXISTS idx_nfl_rushing_yards ON nfl (rushing_yards) WHERE rushing_yards > 0;
CREATE INDEX IF NOT EXISTS idx_nfl_receiving_yards ON nfl (receiving_yards) WHERE receiving_yards > 0;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_nfl_updated_at ON nfl;
CREATE TRIGGER update_nfl_updated_at
    BEFORE UPDATE ON nfl
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the table was created
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name = 'nfl' 
ORDER BY ordinal_position;
