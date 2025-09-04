interface GameLogsTableProps {
  gameLogs: any[]
  gameLogsLoading: boolean
  playerPosition: string
}

export function GameLogsTable({ gameLogs, gameLogsLoading, playerPosition }: GameLogsTableProps) {
  return (
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
              {playerPosition === "QB" && (
                <>
                  <th className="text-center py-3 font-semibold text-gray-700">CMP</th>
                  <th className="text-center py-3 font-semibold text-gray-700">ATT</th>
                  <th className="text-center py-3 font-semibold text-gray-700">YDS</th>
                  <th className="text-center py-3 font-semibold text-gray-700">CMP%</th>
                  <th className="text-center py-3 font-semibold text-gray-700">TD</th>
                  <th className="text-center py-3 font-semibold text-gray-700">INT</th>
                </>
              )}
              {(playerPosition === "QB" || playerPosition === "RB") && (
                <>
                  <th className="text-center py-3 font-semibold text-gray-700">CAR</th>
                  <th className="text-center py-3 font-semibold text-gray-700">YDS</th>
                  <th className="text-center py-3 font-semibold text-gray-700">TD</th>
                </>
              )}
              {(playerPosition === "RB" || playerPosition === "WR" || playerPosition === "TE") && (
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
                    <td colSpan={playerPosition === "QB" ? 12 : playerPosition === "RB" ? 9 : 6} className="py-3 text-left font-bold text-gray-800">
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
                  {playerPosition === "QB" && game.passing && (
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
                  {(playerPosition === "QB" || playerPosition === "RB") && game.rushing && (
                    <>
                      <td className="py-3 text-center font-medium">{game.rushing.car}</td>
                      <td className="py-3 text-center font-bold text-blue-600">{game.rushing.yds}</td>
                      <td className="py-3 text-center font-bold text-green-600">{game.rushing.td}</td>
                    </>
                  )}
                  
                  {/* RB/WR/TE Receiving Stats */}
                  {(playerPosition === "RB" || playerPosition === "WR" || playerPosition === "TE") && game.receiving && (
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
  )
}
