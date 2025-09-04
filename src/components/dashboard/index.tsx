"use client"

import { useState, useEffect } from "react"
import { SecondaryNav } from "@/components/secondary-nav"
import { Games } from "./games"
import { Teams } from "./teams"
import { Roster } from "./roster"
import { Player } from "./player"

interface DashboardProps {
  currentView: string
  currentSport: string
  onViewChange: (view: string) => void
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
}

export function Dashboard({ currentView, currentSport, onViewChange, onAddLine, betLines = [] }: DashboardProps) {
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [showPlayers, setShowPlayers] = useState(false)
  const [expandedPlayer, setExpandedPlayer] = useState<any>(null)

  const handleTeamClick = (team: any) => {
    setSelectedTeam(team)
    setShowPlayers(true)
    setExpandedPlayer(null)
  }

  const handleBackToTeams = () => {
    setSelectedTeam(null)
    setShowPlayers(false)
    setExpandedPlayer(null)
  }

  const handlePlayerClick = (player: any) => {
    setExpandedPlayer(expandedPlayer?.player_id === player.player_id ? null : player)
  }

  const handleBackToPlayers = () => {
    setExpandedPlayer(null)
  }

  // Render different views based on current state
  if (currentView === "games") {
    return (
      <div className="min-h-screen bg-gray-50">
        <SecondaryNav currentView={currentView} onViewChange={onViewChange} />
        <Games />
      </div>
    )
  }

  if (currentView === "teams") {
    // Show expanded player view if a player is selected
    if (expandedPlayer && selectedTeam) {
      return (
        <div className="min-h-screen bg-gray-50">
          <SecondaryNav currentView={currentView} onViewChange={onViewChange} />
          <Player
            player={expandedPlayer}
            team={selectedTeam}
            onBack={handleBackToPlayers}
            onAddLine={onAddLine}
            betLines={betLines}
          />
        </div>
      )
    }

    // Show players view if a team is selected
    if (showPlayers && selectedTeam) {
      return (
        <div className="min-h-screen bg-gray-50">
          <SecondaryNav currentView={currentView} onViewChange={onViewChange} />
          <Roster
            team={selectedTeam}
            onBack={handleBackToTeams}
            onPlayerClick={handlePlayerClick}
          />
        </div>
      )
    }

    // Show main teams view
    return (
      <div className="min-h-screen bg-gray-50">
        <SecondaryNav currentView={currentView} onViewChange={onViewChange} />
        <Teams
          currentSport={currentSport}
          onTeamClick={handleTeamClick}
        />
      </div>
    )
  }



  return null
}
