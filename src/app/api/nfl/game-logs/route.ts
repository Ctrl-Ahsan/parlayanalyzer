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

    // Query the database for all game logs for the player (all seasons)
    const { data, error } = await supabase
      .from('nfl')
      .select('*')
      .eq('player_id', playerId)
      .order('season', { ascending: false })
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

    // Calculate prop-specific statistics
    const calculatePropStats = (propType: string) => {
      const values = gameLogs.map(game => {
        switch (propType) {
          case 'passing_yards':
            return game.passingYards;
          case 'passing_td':
            return game.passingTds;
          case 'rushing_yards':
            return game.rushingYards;
          case 'rushing_td':
            return game.rushingTds;
          case 'completions':
            return game.completions;
          case 'attempts':
            return game.attempts;
          case 'interceptions':
            return game.interceptions;
          case 'sacks':
            return game.sacks;
          case 'receiving_yards':
            return game.receivingYards;
          case 'receiving_td':
            return game.receivingTds;
          case 'receptions':
            return game.receptions;
          case 'targets':
            return game.targets;
          case 'total_yards':
            return game.passingYards + game.rushingYards;
          case 'total_td':
            return game.passingTds + game.rushingTds;
          default:
            return 0;
        }
      }).filter(val => val > 0); // Only include games where the player played

      if (values.length === 0) {
        return {
          high: 0,
          low: 0,
          average: 0,
          median: 0,
          totalGames: 0,
          hitRate: 0
        };
      }

      const sorted = values.sort((a, b) => a - b);
      const high = Math.max(...values);
      const low = Math.min(...values);
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      const median = sorted[Math.floor(sorted.length / 2)];

      return {
        high,
        low,
        average: Math.round(average * 10) / 10,
        median: Math.round(median * 10) / 10,
        totalGames: values.length,
        hitRate: 50 // Default hit rate - will be calculated based on prop value
      };
    };

    // Calculate stats for all prop types
    const propStats = {
      passing_yards: calculatePropStats('passing_yards'),
      passing_td: calculatePropStats('passing_td'),
      rushing_yards: calculatePropStats('rushing_yards'),
      rushing_td: calculatePropStats('rushing_td'),
      completions: calculatePropStats('completions'),
      attempts: calculatePropStats('attempts'),
      interceptions: calculatePropStats('interceptions'),
      sacks: calculatePropStats('sacks'),
      receiving_yards: calculatePropStats('receiving_yards'),
      receiving_td: calculatePropStats('receiving_td'),
      receptions: calculatePropStats('receptions'),
      targets: calculatePropStats('targets'),
      total_yards: calculatePropStats('total_yards'),
      total_td: calculatePropStats('total_td'),
    };

    return NextResponse.json({
      playerId,
      season: parseInt(season),
      gameLogs,
      propStats,
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
