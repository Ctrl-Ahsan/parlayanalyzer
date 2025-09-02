"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface BetLine {
  id: string
  player: string
  prop: string
  propType: string
  value: string
  overUnder: "over" | "under"
  hitRate: number
  totalGames: number
  hits: number
  propData?: {
    high: number
    low: number
    average: number
    median: number
    totalGames: number
    hitRate: number
  }
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
    ? lines.reduce((sum, line) => sum + line.hitRate, 0) / lines.length 
    : 0

  const handleOverUnderToggle = (id: string, currentOverUnder: "over" | "under") => {
    if (onUpdateLine) {
      onUpdateLine(id, { overUnder: currentOverUnder === "over" ? "under" : "over" })
    }
  }

  const handleValueChange = (id: string, value: number[]) => {
    if (onUpdateLine) {
      onUpdateLine(id, { value: value[0].toString() })
    }
  }

  const getSliderConfig = (prop: string) => {
    if (prop.includes("TD") || prop.includes("td")) {
      return { min: 0, max: 5, step: 0.5 }
    } else if (prop.includes("Yds") || prop.includes("yards")) {
      return { min: 0, max: 200, step: 1 }
    } else if (prop.includes("Completions") || prop.includes("Receptions")) {
      return { min: 0, max: 15, step: 0.5 }
    } else if (prop.includes("Attempts")) {
      return { min: 0, max: 50, step: 1 }
    } else if (prop.includes("INT") || prop.includes("Sacks")) {
      return { min: 0, max: 3, step: 0.5 }
    }
    return { min: 0, max: 100, step: 0.5 }
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
    const maxValue = Math.max(stats.high, parseFloat(line.value) * 1.2)
    
    return (
      <div key={line.id} className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
        {/* Stacked Layout */}
        <div className="space-y-3">
          {/* Player Name */}
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">{line.player}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveLine(line.id)}
              className="text-red-500 hover:text-red-700 p-1 h-6 w-6"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Prop Type */}
          <div className="text-sm font-medium text-gray-700">
            {line.prop}
          </div>

          {/* Over/Under Toggle with Value */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleOverUnderToggle(line.id, line.overUnder)}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  line.overUnder === "over" 
                    ? "bg-green-100 text-green-700 border border-green-200" 
                    : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                OVER
              </button>
              <button
                onClick={() => handleOverUnderToggle(line.id, line.overUnder)}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  line.overUnder === "under" 
                    ? "bg-red-100 text-red-700 border border-red-200" 
                    : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                UNDER
              </button>
            </div>
            <span className="text-lg font-bold text-gray-900">{line.value}</span>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Performance Range</span>
            <span className="font-medium">{line.hits}/{line.totalGames} ({line.hitRate.toFixed(1)}%)</span>
          </div>
          
          {/* Number Line with High/Low/Average - Fixed positions */}
          <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 opacity-30"></div>
            
            {/* Low marker */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-red-500"
              style={{ left: `${(stats.low / maxValue) * 100}%` }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs text-red-600 font-medium">
                {stats.low.toFixed(1)}
              </div>
            </div>
            
            {/* Average marker */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-yellow-500"
              style={{ left: `${(stats.average / maxValue) * 100}%` }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs text-yellow-600 font-medium">
                {stats.average.toFixed(1)}
              </div>
            </div>
            
            {/* High marker */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-green-500"
              style={{ left: `${(stats.high / maxValue) * 100}%` }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs text-green-600 font-medium">
                {stats.high.toFixed(1)}
              </div>
            </div>
            
            {/* Current value indicator */}
            <div 
              className="absolute top-1 bottom-1 w-1 bg-blue-600 rounded-full shadow-sm"
              style={{ left: `${(stats.current / maxValue) * 100}%` }}
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
            min={0}
            max={maxValue}
            step={0.5}
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
          onClick={() => setSelectedTimeFrame(timeFrame)}
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
    )
  }

  // Desktop version
  return (
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
  )
}
