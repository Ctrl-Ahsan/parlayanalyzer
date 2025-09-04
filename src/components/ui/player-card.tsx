interface PlayerCardProps {
  player: any
  team: any
  onClick: () => void
}

export function PlayerCard({ player, team, onClick }: PlayerCardProps) {
  return (
    <div
      className="relative rounded-lg border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
      style={{ 
        backgroundColor: team.team_color,
        minHeight: '160px'
      }}
      onClick={onClick}
    >
      {/* Background logo with low opacity */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: `url(${team.team_logo_espn})`,
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
  )
}
