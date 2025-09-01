"use client"

import { useState } from "react"
import { Search, Menu } from "lucide-react"
import { GiAmericanFootballBall, GiBasketballBall } from "react-icons/gi"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NavigationProps {
  onSportChange: (sport: string) => void
  currentSport: string
}

export function Navigation({ onSportChange, currentSport }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">Parlay Analyzer</h1>
            </div>
          </div>

          {/* Desktop Sport Toggle */}
          <div className="hidden md:flex items-end space-x-6">
            <div className="flex flex-col items-center pt-2">
              <Button
                variant={currentSport === "nfl" ? "default" : "ghost"}
                size="sm"
                className={`w-8 h-8 rounded-full p-0 ${
                  currentSport === "nfl" 
                    ? "bg-orange-600 hover:bg-orange-700" 
                    : "bg-white/20 hover:bg-white/30"
                } text-white`}
                onClick={() => onSportChange("nfl")}
                title="NFL"
              >
                <GiAmericanFootballBall className="h-3 w-3" />
              </Button>
              <span className="text-xs text-white mt-1">NFL</span>
            </div>
            <div className="flex flex-col items-center pt-2">
              <Button
                variant={currentSport === "nba" ? "default" : "ghost"}
                size="sm"
                className={`w-8 h-8 rounded-full p-0 ${
                  currentSport === "nba" 
                    ? "bg-orange-600 hover:bg-orange-700" 
                    : "bg-white/20 hover:bg-white/30"
                } text-white`}
                onClick={() => onSportChange("nba")}
                title="NBA"
              >
                <GiBasketballBall className="h-3 w-3" />
              </Button>
              <span className="text-xs text-white mt-1">NBA</span>
            </div>
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
        <div className="md:hidden pb-4 flex justify-center space-x-8">
          <div className="flex flex-col items-center">
            <Button
              variant={currentSport === "nfl" ? "default" : "ghost"}
              size="sm"
              className={`w-8 h-8 rounded-full p-0 ${
                currentSport === "nfl" 
                  ? "bg-orange-600 hover:bg-orange-700" 
                  : "bg-white/20 hover:bg-white/30"
              } text-white`}
              onClick={() => onSportChange("nfl")}
              title="NFL"
            >
              <GiAmericanFootballBall className="h-3 w-3" />
            </Button>
            <span className="text-xs text-white mt-1">NFL</span>
          </div>
          <div className="flex flex-col items-center">
            <Button
              variant={currentSport === "nba" ? "default" : "ghost"}
              size="sm"
              className={`w-8 h-8 rounded-full p-0 ${
                currentSport === "nba" 
                  ? "bg-orange-600 hover:bg-orange-700" 
                  : "bg-white/20 hover:bg-white/30"
              } text-white`}
              onClick={() => onSportChange("nba")}
              title="NBA"
            >
              <GiBasketballBall className="h-3 w-3" />
            </Button>
            <span className="text-xs text-white mt-1">NBA</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
