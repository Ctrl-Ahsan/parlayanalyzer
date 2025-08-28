"use client"

import { useState } from "react"
import { Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NavigationProps {
  onSportChange: (sport: string) => void
  currentSport: string
}

export function Navigation({ onSportChange, currentSport }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const sports = [
    { value: "all", label: "All Sports" },
    { value: "nfl", label: "NFL" },
    { value: "nba", label: "NBA" }
  ]

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">Parlay Analyzer</h1>
            </div>
          </div>

          {/* Desktop Sport Toggle */}
          <div className="hidden md:block">
            <Select value={currentSport} onValueChange={onSportChange}>
              <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white hover:bg-white/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sports.map((sport) => (
                  <SelectItem key={sport.value} value={sport.value}>
                    {sport.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/20 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Sport Toggle */}
        <div className="md:hidden pb-4">
          <Select value={currentSport} onValueChange={onSportChange}>
            <SelectTrigger className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sports.map((sport) => (
                <SelectItem key={sport.value} value={sport.value}>
                  {sport.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </nav>
  )
}
