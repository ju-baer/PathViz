"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause, SkipForward, RotateCcw, Zap } from "lucide-react"
import { useState } from "react"

interface AlgorithmControlsProps {
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  onStep: () => void
  onReset: () => void
  onSpeedChange: (speed: number) => void
  currentSpeed: number
  currentStep: number
  totalSteps: number
}

export function AlgorithmControls({
  isPlaying,
  onPlay,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
  currentSpeed,
  currentStep,
  totalSteps,
}: AlgorithmControlsProps) {
  const [showSpeedOptions, setShowSpeedOptions] = useState(false)

  const speedOptions = [
    { value: 0.5, label: "0.5x" },
    { value: 1, label: "1x" },
    { value: 1.5, label: "1.5x" },
    { value: 2, label: "2x" },
    { value: 3, label: "3x" },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-primary neon-text">CONTROLS</h3>

      <div className="flex items-center justify-between gap-2">
        {isPlaying ? (
          <Button variant="outline" size="icon" onClick={onPause} className="cyberpunk-button border-primary/50">
            <Pause className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size="icon" onClick={onPlay} className="cyberpunk-button border-primary/50">
            <Play className="h-4 w-4" />
          </Button>
        )}
        <Button variant="outline" size="icon" onClick={onStep} className="cyberpunk-button border-primary/50">
          <SkipForward className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onReset} className="cyberpunk-button border-primary/50">
          <RotateCcw className="h-4 w-4" />
        </Button>

        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSpeedOptions(!showSpeedOptions)}
            className="cyberpunk-button border-primary/50 relative"
          >
            <Zap className="h-4 w-4" />
            <span className="absolute -top-2 -right-2 text-[10px] bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
              {currentSpeed}x
            </span>
          </Button>

          {showSpeedOptions && (
            <div className="absolute top-full right-0 mt-2 bg-card/95 backdrop-blur-sm border border-primary/30 rounded p-1 z-10 w-20">
              {speedOptions.map((option) => (
                <button
                  key={option.value}
                  className={`w-full text-left px-2 py-1 text-xs rounded hover:bg-primary/20 transition-colors ${
                    currentSpeed === option.value ? "bg-primary/20 text-primary" : ""
                  }`}
                  onClick={() => {
                    onSpeedChange(option.value)
                    setShowSpeedOptions(false)
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>PROGRESS</span>
          <span className="text-primary">
            {currentStep} / {totalSteps > 0 ? totalSteps - 1 : 0}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: totalSteps > 0 ? `${(currentStep / (totalSteps - 1)) * 100}%` : "0%",
              boxShadow: "0 0 10px var(--primary)",
            }}
          />
        </div>
      </div>
    </div>
  )
}
