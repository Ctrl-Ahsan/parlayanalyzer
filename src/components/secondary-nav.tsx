"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SecondaryNavProps {
  currentView: string
  onViewChange: (view: string) => void
}

export function SecondaryNav({ currentView, onViewChange }: SecondaryNavProps) {
  const views = [
    { value: "games", label: "Games" },
    { value: "teams", label: "Teams" }
  ]

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs value={currentView} onValueChange={onViewChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            {views.map((view) => (
              <TabsTrigger
                key={view.value}
                value={view.value}
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                {view.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
