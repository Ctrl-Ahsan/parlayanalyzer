"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { teams } from "@/lib/data/teams"
import { rosters } from "@/lib/data/rosters"
import { useState, useEffect } from "react"

interface DashboardContentProps {
  currentView: string
  currentSport: string
  onAddLine?: (line: {
    player: string
    prop: string
    propType: string
    value: string
    overUnder: "over" | "under"
    hitRate: number
    totalGames: number
    hits: number
    propData?: {
      high: number
      low: number
      average: number
      median: number
      totalGames: number
      hitRate: number
    }
  }) => void
  betLines?: Array<{
    id: string
    player: string
    prop: string
    propType: string
    value: string
    overUnder: "over" | "under"
    hitRate: number
    totalGames: number
    hits: number
    propData?: {
      high: number
      low: number
      average: number
      median: number
      totalGames: number
      hitRate: number
    }
  }>
}

export function DashboardContent({ currentView, currentSport, onAddLine, betLines = [] }: DashboardContentProps) {
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [showPlayers, setShowPlayers] = useState(false)
  const [expandedPlayer, setExpandedPlayer] = useState<any>(null)
  const [gameLogs, setGameLogs] = useState<any[]>([])
  const [gameLogsLoading, setGameLogsLoading] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(2024)

  // Sample data - in real app this would come from your data sources
  const sampleGames = [
    {
      id: 1,
      homeTeam: "Kansas City Chiefs",
      awayTeam: "Buffalo Bills",
      homeColor: "#E31837",
      awayColor: "#00338D",
      time: "8:20 PM ET",
      date: "Today"
    },
    {
      id: 2,
      homeTeam: "San Francisco 49ers",
      awayTeam: "Dallas Cowboys",
      homeColor: "#AA0000",
      awayColor: "#003594",
      time: "4:25 PM ET",
      date: "Today"
    },
    {
      id: 3,
      homeTeam: "Green Bay Packers",
      awayTeam: "Chicago Bears",
      homeColor: "#203731",
      awayColor: "#0B162A",
      time: "1:00 PM ET",
      date: "Tomorrow"
    }
  ]

  const samplePlayers = [
    { name: "Patrick Mahomes", team: "KC", position: "QB", color: "#E31837" },
    { name: "Josh Allen", team: "BUF", position: "QB", color: "#00338D" },
    { name: "Christian McCaffrey", team: "SF", position: "RB", color: "#AA0000" },
    { name: "Dak Prescott", team: "DAL", position: "QB", color: "#003594" }
  ]

  // Helper function to get team info by abbreviation
  const getTeamByAbbr = (abbr: string) => {
    return teams.find(team => team.team_abbr === abbr)
  }

  // Fetch game logs from API
  const fetchGameLogs = async (playerId: string, season: number) => {
    setGameLogsLoading(true)
    try {
      const response = await fetch(`/api/nfl/game-logs?playerId=${playerId}&season=${season}`)
      if (!response.ok) {
        throw new Error('Failed to fetch game logs')
      }
      const data = await response.json()
      
      // Separate regular season and playoffs
      const regularSeason = data.gameLogs.filter((game: any) => game.seasonType === 'REG')
      const playoffs = data.gameLogs.filter((game: any) => game.seasonType === 'POST')
      
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

  // Fetch game logs when player or season changes
  useEffect(() => {
    if (expandedPlayer && expandedPlayer.player_id) {
      fetchGameLogs(expandedPlayer.player_id, selectedSeason)
    }
  }, [expandedPlayer, selectedSeason])



  const handleTeamClick = (team: any) => {
    setSelectedTeam(team)
    setShowPlayers(true)
    setExpandedPlayer(null) // Reset expanded player when switching teams
  }

  const handleBackToTeams = () => {
    setSelectedTeam(null)
    setShowPlayers(false)
    setExpandedPlayer(null) // Reset expanded player when going back
  }

  const handlePlayerClick = (player: any) => {
    setExpandedPlayer(expandedPlayer?.player_id === player.player_id ? null : player)
  }

  const handleBackToPlayers = () => {
    setExpandedPlayer(null)
  }

  // Get players for selected team
  const getTeamPlayers = (teamAbbr: string) => {
    return rosters.filter(player => player.team === teamAbbr)
  }

  // Group players by position
  const groupPlayersByPosition = (players: any[]) => {
    const grouped: { [key: string]: any[] } = {}
    
    players.forEach(player => {
      if (!grouped[player.position]) {
        grouped[player.position] = []
      }
      grouped[player.position].push(player)
    })
    
    // Sort positions in a logical order
    const positionOrder = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'DB', 'K', 'P', 'LS']
    
    return positionOrder
      .filter(pos => grouped[pos])
      .reduce((acc, pos) => {
        acc[pos] = grouped[pos].sort((a, b) => a.last_name.localeCompare(b.last_name))
        return acc
      }, {} as { [key: string]: any[] })
  }

  // Format height from inches to feet and inches
  const formatHeight = (heightInches: number) => {
    const feet = Math.floor(heightInches / 12)
    const inches = heightInches % 12
    return `${feet}' ${inches}"`
  }

  // Format weight
  const formatWeight = (weight: number) => {
    return `${weight} lbs`
  }

  // Get position-specific prop buttons
  const getPropButtons = (player: any) => {
    const position = player.position
    
    if (position === "QB") {
      return [
        { label: "Pass Yds", type: "passing_yards" },
        { label: "Pass TD", type: "passing_td" },
        { label: "Rush Yds", type: "rushing_yards" },
        { label: "Rush TD", type: "rushing_td" },
        { label: "Completions", type: "completions" },
        { label: "Attempts", type: "attempts" },
        { label: "INT", type: "interceptions" },
        { label: "Sacks", type: "sacks" },
        { label: "Pass + Rush Yds", type: "total_yards" },
        { label: "Pass + Rush TD", type: "total_td" }
      ]
    } else if (position === "RB") {
      return [
        { label: "Rush Yds", type: "rushing_yards" },
        { label: "Rush TD", type: "rushing_td" },
        { label: "Rush Att", type: "rushing_attempts" },
        { label: "Rec Yds", type: "receiving_yards" },
        { label: "Rec TD", type: "receiving_td" },
        { label: "Receptions", type: "receptions" },
        { label: "Total Yds", type: "total_yards" },
        { label: "Total TD", type: "total_td" }
      ]
    } else if (position === "WR" || position === "TE") {
      return [
        { label: "Rec Yds", type: "receiving_yards" },
        { label: "Rec TD", type: "receiving_td" },
        { label: "Receptions", type: "receptions" },
        { label: "Targets", type: "targets" }
      ]
    }
    return []
  }

  // Check if a prop is already added to betslip
  const isPropAdded = (player: any, prop: any) => {
    return betLines.some(line => 
      line.player === player.player_name && line.prop === prop.label
    )
  }

  // Handle adding prop to betslip
  const handleAddProp = async (player: any, prop: any) => {
    if (!onAddLine) return
    
    try {
      // Fetch player data to get prop statistics
      const response = await fetch(`/api/nfl/game-logs?playerId=${player.player_id}&season=2024`)
      if (!response.ok) {
        throw new Error('Failed to fetch player data')
      }
      const data = await response.json()
      
      // Get prop statistics from the API response
      const propStats = data.propStats?.[prop.type]
      let defaultValue = "0.5"
      let hitRate = 50.0
      let totalGames = 17
      let hits = 8
      
      if (propStats) {
        // Use real data for defaults
        defaultValue = propStats.average.toString()
        totalGames = propStats.totalGames
        hitRate = 50.0 // Will be calculated based on prop value
        hits = Math.floor(totalGames / 2)
      } else {
        // Fallback to reasonable defaults based on prop type
        if (prop.type.includes("yards")) {
          defaultValue = "50.5"
        } else if (prop.type.includes("td")) {
          defaultValue = "0.5"
        } else if (prop.type.includes("completions") || prop.type.includes("receptions")) {
          defaultValue = "3.5"
        } else if (prop.type.includes("attempts")) {
          defaultValue = "25.5"
        }
      }
      
      onAddLine({
        player: player.player_name,
        prop: prop.label,
        propType: prop.type,
        value: defaultValue,
        overUnder: "over",
        hitRate,
        totalGames,
        hits,
        propData: propStats
      })
    } catch (error) {
      console.error('Error fetching player data:', error)
      
      // Fallback to basic data if API fails
      let defaultValue = "0.5"
      if (prop.type.includes("yards")) {
        defaultValue = "50.5"
      } else if (prop.type.includes("td")) {
        defaultValue = "0.5"
      } else if (prop.type.includes("completions") || prop.type.includes("receptions")) {
        defaultValue = "3.5"
      } else if (prop.type.includes("attempts")) {
        defaultValue = "25.5"
      }
      
      onAddLine({
        player: player.player_name,
        prop: prop.label,
        propType: prop.type,
        value: defaultValue,
        overUnder: "over",
        hitRate: 50.0,
        totalGames: 17,
        hits: 8
      })
    }
  }

  if (currentView === "games") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Games</h2>
          <p className="text-gray-600">Select a game to view available props</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sampleGames.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{game.date}</span>
                <span className="text-sm font-medium text-gray-700">{game.time}</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: game.awayColor }}
                  />
                  <span className="font-medium">{game.awayTeam}</span>
                </div>
                <div className="text-center text-gray-400">@</div>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: game.homeColor }}
                  />
                  <span className="font-medium">{game.homeTeam}</span>
                </div>
              </div>
              
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                View Props
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (currentView === "teams") {
    // Show expanded player view if a player is selected
    if (expandedPlayer && selectedTeam) {
      const propButtons = getPropButtons(expandedPlayer)

      return (
        <div className="p-6">
          {/* Header with back button */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={handleBackToPlayers}
                className="flex items-center space-x-2"
              >
                ← Back to Players
              </Button>
              <div className="flex items-center space-x-3">
                <img 
                  src={selectedTeam.team_logo_espn} 
                  alt={`${selectedTeam.team_name} logo`}
                  className="w-8 h-8"
                />
                <h2 className="text-2xl font-bold text-gray-900">{selectedTeam.team_name}</h2>
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
                  backgroundColor: selectedTeam.team_color,
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
                          {expandedPlayer.headshot_url ? (
                            <img 
                              src={expandedPlayer.headshot_url} 
                              alt={`${expandedPlayer.player_name} headshot`}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                              <span className="text-gray-600 text-lg md:text-3xl font-bold">
                                {expandedPlayer.first_name?.[0]}{expandedPlayer.last_name?.[0]}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Name and Position - Responsive text */}
                      <div className="text-white flex flex-col justify-center">
                        <h1 className="text-lg md:text-2xl font-bold leading-tight">{expandedPlayer.first_name}</h1>
                        <h1 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 leading-tight">{expandedPlayer.last_name}</h1>
                        <p className="text-sm md:text-lg text-white text-opacity-90">
                          {expandedPlayer.position} • #{expandedPlayer.jersey_number}
                        </p>
                      </div>
                    </div>
                    
                    {/* Basic Stats - Responsive grid */}
                    <div className="flex items-center">
                      <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 gap-y-1 md:gap-y-2 text-xs md:text-sm text-white text-opacity-80">
                        <div>
                          <span className="block text-xs mb-1">Height</span>
                          <div className="font-medium">{formatHeight(expandedPlayer.height)}</div>
                        </div>
                        <div>
                          <span className="block text-xs mb-1">Weight</span>
                          <div className="font-medium whitespace-nowrap">{expandedPlayer.weight} lbs</div>
                        </div>
                        <div>
                          <span className="block text-xs mb-1">Age</span>
                          <div className="font-medium">{expandedPlayer.age}</div>
                        </div>
                        <div>
                          <span className="block text-xs mb-1">Experience</span>
                          <div className="font-medium whitespace-nowrap">{expandedPlayer.years_exp} yrs</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Player Props Section - Outside in White Panel */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Player Props</h3>
                {propButtons.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500">
                      {gameLogsLoading ? "Loading player props..." : "No props available for this player."}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {propButtons.map((prop, index) => {
                      const isAdded = isPropAdded(expandedPlayer, prop)
                      return (
                        <button
                          key={index}
                          className={`border transition-all duration-200 rounded-lg p-4 text-center group ${
                            isAdded 
                              ? 'bg-blue-100 border-blue-400 text-blue-700 hover:bg-blue-200' 
                              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-blue-300 text-gray-900 group-hover:text-blue-600'
                          }`}
                          onClick={() => handleAddProp(expandedPlayer, prop)}
                        >
                          <div className="text-sm font-medium">
                            {prop.label}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
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
              <div className="overflow-x-auto">
                {gameLogsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500">Loading game logs...</div>
                  </div>
                ) : gameLogs.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500">No game logs found for this season.</div>
                  </div>
                ) : (
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 font-semibold text-gray-700 w-20">DATE</th>
                      <th className="text-left py-3 font-semibold text-gray-700 w-24">OPP</th>
                      <th className="text-left py-3 font-semibold text-gray-700 w-20">RESULT</th>
                      {expandedPlayer.position === "QB" && (
                        <>
                                                  <th className="text-center py-3 font-semibold text-gray-700">CMP</th>
                        <th className="text-center py-3 font-semibold text-gray-700">ATT</th>
                        <th className="text-center py-3 font-semibold text-gray-700">YDS</th>
                        <th className="text-center py-3 font-semibold text-gray-700">CMP%</th>
                        <th className="text-center py-3 font-semibold text-gray-700">TD</th>
                        <th className="text-center py-3 font-semibold text-gray-700">INT</th>
                        </>
                      )}
                      {(expandedPlayer.position === "QB" || expandedPlayer.position === "RB") && (
                        <>
                                                  <th className="text-center py-3 font-semibold text-gray-700">CAR</th>
                        <th className="text-center py-3 font-semibold text-gray-700">YDS</th>
                        <th className="text-center py-3 font-semibold text-gray-700">TD</th>
                        </>
                      )}
                      {(expandedPlayer.position === "RB" || expandedPlayer.position === "WR" || expandedPlayer.position === "TE") && (
                        <>
                                                  <th className="text-center py-3 font-semibold text-gray-700">REC</th>
                        <th className="text-center py-3 font-semibold text-gray-700">YDS</th>
                        <th className="text-center py-3 font-semibold text-gray-700">TD</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {gameLogs.map((game, index) => {
                      // Handle playoff header
                      if (game.isPlayoffHeader) {
                        return (
                          <tr key={index}>
                            <td colSpan={expandedPlayer.position === "QB" ? 12 : expandedPlayer.position === "RB" ? 9 : 6} className="py-3 text-left font-bold text-gray-800">
                              Playoffs
                            </td>
                          </tr>
                        )
                      }
                      
                      return (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 text-gray-600 font-medium">{game.date}</td>
                          <td className="py-3 text-gray-600 font-medium">
                            <div className="flex items-center space-x-2">
                              {game.opponentLogo && (
                                <img 
                                  src={game.opponentLogo} 
                                  alt={game.opponent}
                                  className="w-6 h-6"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              )}
                              <span>{game.opponent}</span>
                            </div>
                          </td>
                          <td className="py-3 text-gray-600 font-medium">{game.result}</td>
                        
                        {/* QB Passing Stats */}
                        {expandedPlayer.position === "QB" && game.passing && (
                          <>
                            <td className="py-3 text-center font-medium">{game.passing.cmp}</td>
                            <td className="py-3 text-center font-medium">{game.passing.att}</td>
                            <td className="py-3 text-center font-bold text-blue-600">{game.passing.yds}</td>
                            <td className="py-3 text-center font-medium">{game.passing.cmp_pct}%</td>
                            <td className="py-3 text-center font-bold text-green-600">{game.passing.td}</td>
                            <td className="py-3 text-center font-bold text-red-600">{game.passing.int}</td>
                          </>
                        )}
                        
                        {/* QB/RB Rushing Stats */}
                        {(expandedPlayer.position === "QB" || expandedPlayer.position === "RB") && game.rushing && (
                          <>
                            <td className="py-3 text-center font-medium">{game.rushing.car}</td>
                            <td className="py-3 text-center font-bold text-blue-600">{game.rushing.yds}</td>
                            <td className="py-3 text-center font-bold text-green-600">{game.rushing.td}</td>
                          </>
                        )}
                        
                        {/* RB/WR/TE Receiving Stats */}
                        {(expandedPlayer.position === "RB" || expandedPlayer.position === "WR" || expandedPlayer.position === "TE") && game.receiving && (
                          <>
                            <td className="py-3 text-center font-medium">{game.receiving.rec}</td>
                            <td className="py-3 text-center font-bold text-blue-600">{game.receiving.yds}</td>
                            <td className="py-3 text-center font-bold text-green-600">{game.receiving.td}</td>
                          </>
                        )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Show players view if a team is selected
    if (showPlayers && selectedTeam) {
      const teamPlayers = getTeamPlayers(selectedTeam.team_abbr)
      const groupedPlayers = groupPlayersByPosition(teamPlayers)

      return (
        <div className="p-6">
          {/* Header with back button */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={handleBackToTeams}
                className="flex items-center space-x-2"
              >
                ← Back to Teams
              </Button>
              <div className="flex items-center space-x-3">
                <img 
                  src={selectedTeam.team_logo_espn} 
                  alt={`${selectedTeam.team_name} logo`}
                  className="w-8 h-8"
                />
                <h2 className="text-2xl font-bold text-gray-900">{selectedTeam.team_name} Roster</h2>
              </div>
            </div>
          </div>

          {/* Position Groups */}
          {Object.entries(groupedPlayers).map(([position, players]) => (
            <div key={position} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{position}</h3>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {players.map((player) => (
                  <div
                    key={player.player_id}
                    className="relative rounded-lg border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                    style={{ 
                      backgroundColor: selectedTeam.team_color,
                      minHeight: '160px'
                    }}
                    onClick={() => handlePlayerClick(player)}
                  >
                    {/* Background logo with low opacity */}
                    <div 
                      className="absolute inset-0"
                      style={{ 
                        backgroundImage: `url(${selectedTeam.team_logo_espn})`,
                        backgroundSize: '150%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.05
                      }}
                    />
                    
                    {/* Player content */}
                    <div className="relative z-10 px-4 pt-4 h-full flex flex-col items-center">
                      {/* Player name at top */}
                      <div className="text-center mb-4">
                        <h4 className="font-bold text-white text-base leading-tight">
                          {player.player_name}
                        </h4>
                      </div>
                      
                      {/* Headshot at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                        {player.headshot_url ? (
                          <img 
                            src={player.headshot_url} 
                            alt={`${player.player_name} headshot`}
                            className="w-40 h-auto object-contain"
                            style={{ maxHeight: '120px' }}
                          />
                        ) : (
                          <div className="w-40 h-28 bg-white bg-opacity-20 flex items-center justify-center rounded">
                            <span className="text-white text-4xl font-bold">
                              {player.first_name?.[0]}{player.last_name?.[0]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }

    // Filter teams based on current sport selection
    const filteredTeams = currentSport === "nfl" 
      ? teams.filter(team => team.team_conf === "AFC" || team.team_conf === "NFC")
      : currentSport === "nba" 
        ? [] // No NBA teams yet
        : teams // Show all teams if "all" is selected

    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">NFL Teams</h2>
        </div>
        
        {/* Conference Sections */}
        {currentSport !== "nba" && (
          <>
            {/* AFC Teams */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <img 
                  src="https://raw.githubusercontent.com/nflverse/nflverse-pbp/master/AFC.png" 
                  alt="AFC" 
                  className="w-6 h-6 mr-2"
                />
                AFC
              </h3>
              
              {/* AFC East */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">East</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredTeams
                    .filter(team => team.team_conf === "AFC" && team.team_division === "AFC East")
                    .sort((a, b) => a.team_name.localeCompare(b.team_name))
                    .map((team) => (
                      <div
                        key={team.team_id}
                        className="relative rounded-lg border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                        style={{ 
                          backgroundColor: team.team_color,
                          minHeight: '120px'
                        }}
                        onClick={() => handleTeamClick(team)}
                      >
                        {/* Stacked logo above text layout */}
                        <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center">
                          <img 
                            src={team.team_logo_espn} 
                            alt={`${team.team_name} logo`}
                            className="w-16 h-16 object-contain mb-3"
                          />
                          <div className="text-center">
                            <h4 className="font-bold text-white text-base tracking-wide leading-none whitespace-nowrap">
                              {team.team_name}
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* AFC North */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">North</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredTeams
                    .filter(team => team.team_conf === "AFC" && team.team_division === "AFC North")
                    .sort((a, b) => a.team_name.localeCompare(b.team_name))
                    .map((team) => (
                      <div
                        key={team.team_id}
                        className="relative rounded-lg border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                        style={{ 
                          backgroundColor: team.team_color,
                          minHeight: '120px'
                        }}
                        onClick={() => handleTeamClick(team)}
                      >
                        {/* Stacked logo above text layout */}
                        <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center">
                          <img 
                            src={team.team_logo_espn} 
                            alt={`${team.team_name} logo`}
                            className="w-16 h-16 object-contain mb-3"
                          />
                          <div className="text-center">
                            <h4 className="font-bold text-white text-base tracking-wide leading-none whitespace-nowrap">
                              {team.team_name}
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* AFC South */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">South</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredTeams
                    .filter(team => team.team_conf === "AFC" && team.team_division === "AFC South")
                    .sort((a, b) => a.team_name.localeCompare(b.team_name))
                    .map((team) => (
                      <div
                        key={team.team_id}
                        className="relative rounded-lg border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                        style={{ 
                          backgroundColor: team.team_color,
                          minHeight: '120px'
                        }}
                        onClick={() => handleTeamClick(team)}
                      >
                        {/* Stacked logo above text layout */}
                        <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center">
                          <img 
                            src={team.team_logo_espn} 
                            alt={`${team.team_name} logo`}
                            className="w-16 h-16 object-contain mb-3"
                          />
                          <div className="text-center">
                            <h4 className="font-bold text-white text-base tracking-wide leading-none whitespace-nowrap">
                              {team.team_name}
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* AFC West */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">West</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredTeams
                    .filter(team => team.team_conf === "AFC" && team.team_division === "AFC West")
                    .sort((a, b) => a.team_name.localeCompare(b.team_name))
                    .map((team) => (
                      <div
                        key={team.team_id}
                        className="relative rounded-lg border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                        style={{ 
                          backgroundColor: team.team_color,
                          minHeight: '120px'
                        }}
                        onClick={() => handleTeamClick(team)}
                      >
                        {/* Stacked logo above text layout */}
                        <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center">
                          <img 
                            src={team.team_logo_espn} 
                            alt={`${team.team_name} logo`}
                            className="w-16 h-16 object-contain mb-3"
                          />
                          <div className="text-center">
                            <h4 className="font-bold text-white text-base tracking-wide leading-none whitespace-nowrap">
                              {team.team_name}
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* NFC Teams */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <img 
                  src="https://raw.githubusercontent.com/nflverse/nflverse-pbp/master/NFC.png" 
                  alt="NFC" 
                  className="w-6 h-6 mr-2"
                />
                NFC
              </h3>
              
              {/* NFC East */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">East</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredTeams
                    .filter(team => team.team_conf === "NFC" && team.team_division === "NFC East")
                    .sort((a, b) => a.team_name.localeCompare(b.team_name))
                    .map((team) => (
                    <div
                      key={team.team_id}
                      className="relative rounded-lg border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                      style={{ 
                        backgroundColor: team.team_color,
                        minHeight: '120px'
                      }}
                      onClick={() => handleTeamClick(team)}
                    >
                      {/* Stacked logo above text layout */}
                      <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center">
                        <img 
                          src={team.team_logo_espn} 
                          alt={`${team.team_name} logo`}
                          className="w-16 h-16 object-contain mb-3"
                        />
                        <div className="text-center">
                          <h4 className="font-bold text-white text-base tracking-wide leading-none whitespace-nowrap">
                            {team.team_name}
                          </h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* NFC North */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">North</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredTeams
                    .filter(team => team.team_conf === "NFC" && team.team_division === "NFC North")
                    .sort((a, b) => a.team_name.localeCompare(b.team_name))
                    .map((team) => (
                      <div
                        key={team.team_id}
                        className="relative rounded-lg border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                        style={{ 
                          backgroundColor: team.team_color,
                          minHeight: '120px'
                        }}
                        onClick={() => handleTeamClick(team)}
                      >
                        {/* Stacked logo above text layout */}
                        <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center">
                          <img 
                            src={team.team_logo_espn} 
                            alt={`${team.team_name} logo`}
                            className="w-16 h-16 object-contain mb-3"
                          />
                          <div className="text-center">
                            <h4 className="font-bold text-white text-base tracking-wide leading-none whitespace-nowrap">
                              {team.team_name}
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* NFC South */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">South</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredTeams
                    .filter(team => team.team_conf === "NFC" && team.team_division === "NFC South")
                    .sort((a, b) => a.team_name.localeCompare(b.team_name))
                    .map((team) => (
                      <div
                        key={team.team_id}
                        className="relative rounded-lg border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                        style={{ 
                          backgroundColor: team.team_color,
                          minHeight: '120px'
                        }}
                        onClick={() => handleTeamClick(team)}
                      >
                        {/* Stacked logo above text layout */}
                        <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center">
                          <img 
                            src={team.team_logo_espn} 
                            alt={`${team.team_name} logo`}
                            className="w-16 h-16 object-contain mb-3"
                          />
                          <div className="text-center">
                            <h4 className="font-bold text-white text-base tracking-wide leading-none whitespace-nowrap">
                              {team.team_name}
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* NFC West */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">West</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredTeams
                    .filter(team => team.team_conf === "NFC" && team.team_division === "NFC West")
                    .sort((a, b) => a.team_name.localeCompare(b.team_name))
                    .map((team) => (
                      <div
                        key={team.team_id}
                        className="relative rounded-lg border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                        style={{ 
                          backgroundColor: team.team_color,
                          minHeight: '120px'
                        }}
                        onClick={() => handleTeamClick(team)}
                      >
                        {/* Stacked logo above text layout */}
                        <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center">
                          <img 
                            src={team.team_logo_espn} 
                            alt={`${team.team_name} logo`}
                            className="w-16 h-16 object-contain mb-3"
                          />
                          <div className="text-center">
                            <h4 className="font-bold text-white text-base tracking-wide leading-none whitespace-nowrap">
                              {team.team_name}
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  if (currentView === "players") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Players</h2>
          <p className="text-gray-600">Search and analyze individual players</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {samplePlayers.map((player, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: player.color }}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{player.name}</h3>
                  <p className="text-sm text-gray-500">{player.team} • {player.position}</p>
                </div>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                View Props
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}
