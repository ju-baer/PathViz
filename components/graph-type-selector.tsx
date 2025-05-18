"use client"

import type { GraphType } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GraphTypeSelectorProps {
  currentType: GraphType
  onTypeChange: (type: GraphType) => void
}

export function GraphTypeSelector({ currentType, onTypeChange }: GraphTypeSelectorProps) {
  const graphTypes = [
    { value: "undirected", label: "Undirected Graph" },
    { value: "directed", label: "Directed Graph" },
    { value: "weighted", label: "Weighted Graph" },
    { value: "weighted-directed", label: "Weighted Directed Graph" },
    { value: "tree", label: "Tree" },
    { value: "dag", label: "Directed Acyclic Graph (DAG)" },
    { value: "grid", label: "Grid Graph" },
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-primary neon-text">GRAPH TYPE</h3>
        <Select value={currentType} onValueChange={(value) => onTypeChange(value as GraphType)}>
          <SelectTrigger className="cyberpunk-button border-primary/50">
            <SelectValue placeholder="Select graph type" />
          </SelectTrigger>
          <SelectContent className="bg-card/95 backdrop-blur-sm border border-primary/30">
            {graphTypes.map((type) => (
              <SelectItem key={type.value} value={type.value} className="focus:bg-primary/20 focus:text-primary">
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-primary neon-text">PRESETS</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="p-2 text-xs rounded bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/30 cyberpunk-button"
            onClick={() => onTypeChange("grid")}
          >
            Grid
          </button>
          <button
            className="p-2 text-xs rounded bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/30 cyberpunk-button"
            onClick={() => onTypeChange("tree")}
          >
            Tree
          </button>
          <button
            className="p-2 text-xs rounded bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/30 cyberpunk-button"
            onClick={() => onTypeChange("undirected")}
          >
            Random
          </button>
          <button
            className="p-2 text-xs rounded bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/30 cyberpunk-button"
            onClick={() => onTypeChange("dag")}
          >
            DAG
          </button>
        </div>
      </div>
    </div>
  )
}
