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
import pandas as pd
import numpy as np
import json

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

def deduplicate_teams(teams_data):
    """Remove duplicate teams based on team_id, keeping the most recent version."""
    if teams_data is None or teams_data.empty:
        return teams_data
    
    logger.info("Deduplicating teams data...")
    
    # We know exactly which teams are duplicates - just filter them out
    # Remove: LA (Los Angeles Rams), OAK (Oakland Raiders), SD (San Diego Chargers), STL (St. Louis Rams)
    teams_to_remove = ['LA', 'OAK', 'SD', 'STL']
    
    # Filter out the old/duplicate team abbreviations
    filtered_teams = teams_data[~teams_data['team_abbr'].isin(teams_to_remove)]
    
    logger.info(f"Deduplicated teams: {len(teams_data)} -> {len(filtered_teams)}")
    
    return filtered_teams

def convert_nan_to_null(obj):
    """Convert pandas nan values to null for JavaScript compatibility."""
    if isinstance(obj, dict):
        return {key: convert_nan_to_null(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_nan_to_null(item) for item in obj]
    elif pd.isna(obj):
        return None
    elif isinstance(obj, pd.Timestamp):
        # Convert pandas timestamps to ISO string format
        return obj.isoformat() if pd.notna(obj) else None
    elif isinstance(obj, (int, float)):
        # Handle numeric types
        if pd.isna(obj) or (isinstance(obj, float) and np.isnan(obj)):
            return None
        return obj
    else:
        return obj

def filter_active_offensive_players(rosters_data, season, min_snaps=50):
    """Filter rosters to only include active offensive players (QB, RB, WR, TE) who have taken snaps."""
    if rosters_data is None or rosters_data.empty:
        return rosters_data
    
    logger.info("Filtering rosters to active offensive players only...")
    
    # Define offensive positions
    offensive_positions = ['QB', 'RB', 'WR', 'TE']
    
    # Filter rosters to only include offensive players
    offensive_rosters = rosters_data[rosters_data['position'].isin(offensive_positions)]
    logger.info(f"Offensive players: {len(offensive_rosters)}")
    
    try:
        # Get snap counts data to find players who have taken snaps
        logger.info("Downloading snap counts to filter active players...")
        snaps_data = nfl.import_snap_counts([season])
        
        if not snaps_data.empty:
            # Filter to offensive positions
            offensive_snaps = snaps_data[snaps_data['position'].isin(offensive_positions)]
            
            # Calculate total snaps per player
            player_snap_totals = offensive_snaps.groupby('player')['offense_snaps'].sum()
            
            # Get players with minimum snap count
            active_players = player_snap_totals[player_snap_totals >= min_snaps].index.tolist()
            logger.info(f"Players with {min_snaps}+ snaps: {len(active_players)}")
            
            # Filter offensive rosters to only include players who have taken snaps
            active_offensive_rosters = offensive_rosters[offensive_rosters['player_name'].isin(active_players)]
            
            logger.info(f"Active offensive players: {len(offensive_rosters)} -> {len(active_offensive_rosters)}")
            return active_offensive_rosters
        else:
            logger.warning("No snap counts data available, returning all offensive players")
            return offensive_rosters
            
    except Exception as e:
        logger.error(f"Error filtering by snap counts: {e}")
        logger.warning("Returning all offensive players due to error")
        return offensive_rosters

def save(teams_data, rosters_data, schedule_data, season):
    """Save static data to lib/data folder as JavaScript files."""
    # Create lib/data directory if it doesn't exist
    lib_data_dir = Path("../src/lib/data")
    lib_data_dir.mkdir(parents=True, exist_ok=True)
    
    logger.info(f"Saving static data to {lib_data_dir.absolute()}")
    
    # Save teams data
    if teams_data is not None:
        teams_file = lib_data_dir / "teams.js"
        # Deduplicate teams and convert to records
        teams_deduped = deduplicate_teams(teams_data)
        teams_records = teams_deduped.to_dict('records') if hasattr(teams_deduped, 'to_dict') else teams_deduped
        teams_records_clean = convert_nan_to_null(teams_records)
        teams_js = f"export const teams = {json.dumps(teams_records_clean, indent=2)};"
        with open(teams_file, 'w') as f:
            f.write(teams_js)
        logger.info(f"Saved teams data: {teams_file}")
    
    # Save rosters data (active offensive players only)
    if rosters_data is not None:
        rosters_file = lib_data_dir / "rosters.js"
        # Filter to active offensive players only, convert to records and handle nan values
        active_offensive_rosters = filter_active_offensive_players(rosters_data, season)
        rosters_records = active_offensive_rosters.to_dict('records')
        rosters_records_clean = convert_nan_to_null(rosters_records)
        rosters_js = f"export const rosters = {json.dumps(rosters_records_clean, indent=2)};"
        with open(rosters_file, 'w') as f:
            f.write(rosters_js)
        logger.info(f"Saved active offensive rosters data: {rosters_file}")
    
    # Save schedule data
    if schedule_data is not None:
        schedule_file = lib_data_dir / "schedule.js"
        # Convert to records and handle nan values
        schedule_records = schedule_data.to_dict('records')
        schedule_records_clean = convert_nan_to_null(schedule_records)
        schedule_js = f"export const schedule = {json.dumps(schedule_records_clean, indent=2)};"
        with open(schedule_file, 'w') as f:
            f.write(schedule_js)
        logger.info(f"Saved schedule data: {schedule_file}")
    
    logger.info("All static data saved to lib/data folder successfully!")

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
        rosters_data = download_rosters_data(current_season)
        schedule_data = download_schedule_data(current_season)
        
        # Save to lib/data folder
        save(teams_data, rosters_data, schedule_data, current_season)
        
        logger.info("Static data update completed successfully!")
        
    except Exception as e:
        logger.error(f"Error in main process: {e}")
        raise

if __name__ == "__main__":
    main()
