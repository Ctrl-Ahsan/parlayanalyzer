import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { teams } from "@/lib/data/teams"
import { PlayerProps } from "../ui/player-props"
import { GameLogsTable } from "../ui/game-logs-table"

interface PlayerDetailViewProps {
  player: any
  team: any
  onBack: () => void
  onAddLine?: (line: {
    player: string
    prop: string
    propType: string
    value: string
    overUnder: "over" | "under"
    hitRate?: number
    totalGames?: number
    hits?: number
    propData?: {
      high: number
      low: number
      average: number
      median: number
      totalGames: number
      hitRate: number
    }
    gameLogData?: Array<{
      week: number
      value: number
      season: number
    }>
  }) => void
  betLines?: Array<{
    id: string
    player: string
    prop: string
    propType: string
    value: string
    overUnder: "over" | "under"
    hitRate?: number
    totalGames?: number
    hits?: number
    propData?: {
      high: number
      low: number
      average: number
      median: number
      totalGames: number
      hitRate: number
    }
    gameLogData?: Array<{
      week: number
      value: number
      season: number
    }>
  }>
}

export function Player({ player, team, onBack, onAddLine, betLines = [] }: PlayerDetailViewProps) {
  const [gameLogs, setGameLogs] = useState<any[]>([])
  const [rawGameLogs, setRawGameLogs] = useState<any[]>([])
  const [gameLogsLoading, setGameLogsLoading] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(2024)

  // Helper function to get team info by abbreviation
  const getTeamByAbbr = (abbr: string) => {
    return teams.find(team => team.team_abbr === abbr)
  }

  // Fetch game logs from API
  const fetchGameLogs = async (playerId: string) => {
    setGameLogsLoading(true)
    try {
      const response = await fetch(`/api/nfl/game-logs?playerId=${playerId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch game logs')
      }
      const data = await response.json()
      
      // Store raw game logs for betslip processing
      setRawGameLogs(data.gameLogs || [])
      
      // Filter by selected season and separate regular season and playoffs
      const seasonGames = data.gameLogs.filter((game: any) => game.season === selectedSeason)
      const regularSeason = seasonGames.filter((game: any) => game.seasonType === 'REG')
      const playoffs = seasonGames.filter((game: any) => game.seasonType === 'POST')
      
      // Transform API data to match UI expectations
      const transformGame = (game: any) => {
        const opponentTeam = getTeamByAbbr(game.opponent)
        return {
          date: `Week ${game.week}`,
          opponent: game.opponent,
          opponentLogo: opponentTeam?.team_logo_espn || '',
          result: game.gameResult || "N/A",
          seasonType: game.seasonType,
          passing: {
            cmp: game.completions,
            att: game.attempts,
            yds: game.passingYards,
            cmp_pct: game.attempts > 0 ? ((game.completions / game.attempts) * 100).toFixed(1) : 0,
            avg: game.attempts > 0 ? (game.passingYards / game.attempts).toFixed(1) : 0,
            td: game.passingTds,
            int: game.interceptions,
            sack: game.sacks
          },
          rushing: {
            car: game.carries,
            yds: game.rushingYards,
            avg: game.carries > 0 ? (game.rushingYards / game.carries).toFixed(1) : 0,
            td: game.rushingTds
          },
          receiving: {
            rec: game.receptions,
            yds: game.receivingYards,
            avg: game.receptions > 0 ? (game.receivingYards / game.receptions).toFixed(1) : 0,
            td: game.receivingTds
          }
        }
      }
      
      const transformedLogs = [
        ...regularSeason.map(transformGame),
        ...(playoffs.length > 0 ? [{ isPlayoffHeader: true }, ...playoffs.map(transformGame)] : [])
      ]
      
      setGameLogs(transformedLogs)
    } catch (error) {
      console.error('Error fetching game logs:', error)
      setGameLogs([]) // Set empty array on error
    } finally {
      setGameLogsLoading(false)
    }
  }

  // Fetch game logs when player changes
  useEffect(() => {
    if (player && player.player_id) {
      fetchGameLogs(player.player_id)
    }
  }, [player])

  // Refilter game logs when season changes
  useEffect(() => {
    if (player && player.player_id && rawGameLogs.length > 0) {
      // Filter by selected season and separate regular season and playoffs
      const seasonGames = rawGameLogs.filter((game: any) => game.season === selectedSeason)
      const regularSeason = seasonGames.filter((game: any) => game.seasonType === 'REG')
      const playoffs = seasonGames.filter((game: any) => game.seasonType === 'POST')
      
      // Transform API data to match UI expectations
      const transformGame = (game: any) => {
        const opponentTeam = getTeamByAbbr(game.opponent)
        return {
          date: `Week ${game.week}`,
          opponent: game.opponent,
          opponentLogo: opponentTeam?.team_logo_espn || '',
          result: game.gameResult || "N/A",
          seasonType: game.seasonType,
          passing: {
            cmp: game.completions,
            att: game.attempts,
            yds: game.passingYards,
            cmp_pct: game.attempts > 0 ? ((game.completions / game.attempts) * 100).toFixed(1) : 0,
            avg: game.attempts > 0 ? (game.passingYards / game.attempts).toFixed(1) : 0,
            td: game.passingTds,
            int: game.interceptions,
            sack: game.sacks
          },
          rushing: {
            car: game.carries,
            yds: game.rushingYards,
            avg: game.carries > 0 ? (game.rushingYards / game.carries).toFixed(1) : 0,
            td: game.rushingTds
          },
          receiving: {
            rec: game.receptions,
            yds: game.receivingYards,
            avg: game.receptions > 0 ? (game.receivingYards / game.receptions).toFixed(1) : 0,
            td: game.receivingTds
          }
        }
      }
      
      const transformedLogs = [
        ...regularSeason.map(transformGame),
        ...(playoffs.length > 0 ? [{ isPlayoffHeader: true }, ...playoffs.map(transformGame)] : [])
      ]
      
      setGameLogs(transformedLogs)
    }
  }, [selectedSeason, rawGameLogs, player])

  // Format height from inches to feet and inches
  const formatHeight = (heightInches: number) => {
    const feet = Math.floor(heightInches / 12)
    const inches = heightInches % 12
    return `${feet}' ${inches}"`
  }

  return (
    <div className="p-6">
      {/* Header with back button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            ← Back to Players
          </Button>
          <div className="flex items-center space-x-3">
            <img 
              src={team.team_logo_espn} 
              alt={`${team.team_name} logo`}
              className="w-8 h-8"
            />
            <h2 className="text-2xl font-bold text-gray-900">{team.team_name}</h2>
          </div>
        </div>
      </div>

      {/* Two-Column Layout for Large Screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Left Column - Player Info & Props */}
        <div className="space-y-6">
          {/* Player Info Panel */}
          <div 
            className="relative rounded-lg shadow-xl overflow-hidden transition-all duration-500 ease-in-out"
            style={{ 
              backgroundColor: team.team_color,
            }}
          >
            {/* Player Header - Responsive Layout */}
            <div className="relative z-10 p-4 md:p-8">
              <div className="flex items-center justify-evenly gap-4 md:gap-8 min-h-32 md:h-40">
                {/* Player Headshot + Name Group */}
                <div className="flex items-center space-x-3 md:space-x-6">
                  {/* Player Headshot - Responsive sizing */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-gray-100 p-1 md:p-2 shadow-lg">
                      {player.headshot_url ? (
                        <img 
                          src={player.headshot_url} 
                          alt={`${player.player_name} headshot`}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                          <span className="text-gray-600 text-lg md:text-3xl font-bold">
                            {player.first_name?.[0]}{player.last_name?.[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Name and Position - Responsive text */}
                  <div className="text-white flex flex-col justify-center">
                    <h1 className="text-lg md:text-2xl font-bold leading-tight">{player.first_name}</h1>
                    <h1 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 leading-tight">{player.last_name}</h1>
                    <p className="text-sm md:text-lg text-white text-opacity-90">
                      {player.position} • #{player.jersey_number}
                    </p>
                  </div>
                </div>
                
                {/* Basic Stats - Responsive grid */}
                <div className="flex items-center">
                  <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 gap-y-1 md:gap-y-2 text-xs md:text-sm text-white text-opacity-80">
                    <div>
                      <span className="block text-xs mb-1">Height</span>
                      <div className="font-medium">{formatHeight(player.height)}</div>
                    </div>
                    <div>
                      <span className="block text-xs mb-1">Weight</span>
                      <div className="font-medium whitespace-nowrap">{player.weight} lbs</div>
                    </div>
                    <div>
                      <span className="block text-xs mb-1">Age</span>
                      <div className="font-medium">{player.age}</div>
                    </div>
                    <div>
                      <span className="block text-xs mb-1">Experience</span>
                      <div className="font-medium whitespace-nowrap">{player.years_exp} yrs</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Player Props Section */}
          <PlayerProps
            player={player}
            gameLogsLoading={gameLogsLoading}
            onAddLine={onAddLine}
            betLines={betLines}
            rawGameLogs={rawGameLogs}
          />
        </div>

        {/* Right Column - Game Logs */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Game Log</h3>
          
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <select 
              value={selectedSeason} 
              onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
              <option value={2022}>2022</option>
            </select>
          </div>

          {/* Game Logs Table */}
          <GameLogsTable
            gameLogs={gameLogs}
            gameLogsLoading={gameLogsLoading}
            playerPosition={player.position}
          />
        </div>
      </div>
    </div>
  )
}
