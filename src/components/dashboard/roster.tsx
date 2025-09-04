import { Button } from "@/components/ui/button"
import { rosters } from "@/lib/data/rosters"
import { PlayerCard } from "../ui/player-card"

interface TeamPlayersViewProps {
  team: any
  onBack: () => void
  onPlayerClick: (player: any) => void
}

export function Roster({ team, onBack, onPlayerClick }: TeamPlayersViewProps) {
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

  const teamPlayers = getTeamPlayers(team.team_abbr)
  const groupedPlayers = groupPlayersByPosition(teamPlayers)

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
            ← Back to Teams
          </Button>
          <div className="flex items-center space-x-3">
            <img 
              src={team.team_logo_espn} 
              alt={`${team.team_name} logo`}
              className="w-8 h-8"
            />
            <h2 className="text-2xl font-bold text-gray-900">{team.team_name} Roster</h2>
          </div>
        </div>
      </div>

      {/* Position Groups */}
      {Object.entries(groupedPlayers).map(([position, players]) => (
        <div key={position} className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{position}</h3>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {players.map((player) => (
              <PlayerCard
                key={player.player_id}
                player={player}
                team={team}
                onClick={() => onPlayerClick(player)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
