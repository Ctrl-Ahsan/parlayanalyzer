#!/usr/bin/env python3
"""
Update Weekly NFL Stats Script

This script downloads weekly NFL data and updates the database.
Should run every 24 hours during the NFL season.
"""

import os
import sys
import logging
from datetime import datetime, timedelta
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from dotenv import load_dotenv
import nfl_data_py as nfl
import pandas as pd
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Supabase client
def get_supabase_client():
    """Initialize and return Supabase client."""
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_ANON_KEY")
    
    if not url or not key:
        raise ValueError("Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment")
    
    return create_client(url, key)

def get_current_season():
    """Get the current NFL season."""
    current_date = datetime.now()
    current_year = current_date.year
    current_month = current_date.month
    current_day = current_date.day
    
    # NFL season starts on September 4th
    # If we're before September 4th, we're still in the previous season
    if current_month == 9 and current_day < 4:
        return current_year - 1
    elif current_month < 9:
        return current_year - 1
    else:
        return current_year

def download_weekly_data(season):
    """Download weekly data for the specified season."""
    try:
        logger.info(f"Downloading weekly data for {season}...")
        weekly_data = nfl.import_weekly_data([season])
        
        if not weekly_data.empty:
            logger.info(f"Successfully downloaded {len(weekly_data)} rows for {season}")
            return weekly_data
        else:
            logger.warning(f"No data available for {season}")
            return None
            
    except Exception as e:
        logger.error(f"Error downloading weekly data for {season}: {e}")
        return None

def download_schedule_data(season):
    """Download schedule data for the specified season."""
    try:
        logger.info(f"Downloading schedule data for {season}...")
        schedule_data = nfl.import_schedules([season])
        
        if not schedule_data.empty:
            logger.info(f"Successfully downloaded {len(schedule_data)} schedule rows for {season}")
            return schedule_data
        else:
            logger.warning(f"No schedule data available for {season}")
            return None
            
    except Exception as e:
        logger.error(f"Error downloading schedule data for {season}: {e}")
        return None

def prepare_data(data, season, schedule_data=None):
    """Prepare the weekly data for insertion into Supabase."""
    try:
        # Debug: Let's see what columns are actually available
        logger.info(f"Available columns in NFL data: {list(data.columns)}")
        
        # Add game results if schedule data is available
        if schedule_data is not None:
            logger.info("Adding game results from schedule data...")
            # Create a mapping of (week, team, opponent) to game result
            game_results = {}
            for _, game in schedule_data.iterrows():
                week = game['week']
                home_team = game['home_team']
                away_team = game['away_team']
                home_score = game['home_score']
                away_score = game['away_score']
                
                # Skip if scores are missing
                if pd.isna(home_score) or pd.isna(away_score):
                    continue
                
                # Use the result column (point differential) to determine winner
                point_diff = game['result']
                if point_diff > 0:
                    home_result = f"W {int(home_score)}-{int(away_score)}"
                    away_result = f"L {int(away_score)}-{int(home_score)}"
                elif point_diff < 0:
                    home_result = f"L {int(home_score)}-{int(away_score)}"
                    away_result = f"W {int(away_score)}-{int(home_score)}"
                else:
                    home_result = f"T {int(home_score)}-{int(away_score)}"
                    away_result = home_result
                
                # Store results for both teams
                game_results[(week, home_team, away_team)] = home_result
                game_results[(week, away_team, home_team)] = away_result
            
            # Add game result to player data
            data['game_result'] = data.apply(
                lambda row: game_results.get((row['week'], row['recent_team'], row['opponent_team']), 'N/A'),
                axis=1
            )
            logger.info(f"Added game results for {len(game_results)} games")
        
        # Select and rename columns to match our table schema
        # Note: game_result is excluded from database insertion until column is added to schema
        columns_mapping = {
            'player_id': 'player_id',
            'player_name': 'player_name',
            'player_display_name': 'player_display_name',
            'position': 'position',
            'position_group': 'position_group',
            'recent_team': 'team',
            'week': 'week',
            'season': 'season',
            'season_type': 'season_type',
            'opponent_team': 'opponent_team',
            'game_result': 'game_result',
            'completions': 'completions',
            'attempts': 'attempts',
            'passing_yards': 'passing_yards',
            'passing_tds': 'passing_tds',
            'interceptions': 'interceptions',
            'sacks': 'sacks',
            'carries': 'carries',
            'rushing_yards': 'rushing_yards',
            'rushing_tds': 'rushing_tds',
            'receptions': 'receptions',
            'targets': 'targets',
            'receiving_yards': 'receiving_yards',
            'receiving_tds': 'receiving_tds',
            'fantasy_points': 'fantasy_points',
            'fantasy_points_ppr': 'fantasy_points_ppr'
        }
        
        # Define which columns should be integers vs decimals
        integer_columns = [
            'week', 'season', 'completions', 'attempts', 'passing_yards', 
            'passing_tds', 'interceptions', 'sacks', 'carries', 'rushing_yards', 
            'rushing_tds', 'receptions', 'targets', 'receiving_yards', 'receiving_tds'
        ]
        
        # Filter to only include columns that exist in the data and our schema
        available_columns = [col for col in columns_mapping.keys() if col in data.columns]
        logger.info(f"Columns that will be mapped: {available_columns}")
        
        # Create a new dataframe with only the columns we need and apply column mapping
        prepared_data = data[available_columns].copy()
        
        # Apply column mapping (rename columns to match database schema)
        prepared_data = prepared_data.rename(columns=columns_mapping)
        
        # Add season column if it doesn't exist
        if 'season' not in prepared_data.columns:
            prepared_data['season'] = season
        
        # Clean up any NaN values and convert data types
        for col in prepared_data.columns:
            if col in integer_columns:
                # Convert to integer, handling NaN and decimal values
                prepared_data[col] = pd.to_numeric(prepared_data[col], errors='coerce').fillna(0).astype(int)
            else:
                # For non-integer columns, just fill NaN
                prepared_data[col] = prepared_data[col].fillna(0)
        
        # Convert to list of dictionaries for Supabase insertion
        records = prepared_data.to_dict('records')
        
        logger.info(f"Prepared {len(records)} records for Supabase insertion")
        return records
        
    except Exception as e:
        logger.error(f"Error preparing data for Supabase: {e}")
        return None

