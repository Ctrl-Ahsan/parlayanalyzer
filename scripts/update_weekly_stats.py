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

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

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

def update_database(weekly_data, season):
    """Update the database with new weekly data."""
    # TODO: Implement database update logic
    # This will connect to Supabase and update the weekly_stats table
    
    logger.info(f"Would update database with {len(weekly_data)} weekly stats rows for {season}")
    logger.info("Database update not yet implemented - need Supabase setup")
    
    # For now, just save to a temporary file to verify data
    temp_file = Path(f"temp_weekly_{season}.csv")
    weekly_data.to_csv(temp_file, index=False)
    logger.info(f"Saved temporary file: {temp_file}")

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
