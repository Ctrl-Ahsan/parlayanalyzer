import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');
    const season = searchParams.get('season') || '2024';

    if (!playerId) {
      return NextResponse.json(
        { error: 'playerId parameter is required' },
        { status: 400 }
      );
    }

    // Query the database for all game logs for the season
    const { data, error } = await supabase
      .from('nfl')
      .select('*')
      .eq('player_id', playerId)
      .eq('season', parseInt(season))
      .order('week', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch game logs' },
        { status: 500 }
      );
    }

    // Transform the data to match our UI expectations
    const gameLogs = data?.map(game => ({
      week: game.week,
      opponent: game.opponent_team,
      season: game.season,
      seasonType: game.season_type,
      gameResult: game.game_result || 'N/A',
      // QB stats
      completions: game.completions || 0,
      attempts: game.attempts || 0,
      passingYards: game.passing_yards || 0,
      passingTds: game.passing_tds || 0,
      interceptions: game.interceptions || 0,
      sacks: game.sacks || 0,
      // RB stats
      carries: game.carries || 0,
      rushingYards: game.rushing_yards || 0,
      rushingTds: game.rushing_tds || 0,
      // WR/TE stats
      receptions: game.receptions || 0,
      targets: game.targets || 0,
      receivingYards: game.receiving_yards || 0,
      receivingTds: game.receiving_tds || 0,
      // Fantasy
      fantasyPoints: game.fantasy_points || 0,
      fantasyPointsPpr: game.fantasy_points_ppr || 0,
    })) || [];

    return NextResponse.json({
      playerId,
      season: parseInt(season),
      gameLogs,
      total: gameLogs.length
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
