"use client"

import type { Algorithm } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { getPseudocode } from "@/lib/pseudocode"

interface PseudocodeDisplayProps {
  algorithm: Algorithm
  highlightedLine: number
}

export function PseudocodeDisplay({ algorithm, highlightedLine }: PseudocodeDisplayProps) {
  const pseudocode = getPseudocode(algorithm)

  // Update the pseudocode display with cyberpunk styling
  return (
    <Card className="p-3 font-mono text-sm bg-card/80 backdrop-blur-sm border-l-2 border-t-2 border-primary/50">
      <h3 className="font-bold mb-2 text-primary neon-text text-sm">{pseudocode.title}</h3>
      <pre className="whitespace-pre-wrap text-xs">
        {pseudocode.code.map((line, index) => (
          <div
            key={index}
            className={`py-0.5 px-2 rounded transition-all duration-300 ${
              index === highlightedLine ? "bg-primary/20 text-primary neon-text font-bold" : ""
            }`}
          >
            {line}
          </div>
        ))}
      </pre>
    </Card>
  )
}
