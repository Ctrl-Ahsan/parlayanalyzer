"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { teams } from "@/lib/data/teams"
import { rosters } from "@/lib/data/rosters"
import { useState } from "react"

interface DashboardContentProps {
  currentView: string
  currentSport: string
}

export function DashboardContent({ currentView, currentSport }: DashboardContentProps) {
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [showPlayers, setShowPlayers] = useState(false)

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

  const handleTeamClick = (team: any) => {
    setSelectedTeam(team)
    setShowPlayers(true)
  }

  const handleBackToTeams = () => {
    setSelectedTeam(null)
    setShowPlayers(false)
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
