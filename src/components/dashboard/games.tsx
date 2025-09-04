import { Button } from "@/components/ui/button"

export function Games() {
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
