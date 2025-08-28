"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface BetLine {
  id: string
  player: string
  prop: string
  value: string
  overUnder: "over" | "under"
  hitRate: number
  totalGames: number
  hits: number
}

interface BetslipProps {
  lines: BetLine[]
  onRemoveLine: (id: string) => void
  onClearAll: () => void
  isMobile?: boolean
}

export function Betslip({ lines, onRemoveLine, onClearAll, isMobile = false }: BetslipProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const totalHitRate = lines.length > 0 
    ? lines.reduce((sum, line) => sum + line.hitRate, 0) / lines.length 
    : 0

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
                  {lines.map((line) => (
                    <div key={line.id} className="border border-gray-200 rounded-lg p-3 mb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{line.player}</h4>
                          <p className="text-sm text-gray-600">
                            {line.prop} {line.overUnder.toUpperCase()} {line.value}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-500">
                              H: {line.hits} (+{((line.hitRate - 50) * 2).toFixed(1)}%)
                            </span>
                            <span className="text-sm text-gray-500">
                              A: {line.hitRate.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveLine(line.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
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
        <div className="text-sm text-gray-600">
          {lines.length} Lines | {totalHitRate.toFixed(1)}% Hit Rate
        </div>
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
            {lines.map((line) => (
              <div key={line.id} className="border border-gray-200 rounded-lg p-3 mb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{line.player}</h4>
                    <p className="text-sm text-gray-600">
                      {line.prop} {line.overUnder.toUpperCase()} {line.value}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">
                        H: {line.hits} (+{((line.hitRate - 50) * 2).toFixed(1)}%)
                      </span>
                      <span className="text-sm text-gray-500">
                        A: {line.hitRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveLine(line.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
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
