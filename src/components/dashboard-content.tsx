"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { teams } from "@/lib/data/teams"

interface DashboardContentProps {
  currentView: string
  currentSport: string
}

export function DashboardContent({ currentView, currentSport }: DashboardContentProps) {
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
          <p className="text-gray-600">
            {currentSport === "nfl" 
              ? "All NFL teams organized by conference and division"
              : currentSport === "nba"
                ? "NBA teams coming soon"
                : "All available teams"
            }
          </p>
        </div>
        
        {/* Conference Sections */}
        {currentSport !== "nba" && (
          <>
            {/* AFC Teams */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
                AFC Teams
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTeams
                  .filter(team => team.team_conf === "AFC")
                  .sort((a, b) => a.team_division.localeCompare(b.team_division) || a.team_name.localeCompare(b.team_name))
                  .map((team) => (
                    <div
                      key={team.team_id}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: team.team_color }}
                        >
                          {team.team_abbr}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {team.team_name}
                          </h4>
                          <p className="text-xs text-gray-500">{team.team_division}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-1">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: team.team_color }}
                          />
                          {team.team_color2 && team.team_color2 !== "#a5acaf" && (
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: team.team_color2 }}
                            />
                          )}
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-xs"
                        >
                          View Players
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* NFC Teams */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                NFC Teams
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTeams
                  .filter(team => team.team_conf === "NFC")
                  .sort((a, b) => a.team_division.localeCompare(b.team_division) || a.team_name.localeCompare(b.team_name))
                  .map((team) => (
                    <div
                      key={team.team_id}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: team.team_color }}
                        >
                          {team.team_abbr}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {team.team_name}
                          </h4>
                          <p className="text-xs text-gray-500">{team.team_division}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-1">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: team.team_color }}
                          />
                          {team.team_color2 && team.team_color2 !== "#a5acaf" && (
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: team.team_color2 }}
                            />
                          )}
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-xs"
                        >
                          View Players
                        </Button>
                      </div>
                    </div>
                  ))}
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
