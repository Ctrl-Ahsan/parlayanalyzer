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
    current_year = datetime.now().year
    current_month = datetime.now().month
    
    # NFL season typically starts in September
    if current_month >= 9:
        return current_year
    else:
        return current_year - 1

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

def prepare_data(data, season):
    """Prepare the weekly data for insertion into Supabase."""
    try:
        # Debug: Let's see what columns are actually available
        logger.info(f"Available columns in NFL data: {list(data.columns)}")
        
        # Select and rename columns to match our table schema
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
        
        # Create a new dataframe with only the columns we need
        prepared_data = data[available_columns].copy()
        
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

def update_database(data, season):
    """Update the database with new weekly data."""
    try:
        # Initialize Supabase client
        supabase = get_supabase_client()
        logger.info("Connected to Supabase successfully")
        
        # Prepare data for insertion
        records = prepare_data(data, season)
        
        if not records:
            logger.error("No records prepared for insertion")
            return
        
        # Insert data into the nfl table
        logger.info(f"Inserting {len(records)} records into Supabase...")
        
        # Insert in batches to avoid overwhelming the API
        batch_size = 100
        total_inserted = 0
        
        for i in range(0, len(records), batch_size):
            batch = records[i:i + batch_size]
            try:
                result = supabase.table('nfl').insert(batch).execute()
                batch_inserted = len(result.data) if result.data else 0
                total_inserted += batch_inserted
                logger.info(f"Inserted batch {i//batch_size + 1}: {batch_inserted} records")
            except Exception as e:
                logger.error(f"Error inserting batch {i//batch_size + 1}: {e}")
                # Continue with next batch instead of failing completely
        
        logger.info(f"Database update completed! Total records inserted: {total_inserted}")
        
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
        
        if weekly_data is not None:
            # Update database
            update_database(weekly_data, current_season)
            logger.info("Weekly stats update completed successfully!")
        else:
            logger.error("Failed to download weekly data")
            
    except Exception as e:
        logger.error(f"Error in main process: {e}")
        raise

if __name__ == "__main__":
    main()
