interface TeamCardProps {
  team: any
  onClick: () => void
}

export function TeamCard({ team, onClick }: TeamCardProps) {
  return (
    <div
      className="relative rounded-lg border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
      style={{ 
        backgroundColor: team.team_color,
        minHeight: '120px'
      }}
      onClick={onClick}
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
  )
}
