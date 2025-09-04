import { teams } from "@/lib/data/teams"
import { TeamCard } from "../ui/team-card"

interface TeamsViewProps {
  currentSport: string
  onTeamClick: (team: any) => void
}

export function Teams({ currentSport, onTeamClick }: TeamsViewProps) {
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
                    <TeamCard key={team.team_id} team={team} onClick={() => onTeamClick(team)} />
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
                    <TeamCard key={team.team_id} team={team} onClick={() => onTeamClick(team)} />
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
                    <TeamCard key={team.team_id} team={team} onClick={() => onTeamClick(team)} />
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
                    <TeamCard key={team.team_id} team={team} onClick={() => onTeamClick(team)} />
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
                    <TeamCard key={team.team_id} team={team} onClick={() => onTeamClick(team)} />
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
                    <TeamCard key={team.team_id} team={team} onClick={() => onTeamClick(team)} />
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
                    <TeamCard key={team.team_id} team={team} onClick={() => onTeamClick(team)} />
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
                    <TeamCard key={team.team_id} team={team} onClick={() => onTeamClick(team)} />
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
