"use client"

import type { Algorithm } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AlgorithmSelectorProps {
  currentAlgorithm: Algorithm
  onAlgorithmChange: (algorithm: Algorithm) => void
}

export function AlgorithmSelector({ currentAlgorithm, onAlgorithmChange }: AlgorithmSelectorProps) {
  const algorithms = [
    { value: "bfs", label: "Breadth-First Search (BFS)" },
    { value: "dfs", label: "Depth-First Search (DFS)" },
    { value: "dijkstra", label: "Dijkstra's Algorithm" },
    { value: "astar", label: "A* Search" },
    { value: "prim", label: "Prim's MST" },
    { value: "kruskal", label: "Kruskal's MST" },
    { value: "topological", label: "Topological Sort" },
    { value: "bellmanford", label: "Bellman-Ford" },
    { value: "floydwarshall", label: "Floyd-Warshall" },
    { value: "tarjan", label: "Tarjan's SCC" },
  ]

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-primary neon-text">ALGORITHM</h3>
      <Select value={currentAlgorithm} onValueChange={(value) => onAlgorithmChange(value as Algorithm)}>
        <SelectTrigger className="cyberpunk-button border-primary/50">
          <SelectValue placeholder="Select algorithm" />
        </SelectTrigger>
        <SelectContent className="bg-card/95 backdrop-blur-sm border border-primary/30">
          {algorithms.map((algorithm) => (
            <SelectItem
              key={algorithm.value}
              value={algorithm.value}
              className="focus:bg-primary/20 focus:text-primary"
            >
              {algorithm.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
