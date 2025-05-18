"use client"

import type { Algorithm } from "@/lib/types"
import { Card } from "@/components/ui/card"

interface DataStructureVisualizerProps {
  algorithm: Algorithm
  data: any
}

export function DataStructureVisualizer({ algorithm, data }: DataStructureVisualizerProps) {
  const renderQueue = (queue: string[]) => (
    <div className="space-y-2">
      <h3 className="font-bold text-primary neon-text text-sm">Queue</h3>
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {queue.length === 0 ? (
          <div className="text-muted-foreground italic text-xs">Empty</div>
        ) : (
          <>
            {queue.map((item, index) => (
              <div
                key={index}
                className="min-w-[36px] h-8 flex items-center justify-center border border-primary/30 rounded bg-card/80 backdrop-blur-sm p-1 text-xs cyberpunk-button"
              >
                {item}
              </div>
            ))}
            <div className="text-xs text-primary ml-2">← Front</div>
          </>
        )}
      </div>
    </div>
  )

  const renderStack = (stack: string[]) => (
    <div className="space-y-2">
      <h3 className="font-bold text-primary neon-text text-sm">Stack</h3>
      <div className="flex flex-col-reverse items-center gap-1 max-h-[180px] overflow-y-auto">
        {stack.length === 0 ? (
          <div className="text-muted-foreground italic text-xs">Empty</div>
        ) : (
          <>
            <div className="text-xs text-primary">← Top</div>
            {stack.map((item, index) => (
              <div
                key={index}
                className="w-full h-8 flex items-center justify-center border border-primary/30 rounded bg-card/80 backdrop-blur-sm p-1 text-xs cyberpunk-button"
              >
                {item}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )

  const renderPriorityQueue = (pq: Array<{ id: string; priority: number }>) => (
    <div className="space-y-2">
      <h3 className="font-bold text-primary neon-text text-sm">Priority Queue</h3>
      <div className="flex flex-col gap-1 max-h-[180px] overflow-y-auto">
        {pq.length === 0 ? (
          <div className="text-muted-foreground italic text-xs">Empty</div>
        ) : (
          <>
            <div className="text-xs text-primary">← Top (Lowest Priority)</div>
            {pq.map((item, index) => (
              <div
                key={index}
                className="w-full h-8 flex items-center justify-between border border-primary/30 rounded bg-card/80 backdrop-blur-sm p-1 text-xs cyberpunk-button"
              >
                <span>{item.id}</span>
                <span className="text-secondary">Priority: {item.priority}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )

  const renderDistanceMap = (distances: Record<string, number>) => (
    <div className="space-y-2">
      <h3 className="font-bold text-primary neon-text text-sm">Distances</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {Object.entries(distances).map(([node, distance]) => (
          <div
            key={node}
            className="flex items-center justify-between border border-primary/30 rounded bg-card/80 backdrop-blur-sm p-1 text-xs cyberpunk-button"
          >
            <span>{node}:</span>
            <span className="text-secondary">{distance === Number.POSITIVE_INFINITY ? "∞" : distance}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderParentMap = (parents: Record<string, string | null>) => (
    <div className="space-y-2">
      <h3 className="font-bold text-primary neon-text text-sm">Parent Pointers</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {Object.entries(parents).map(([node, parent]) => (
          <div
            key={node}
            className="flex items-center justify-between border border-primary/30 rounded bg-card/80 backdrop-blur-sm p-1 text-xs cyberpunk-button"
          >
            <span>{node}:</span>
            <span className="text-secondary">{parent || "null"}</span>
          </div>
        ))}
      </div>
    </div>
  )

  if (!data) {
    return (
      <Card className="p-4 text-center text-muted-foreground bg-card/80 backdrop-blur-sm border-l-2 border-t-2 border-primary/50">
        No data structure to visualize yet. Run the algorithm to see the data structures in action.
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {data.queue && renderQueue(data.queue)}
      {data.stack && renderStack(data.stack)}
      {data.priorityQueue && renderPriorityQueue(data.priorityQueue)}
      {data.distances && renderDistanceMap(data.distances)}
      {data.parents && renderParentMap(data.parents)}
    </div>
  )
}
