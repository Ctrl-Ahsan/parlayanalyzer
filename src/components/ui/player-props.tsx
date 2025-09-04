interface PlayerPropsProps {
  player: any
  gameLogsLoading: boolean
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
  rawGameLogs: any[]
}

export function PlayerProps({ player, gameLogsLoading, onAddLine, betLines = [], rawGameLogs }: PlayerPropsProps) {
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
  const handleAddProp = (player: any, prop: any) => {
    if (!onAddLine) return
    
    // Transform game logs to extract the correct value based on prop type
    const transformGameLogs = (gameLogs: any[], propType: string) => {
      return gameLogs.map(game => {
        let value = 0
        switch (propType) {
          case 'passing_yards':
            value = game.passingYards || 0
            break
          case 'passing_td':
            value = game.passingTds || 0
            break
          case 'rushing_yards':
            value = game.rushingYards || 0
            break
          case 'rushing_td':
            value = game.rushingTds || 0
            break
          case 'completions':
            value = game.completions || 0
            break
          case 'attempts':
            value = game.attempts || 0
            break
          case 'interceptions':
            value = game.interceptions || 0
            break
          case 'sacks':
            value = game.sacks || 0
            break
          case 'receiving_yards':
            value = game.receivingYards || 0
            break
          case 'receiving_td':
            value = game.receivingTds || 0
            break
          case 'receptions':
            value = game.receptions || 0
            break
          case 'targets':
            value = game.targets || 0
            break
          case 'total_yards':
            value = (game.passingYards || 0) + (game.rushingYards || 0)
            break
          case 'total_td':
            value = (game.passingTds || 0) + (game.rushingTds || 0)
            break
          default:
            value = 0
        }
        return {
          week: game.week,
          value: value,
          season: game.season
        }
      })
    }
    
    // Calculate basic stats for default value
    const values = transformGameLogs(rawGameLogs, prop.type)
      .map(game => game.value)
      .filter(val => val > 0) // Only include games where the player played
    
    const average = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0
    const defaultValue = average > 0 ? (Math.floor(average) + 0.5).toString() : "0.5"
    
    onAddLine({
      player: player.player_name,
      prop: prop.label,
      propType: prop.type,
      value: defaultValue,
      overUnder: "over",
      gameLogData: transformGameLogs(rawGameLogs, prop.type)
    })
  }

  const propButtons = getPropButtons(player)

  return (
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
            const isAdded = isPropAdded(player, prop)
            return (
              <button
                key={index}
                className={`border transition-all duration-200 rounded-lg p-4 text-center group ${
                  isAdded 
                    ? 'bg-blue-100 border-blue-400 text-blue-700 hover:bg-blue-200' 
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-blue-300 text-gray-900 group-hover:text-blue-600'
                }`}
                onClick={() => handleAddProp(player, prop)}
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
  )
}
