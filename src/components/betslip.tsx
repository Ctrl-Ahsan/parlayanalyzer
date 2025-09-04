"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

interface BetLine {
  id: string
  player: string
  playerId?: string
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
}

interface BetslipProps {
  lines: BetLine[]
  onRemoveLine: (id: string) => void
  onClearAll: () => void
  onAddLine?: (line: Omit<BetLine, 'id'>) => void
  onUpdateLine?: (id: string, updates: Partial<BetLine>) => void
  isMobile?: boolean
}

type TimeFrame = "L5" | "L10" | "L20" | "2024" | "2025"

export function Betslip({ lines, onRemoveLine, onClearAll, onAddLine, onUpdateLine, isMobile = false }: BetslipProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("2024")

  const totalHitRate = lines.length > 0 
    ? lines.reduce((sum, line) => sum + (line.hitRate || 0), 0) / lines.length 
    : 0

  // Function to calculate hit rate based on prop value and over/under
  const calculateHitRate = (gameLogData: Array<{week: number, value: number, season: number}>, propValue: number, overUnder: "over" | "under", timeFrame: TimeFrame) => {
    const filteredGames = filterGamesByTimeFrame(gameLogData, timeFrame)
    const values = filteredGames.map(game => game.value).filter(val => val > 0)
    
    if (values.length === 0) return { hitRate: 0, hits: 0, totalGames: 0 }
    
    const hits = values.filter(value => {
      return overUnder === "over" ? value > propValue : value < propValue
    }).length
    
    const hitRate = (hits / values.length) * 100
    
    return {
      hitRate: Math.round(hitRate * 10) / 10,
      hits,
      totalGames: values.length
    }
  }

  // Function to filter and recalculate prop data based on time frame
  const updatePropDataForTimeFrame = (timeFrame: TimeFrame) => {
    if (!onUpdateLine || lines.length === 0) return
    
    console.log('Filtering prop data for time frame:', timeFrame, 'lines:', lines.length)
    
    // Update each line with filtered prop data
    for (const line of lines) {
      if (!line.gameLogData) {
        console.log('Skipping line - no gameLogData:', line.player)
        continue
      }
      
      // Filter games based on time frame
      const filteredGames = filterGamesByTimeFrame(line.gameLogData, timeFrame)
      
      // Recalculate stats for filtered games
      const values = filteredGames.map(game => game.value).filter(val => val > 0)
      
      if (values.length === 0) continue
      
      const sorted = values.sort((a, b) => a - b)
      const high = Math.max(...values)
      const low = Math.min(...values)
      const average = values.reduce((sum, val) => sum + val, 0) / values.length
      const median = sorted[Math.floor(sorted.length / 2)]
      
      // Calculate hit rate based on current prop value and over/under
      const hitRateData = calculateHitRate(line.gameLogData, parseFloat(line.value), line.overUnder, timeFrame)
      
      const newPropData = {
        high,
        low,
        average: Math.round(average * 10) / 10,
        median: Math.round(median * 10) / 10,
        totalGames: hitRateData.totalGames,
        hitRate: hitRateData.hitRate
      }
      
      onUpdateLine(line.id, {
        propData: newPropData,
        hitRate: hitRateData.hitRate,
        totalGames: hitRateData.totalGames,
        hits: hitRateData.hits
      })
    }
  }

  // Helper function to filter games by time frame
  const filterGamesByTimeFrame = (games: Array<{week: number, value: number, season: number}>, timeFrame: TimeFrame) => {
    const currentSeason = 2024
    const currentSeasonGames = games.filter(game => game.season === currentSeason)
    
    switch (timeFrame) {
      case 'L5':
        return currentSeasonGames.slice(-5)
      case 'L10':
        return currentSeasonGames.slice(-10)
      case 'L20':
        return currentSeasonGames.slice(-20)
      case '2024':
        return currentSeasonGames
      case '2025':
        return games.filter(game => game.season === 2025)
      default:
        return currentSeasonGames
    }
  }

  // Function to get color based on hit rate percentage
  const getHitRateColor = (hitRate: number) => {
    if (hitRate >= 70) return "#22C55E" // Green
    if (hitRate >= 50) return "#EAB308" // Yellow
    return "#EF4444" // Red
  }

  const handleOverUnderToggle = (id: string, currentOverUnder: "over" | "under") => {
    if (onUpdateLine) {
      const line = lines.find(l => l.id === id)
      if (line && line.gameLogData) {
        const newOverUnder = currentOverUnder === "over" ? "under" : "over"
        // Recalculate hit rate with new over/under
        const hitRateData = calculateHitRate(line.gameLogData, parseFloat(line.value), newOverUnder, selectedTimeFrame)
        onUpdateLine(id, { 
          overUnder: newOverUnder,
          hitRate: hitRateData.hitRate,
          hits: hitRateData.hits,
          totalGames: hitRateData.totalGames
        })
      } else {
        onUpdateLine(id, { overUnder: currentOverUnder === "over" ? "under" : "over" })
      }
    }
  }

  const handleValueChange = (id: string, value: number[]) => {
    if (onUpdateLine) {
      // Ensure value always ends in .5
      const rawValue = value[0]
      const adjustedValue = Math.floor(rawValue) + 0.5
      
      const line = lines.find(l => l.id === id)
      if (line && line.gameLogData) {
        // Recalculate hit rate with new value
        const hitRateData = calculateHitRate(line.gameLogData, adjustedValue, line.overUnder, selectedTimeFrame)
        onUpdateLine(id, { 
          value: adjustedValue.toString(),
          hitRate: hitRateData.hitRate,
          hits: hitRateData.hits,
          totalGames: hitRateData.totalGames
        })
      } else {
        onUpdateLine(id, { value: adjustedValue.toString() })
      }
    }
  }

  const getSliderConfig = (prop: string) => {
    // Touchdowns (Passing, Rushing, Receiving) - Record: 7 passing TDs, 6 rushing TDs, 5 receiving TDs
    if (prop.includes("TD") || prop.includes("td")) {
      return { min: 0.5, max: 7.5, step: 1 }
    } 
    // Passing Yards - Record: 554 yards (Norm Van Brocklin, 1951)
    else if (prop.includes("Pass") && (prop.includes("Yds") || prop.includes("yards"))) {
      return { min: 0.5, max: 524.5, step: 1 }
    }
    // Rushing Yards - Record: 296 yards (Adrian Peterson, 2007)
    else if (prop.includes("Rush") && (prop.includes("Yds") || prop.includes("yards"))) {
      return { min: 0.5, max: 299.5, step: 1 }
    }
    // Receiving Yards - Record: 336 yards (Flipper Anderson, 1989)
    else if (prop.includes("Rec") && (prop.includes("Yds") || prop.includes("yards"))) {
      return { min: 0.5, max: 349.5, step: 1 }
    }
    // Generic yards (fallback for any other yard props)
    else if (prop.includes("Yds") || prop.includes("yards")) {
      return { min: 0.5, max: 399.5, step: 1 }
    }
    // Completions - Record: 45 completions
    else if (prop.includes("Completions")) {
      return { min: 0.5, max: 49.5, step: 1 }
    }
    // Receptions - Typical range, some receivers get 15+ in a game
    else if (prop.includes("Receptions")) {
      return { min: 0.5, max: 19.5, step: 1 }
    }
    // Pass Attempts - Record: 70 attempts
    else if (prop.includes("Attempts")) {
      return { min: 0.5, max: 74.5, step: 1 }
    }
    // Interceptions - Record: 7 interceptions thrown
    else if (prop.includes("INT")) {
      return { min: 0.5, max: 7.5, step: 1 }
    }
    // Sacks - Record: 7 sacks (Derrick Thomas, 1990)
    else if (prop.includes("Sacks")) {
      return { min: 0.5, max: 7.5, step: 1 }
    }
    // Default fallback
    return { min: 0.5, max: 99.5, step: 1 }
  }

  // Use real data for performance range
  const getStatsForLine = (line: BetLine) => {
    if (line.propData) {
      return {
        high: line.propData.high,
        low: line.propData.low,
        average: line.propData.average,
        median: line.propData.median,
        current: parseFloat(line.value)
      }
    }
    
    // Calculate prop data from game logs if available
    if (line.gameLogData) {
      const filteredGames = filterGamesByTimeFrame(line.gameLogData, selectedTimeFrame)
      const values = filteredGames.map(game => game.value).filter(val => val > 0)
      
      if (values.length > 0) {
        const sorted = values.sort((a, b) => a - b)
        const high = Math.max(...values)
        const low = Math.min(...values)
        const average = values.reduce((sum, val) => sum + val, 0) / values.length
        const median = sorted[Math.floor(sorted.length / 2)]
        
        return {
          high,
          low,
          average: Math.round(average * 10) / 10,
          median: Math.round(median * 10) / 10,
          current: parseFloat(line.value)
        }
      }
    }
    
    // Fallback to mock data if no real data available
    const value = parseFloat(line.value)
    return {
      high: value * 1.8,
      low: value * 0.3,
      average: value * 1.1,
      median: value * 1.0,
      current: value
    }
  }

  const renderBetLine = (line: BetLine) => {
    const stats = getStatsForLine(line)
    const sliderConfig = getSliderConfig(line.prop)
    
    // Calculate current hit rate if we have game log data
    const currentHitRate = line.gameLogData 
      ? calculateHitRate(line.gameLogData, parseFloat(line.value), line.overUnder, selectedTimeFrame)
      : { hitRate: line.hitRate || 0, hits: line.hits || 0, totalGames: line.totalGames || 0 }
    
    return (
      <div key={line.id} className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
        {/* Compact Layout */}
        <div>
          {/* Player Name and Hit Rate Counter */}
          <div className="flex items-start justify-between">
            <div className="leading-none flex-1">
              {/* Player Name and Close Button */}
              <div className="mb-1">
                <h4 className="font-semibold text-gray-900 leading-tight">{line.player}</h4>
              </div>
              
              <div className="text-sm font-bold text-gray-600 uppercase tracking-wide font-roboto-condensed leading-none">
                {line.prop}
              </div>
              {/* Over/Under Toggle with Adjacent Value */}
              <div className="flex items-center space-x-2 mt-0.5">
                <button
                  onClick={() => handleOverUnderToggle(line.id, line.overUnder)}
                  className={`w-16 py-0.5 text-xs font-bold rounded transition-colors text-center ${
                    line.overUnder === "over" 
                      ? "bg-green-100 text-green-700 border border-green-200" 
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  {line.overUnder.toUpperCase()}
                </button>
                <span className="text-base font-bold text-gray-900">{line.value}</span>
              </div>
            </div>
            
            {/* Hit Rate Circle */}
            <div className="flex items-center ml-3">
              <div className="w-16 h-16 flex-shrink-0">
                <CircularProgressbar
                  value={currentHitRate.hitRate}
                  text={`${currentHitRate.hits}/${currentHitRate.totalGames}`}
                  styles={{
                    path: {
                      stroke: getHitRateColor(currentHitRate.hitRate),
                      strokeWidth: 8,
                    },
                    trail: {
                      stroke: '#f3f4f6',
                      strokeWidth: 8,
                    },
                    text: {
                      fill: '#374151',
                      fontSize: '22px',
                      fontWeight: 'bold',
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-3">
          <div className="text-xs text-gray-500 mb-2">
            <span>Performance Range</span>
          </div>
          
          {/* Number Line with High/Low/Average - Fixed positions */}
          <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 opacity-30"></div>
            
            {/* Low marker */}
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <button 
                  className="absolute top-0 bottom-0 w-3 cursor-pointer hover:bg-red-600 transition-colors"
                  style={{ left: `${(stats.low / sliderConfig.max) * 100}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-red-500 transform -translate-x-1/2" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Low: {stats.low.toFixed(1)}</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Average marker */}
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <button 
                  className="absolute top-0 bottom-0 w-3 cursor-pointer hover:bg-yellow-600 transition-colors"
                  style={{ left: `${(stats.average / sliderConfig.max) * 100}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-yellow-500 transform -translate-x-1/2" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Avg: {stats.average.toFixed(1)}</p>
              </TooltipContent>
            </Tooltip>
            
            {/* High marker */}
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <button 
                  className="absolute top-0 bottom-0 w-3 cursor-pointer hover:bg-green-600 transition-colors"
                  style={{ left: `${(stats.high / sliderConfig.max) * 100}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-green-500 transform -translate-x-1/2" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>High: {stats.high.toFixed(1)}</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Game log dots - filtered by time frame */}
            {line.gameLogData && filterGamesByTimeFrame(line.gameLogData, selectedTimeFrame).map((game, index) => {
              const gameValue = game.value
              if (gameValue <= 0) return null // Don't show games with no data
              
              // Don't show dots that exactly match the high/low values (red/green lines already show these)
              if (gameValue === stats.high || gameValue === stats.low) return null
              
              const position = Math.min(Math.max((gameValue / sliderConfig.max) * 100, 0.5), 99.5)
              return (
                <div
                  key={`${game.week}-${game.season}-${index}`}
                  className="absolute w-1.5 h-1.5 bg-gray-500 rounded-full opacity-70 hover:opacity-100 hover:bg-blue-500 transition-all"
                  style={{ 
                    left: `${position}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={`Week ${game.week} (${game.season}): ${gameValue}`}
                />
              )
            })}

            {/* Current value indicator */}
            <div 
              className="absolute top-1 bottom-1 w-1 bg-blue-600 rounded-full shadow-sm"
              style={{ 
                left: `${Math.min(Math.max((stats.current / sliderConfig.max) * 100, 0.5), 99.5)}%`,
                transform: 'translateX(-50%)'
              }}
            ></div>
          </div>
        </div>

        {/* Value Slider */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Adjust Value</span>
            <span className="text-xs font-medium text-gray-700">{line.value}</span>
          </div>
          <Slider
            value={[parseFloat(line.value) || 0]}
            onValueChange={(value) => handleValueChange(line.id, value)}
            min={sliderConfig.min}
            max={sliderConfig.max}
            step={sliderConfig.step}
            className="w-full"
          />
        </div>
      </div>
    )
  }

  const renderTimeFrameTabs = () => (
    <div className="flex items-center space-x-1 mb-4 p-1 bg-gray-100 rounded-lg">
      {(["L5", "L10", "L20", "2024", "2025"] as TimeFrame[]).map((timeFrame) => (
        <button
          key={timeFrame}
          onClick={() => {
            setSelectedTimeFrame(timeFrame)
            updatePropDataForTimeFrame(timeFrame)
          }}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            selectedTimeFrame === timeFrame
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {timeFrame}
        </button>
      ))}
    </div>
  )

  if (isMobile) {
    return (
      <TooltipProvider>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-4 bg-blue-600 text-white cursor-pointer">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">
                  {lines.length} Lines | {totalHitRate.toFixed(1)}% Hit Rate
                </span>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="max-h-96 overflow-y-auto p-4">
              {lines.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Plus className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No lines added yet</p>
                  <p className="text-sm">Start building your parlay!</p>
                </div>
              ) : (
                <>
                  {renderTimeFrameTabs()}
                  {lines.map(renderBetLine)}
                  
                  <div className="flex space-x-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={onClearAll}
                      className="flex-1"
                    >
                      Clear All
                    </Button>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      Analyze Parlay
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
        </div>
      </TooltipProvider>
    )
  }

  // Desktop version
  return (
    <TooltipProvider>
      <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="sticky top-0 bg-white pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Betslip</h3>
        <div className="text-sm text-gray-600 mb-4">
          {lines.length} Lines | {totalHitRate.toFixed(1)}% Hit Rate
        </div>
        {lines.length > 0 && renderTimeFrameTabs()}
      </div>

      <div className="mt-4">
        {lines.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Plus className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No lines added yet</p>
            <p className="text-sm">Start building your parlay!</p>
          </div>
        ) : (
          <>
            {lines.map(renderBetLine)}
            
            <div className="flex space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={onClearAll}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                Analyze Parlay
              </Button>
            </div>
          </>
        )}
      </div>
      </div>
    </TooltipProvider>
  )
}
