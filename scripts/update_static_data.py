#!/usr/bin/env python3
"""
Update Static NFL Data Script

This script downloads teams, players, and rosters data.
Should run once per week during the NFL season.
"""

import os
import sys
import logging
from datetime import datetime
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

def download_teams_data():
    """Download teams data."""
    try:
        logger.info("Downloading teams data...")
        teams_data = nfl.import_team_desc()
        
        if not teams_data.empty:
            logger.info(f"Successfully downloaded teams data: {len(teams_data)} teams")
            return teams_data
        else:
            logger.warning("No teams data available")
            return None
            
    except Exception as e:
        logger.error(f"Error downloading teams data: {e}")
        return None

def download_players_data():
    """Download players data."""
    try:
        logger.info("Downloading players data...")
        players_data = nfl.import_players()
        
        if not players_data.empty:
            logger.info(f"Successfully downloaded players data: {len(players_data)} players")
            return players_data
        else:
            logger.warning("No players data available")
            return None
            
    except Exception as e:
        logger.error(f"Error downloading players data: {e}")
        return None

def download_rosters_data(season):
    """Download rosters data for the specified season."""
    try:
        logger.info(f"Downloading rosters data for {season}...")
        rosters_data = nfl.import_seasonal_rosters([season])
        
        if not rosters_data.empty:
            logger.info(f"Successfully downloaded rosters data: {len(rosters_data)} roster entries")
            return rosters_data
        else:
            logger.warning(f"No rosters data available for {season}")
            return None
            
    except Exception as e:
        logger.error(f"Error downloading rosters data for {season}: {e}")
        return None

def download_schedule_data(season):
    """Download schedule data for the specified season."""
    try:
        logger.info(f"Downloading schedule data for {season}...")
        schedule_data = nfl.import_schedules([season])
        
        if not schedule_data.empty:
            logger.info(f"Successfully downloaded schedule data: {len(schedule_data)} games")
            return schedule_data
        else:
            logger.warning(f"No schedule data available for {season}")
            return None
            
    except Exception as e:
        logger.error(f"Error downloading schedule data for {season}: {e}")
        return None

def update_database(teams_data, players_data, rosters_data, schedule_data, season):
    """Update the database with new static data."""
    # TODO: Implement database update logic
    # This will connect to Supabase and update the teams, players, rosters, and schedules tables
    
    logger.info("Would update database with static data:")
    logger.info(f"  Teams: {len(teams_data) if teams_data is not None else 0}")
    logger.info(f"  Players: {len(players_data) if players_data is not None else 0}")
    logger.info(f"  Rosters: {len(rosters_data) if rosters_data is not None else 0}")
    logger.info(f"  Schedule: {len(schedule_data) if schedule_data is not None else 0}")
    logger.info("Database update not yet implemented - need Supabase setup")
    
    # For now, just save to temporary files to verify data
    if teams_data is not None:
        temp_file = Path(f"temp_teams.csv")
        teams_data.to_csv(temp_file, index=False)
        logger.info(f"Saved temporary file: {temp_file}")
    
    if players_data is not None:
        temp_file = Path(f"temp_players.csv")
        players_data.to_csv(temp_file, index=False)
        logger.info(f"Saved temporary file: {temp_file}")
    
    if rosters_data is not None:
        temp_file = Path(f"temp_rosters_{season}.csv")
        rosters_data.to_csv(temp_file, index=False)
        logger.info(f"Saved temporary file: {temp_file}")
    
    if schedule_data is not None:
        temp_file = Path(f"temp_schedule_{season}.csv")
        schedule_data.to_csv(temp_file, index=False)
        logger.info(f"Saved temporary file: {temp_file}")

def get_current_season():
    """Get the current NFL season."""
    current_year = datetime.now().year
    current_month = datetime.now().month
    
    # NFL season typically starts in September
    if current_month >= 9:
        return current_year
    else:
        return current_year - 1

def main():
    """Main function to update static data."""
    logger.info("Starting static data update...")
    
    try:
        # Get current season
        current_season = get_current_season()
        logger.info(f"Current NFL season: {current_season}")
        
        # Download all static data
        teams_data = download_teams_data()
        players_data = download_players_data()
        rosters_data = download_rosters_data(current_season)
        schedule_data = download_schedule_data(current_season)
        
        # Update database
        update_database(teams_data, players_data, rosters_data, schedule_data, current_season)
        
        logger.info("Static data update completed successfully!")
        
    except Exception as e:
        logger.error(f"Error in main process: {e}")
        raise

if __name__ == "__main__":
    main()
