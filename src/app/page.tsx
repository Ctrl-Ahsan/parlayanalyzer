"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { SecondaryNav } from "@/components/secondary-nav"
import { DashboardContent } from "@/components/dashboard-content"
import { Betslip } from "@/components/betslip"

// Sample bet lines for demonstration
const sampleLines = [
  {
    id: "1",
    player: "Patrick Mahomes",
    prop: "Passing TDs",
    value: "2.5",
    overUnder: "over" as const,
    hitRate: 65.2,
    totalGames: 17,
    hits: 11
  },
  {
    id: "2",
    player: "Christian McCaffrey",
    prop: "Rushing Yards",
    value: "85.5",
    overUnder: "over" as const,
    hitRate: 70.6,
    totalGames: 17,
    hits: 12
  }
]

export default function Home() {
  const [currentSport, setCurrentSport] = useState("all")
  const [currentView, setCurrentView] = useState("games")
  const [betLines, setBetLines] = useState(sampleLines)

  const handleRemoveLine = (id: string) => {
    setBetLines(lines => lines.filter(line => line.id !== id))
  }

  const handleClearAll = () => {
    setBetLines([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <Navigation 
        currentSport={currentSport}
        onSportChange={setCurrentSport}
      />

      {/* Secondary Navigation */}
      <SecondaryNav 
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Main Content Area */}
      <div className="flex">
        {/* Dashboard Content */}
        <div className="flex-1 min-h-screen">
          <DashboardContent 
            currentView={currentView}
            currentSport={currentSport}
          />
        </div>

        {/* Desktop BetSlip */}
        <div className="hidden lg:block">
          <Betslip
            lines={betLines}
            onRemoveLine={handleRemoveLine}
            onClearAll={handleClearAll}
            isMobile={false}
          />
        </div>
      </div>

      {/* Mobile BetSlip */}
      <div className="lg:hidden">
        <Betslip
          lines={betLines}
          onRemoveLine={handleRemoveLine}
          onClearAll={handleClearAll}
          isMobile={true}
        />
      </div>

      {/* Bottom padding for mobile betslip */}
      <div className="lg:hidden h-20"></div>
    </div>
  )
}
