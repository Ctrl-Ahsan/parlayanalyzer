"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { DashboardContent } from "@/components/dashboard-content"
import { Betslip } from "@/components/betslip"

export default function Home() {
  const [currentSport, setCurrentSport] = useState("all")
  const [currentView, setCurrentView] = useState("games")
  const [betLines, setBetLines] = useState<Array<{
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
  }>>([])

  const handleRemoveLine = (id: string) => {
    setBetLines(lines => lines.filter(line => line.id !== id))
  }

  const handleClearAll = () => {
    setBetLines([])
  }

  const handleAddLine = (newLine: {
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
  }) => {
    const id = Date.now().toString() // Simple ID generation
    setBetLines(lines => [...lines, { ...newLine, id }])
  }

  const handleUpdateLine = (id: string, updates: Partial<{
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
  }>) => {
    setBetLines(lines => 
      lines.map(line => 
        line.id === id ? { ...line, ...updates } : line
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <Navigation 
        currentSport={currentSport}
        onSportChange={setCurrentSport}
      />

      {/* Main Content Area */}
      <div className="flex">
        {/* Dashboard Content */}
        <div className="flex-1 min-h-screen">
          <DashboardContent 
            currentView={currentView}
            currentSport={currentSport}
            onViewChange={setCurrentView}
            onAddLine={handleAddLine}
            betLines={betLines}
          />
        </div>

        {/* Desktop BetSlip */}
        <div className="hidden lg:block">
          <Betslip
            lines={betLines}
            onRemoveLine={handleRemoveLine}
            onClearAll={handleClearAll}
            onUpdateLine={handleUpdateLine}
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
          onUpdateLine={handleUpdateLine}
          isMobile={true}
        />
      </div>

      {/* Bottom padding for mobile betslip */}
      <div className="lg:hidden h-20"></div>
    </div>
  )
}