def update_database(data, season, schedule_data=None):
    """Update the database with new weekly data."""
    try:
        # Initialize Supabase client
        supabase = get_supabase_client()
        logger.info("Connected to Supabase successfully")
        
        # Prepare data for insertion
        records = prepare_data(data, season, schedule_data)
        
        if not records:
            logger.error("No records prepared for insertion")
            return
        
        # Upsert data into the nfl table (insert or update existing records)
        logger.info(f"Upserting {len(records)} records into Supabase...")
        
        # Upsert in batches to avoid overwhelming the API
        batch_size = 100
        total_upserted = 0
        
        for i in range(0, len(records), batch_size):
            batch = records[i:i + batch_size]
            try:
                # Use upsert to handle existing records
                result = supabase.table('nfl').upsert(batch, on_conflict='player_id,team,week,season').execute()
                batch_upserted = len(result.data) if result.data else 0
                total_upserted += batch_upserted
                logger.info(f"Upserted batch {i//batch_size + 1}: {batch_upserted} records")
            except Exception as e:
                logger.error(f"Error upserting batch {i//batch_size + 1}: {e}")
                # Continue with next batch instead of failing completely
        
        logger.info(f"Database update completed! Total records upserted: {total_upserted}")
        
        # Also save to temporary file as backup
        temp_file = Path(f"temp_nfl_{season}.csv")
        data.to_csv(temp_file, index=False)
        logger.info(f"Saved backup file: {temp_file}")
        
    except Exception as e:
        logger.error(f"Error updating database: {e}")
        # Fallback to saving temporary file
        temp_file = Path(f"temp_weekly_{season}.csv")
        data.to_csv(temp_file, index=False)
        logger.info(f"Database update failed, saved to temporary file: {temp_file}")

def main():
    """Main function to update weekly stats."""
    logger.info("Starting weekly stats update...")
    
    try:
        # Get current season
        current_season = get_current_season()
        logger.info(f"Current NFL season: {current_season}")
        
        # Download weekly data
        weekly_data = download_weekly_data(current_season)
        
        # Download schedule data for game results
        schedule_data = download_schedule_data(current_season)
        
        if weekly_data is not None:
            # Update database
            update_database(weekly_data, current_season, schedule_data)
            logger.info("Weekly stats update completed successfully!")
        else:
            logger.error("Failed to download weekly data")
            
    except Exception as e:
        logger.error(f"Error in main process: {e}")
        raise

if __name__ == "__main__":
    main()
