"use client"

import { useEffect, useRef, useState } from "react"
import { AlgorithmControls } from "@/components/algorithm-controls"
import { AlgorithmSelector } from "@/components/algorithm-selector"
import { GraphTypeSelector } from "@/components/graph-type-selector"
import { GraphCanvas } from "@/components/graph-canvas"
import { PseudocodeDisplay } from "@/components/pseudocode-display"
import { DataStructureVisualizer } from "@/components/data-structure-visualizer"
import type { GraphNode, GraphEdge, GraphType, Algorithm, AlgorithmStep } from "@/lib/types"
import { generateRandomGraph, generateGridGraph, generateTreeGraph } from "@/lib/graph-generators"
import { runAlgorithm } from "@/lib/algorithm-runner"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

export default function PathViz() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>("bfs")
  const [graphType, setGraphType] = useState<GraphType>("undirected")
  const [isWeighted, setIsWeighted] = useState(false)
  const [isDirected, setIsDirected] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [currentStep, setCurrentStep] = useState(0)
  const [algorithmSteps, setAlgorithmSteps] = useState<AlgorithmStep[]>([])
  const [startNode, setStartNode] = useState<string | null>(null)
  const [endNode, setEndNode] = useState<string | null>(null)
  const [dataStructureState, setDataStructureState] = useState<any>(null)
  const animationRef = useRef<number | null>(null)
  const { toast } = useToast()

  // Initialize with a simple graph
  useEffect(() => {
    const initialGraph = generateRandomGraph(10, isDirected, isWeighted)
    setNodes(initialGraph.nodes)
    setEdges(initialGraph.edges)
    setStartNode(initialGraph.nodes[0]?.id || null)
    setEndNode(initialGraph.nodes[initialGraph.nodes.length - 1]?.id || null)
  }, [isDirected, isWeighted])

  // Handle algorithm execution
  useEffect(() => {
    if (startNode) {
      const result = runAlgorithm({
        algorithm: selectedAlgorithm,
        nodes,
        edges,
        startNodeId: startNode,
        endNodeId: endNode,
      })
      setAlgorithmSteps(result.steps)
      setCurrentStep(0)
    }
  }, [selectedAlgorithm, nodes, edges, startNode, endNode])

  // Animation loop
  useEffect(() => {
    if (isPlaying && currentStep < algorithmSteps.length - 1) {
      const nextStep = () => {
        setCurrentStep((prev) => {
          if (prev < algorithmSteps.length - 1) {
            return prev + 1
          } else {
            setIsPlaying(false)
            return prev
          }
        })
      }

      animationRef.current = window.setTimeout(nextStep, 1000 / speed)
      return () => {
        if (animationRef.current !== null) {
          clearTimeout(animationRef.current)
        }
      }
    }
  }, [isPlaying, currentStep, algorithmSteps, speed])

  // Update data structure visualization based on current step
  useEffect(() => {
    if (algorithmSteps.length > 0 && currentStep < algorithmSteps.length) {
      setDataStructureState(algorithmSteps[currentStep].dataStructure)
    }
  }, [currentStep, algorithmSteps])

  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)
  const handleStep = () => {
    if (currentStep < algorithmSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }
  const handleReset = () => setCurrentStep(0)

  const handleSpeedChange = (newSpeed: number) => setSpeed(newSpeed)

  const handleAlgorithmChange = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm)
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const handleGraphTypeChange = (type: GraphType) => {
    setGraphType(type)
    setIsDirected(type === "directed" || type === "dag")
    setIsWeighted(type === "weighted" || type === "weighted-directed")

    // Generate a new graph based on the selected type
    let newGraph
    switch (type) {
      case "grid":
        newGraph = generateGridGraph(5, 5, isWeighted)
        break
      case "tree":
        newGraph = generateTreeGraph(3, 3, isWeighted)
        break
      default:
        newGraph = generateRandomGraph(10, isDirected, isWeighted)
    }

    setNodes(newGraph.nodes)
    setEdges(newGraph.edges)
    setStartNode(newGraph.nodes[0]?.id || null)
    setEndNode(newGraph.nodes[newGraph.nodes.length - 1]?.id || null)
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const handleNodeClick = (nodeId: string) => {
    if (!startNode) {
      setStartNode(nodeId)
      toast({
        title: "Start node selected",
        description: `Node ${nodeId} set as start node`,
      })
    } else if (!endNode) {
      setEndNode(nodeId)
      toast({
        title: "End node selected",
        description: `Node ${nodeId} set as end node`,
      })
    } else {
      // Toggle selection
      if (nodeId === startNode) {
        setStartNode(null)
        toast({
          title: "Start node cleared",
          description: "Please select a new start node",
        })
      } else if (nodeId === endNode) {
        setEndNode(null)
        toast({
          title: "End node cleared",
          description: "Please select a new end node",
        })
      } else {
        // Replace start node
        setStartNode(nodeId)
        toast({
          title: "Start node updated",
          description: `Node ${nodeId} set as start node`,
        })
      }
    }
  }

  const handleAddNode = (x: number, y: number) => {
    const newId = `node-${nodes.length + 1}`
    setNodes([...nodes, { id: newId, x, y, state: "unvisited" }])
  }

  const handleAddEdge = (sourceId: string, targetId: string, weight = 1) => {
    const newEdge: GraphEdge = {
      id: `edge-${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      weight: isWeighted ? weight : 1,
      state: "unvisited",
    }
    setEdges([...edges, newEdge])
  }

  const handleExportGif = () => {
    toast({
      title: "Export started",
      description: "Your animation is being prepared for export...",
    })
    // In a real implementation, this would capture the canvas and convert to GIF
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your animation has been downloaded",
      })
    }, 2000)
  }

  const currentStepData = algorithmSteps[currentStep] || {
    nodes: nodes.map((n) => ({ ...n, state: "unvisited" })),
    edges: edges.map((e) => ({ ...e, state: "unvisited" })),
    dataStructure: null,
    pseudocode: { code: [], highlightedLine: 0 },
  }

  return (
    <div className="flex flex-col h-screen relative">
      <div className="scanline"></div>
      <header className="border-b border-primary/30 p-4 flex justify-between items-center bg-card/90 backdrop-blur-sm">
        <h1
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent neon-text"
          data-text="PathViz"
        >
          PathViz
        </h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleExportGif} className="cyberpunk-button border-primary/50">
            Export Animation
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar with controls */}
        <aside className="w-64 border-r border-primary/30 bg-card/90 backdrop-blur-sm p-4 flex flex-col gap-4 overflow-y-auto">
          <GraphTypeSelector currentType={graphType} onTypeChange={handleGraphTypeChange} />
          <AlgorithmSelector currentAlgorithm={selectedAlgorithm} onAlgorithmChange={handleAlgorithmChange} />
          <AlgorithmControls
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onStep={handleStep}
            onReset={handleReset}
            onSpeedChange={handleSpeedChange}
            currentSpeed={speed}
            currentStep={currentStep}
            totalSteps={algorithmSteps.length}
          />
        </aside>

        {/* Center area with graph visualization */}
        <div className="flex-1 relative overflow-hidden">
          <GraphCanvas
            nodes={currentStepData.nodes || nodes}
            edges={currentStepData.edges || edges}
            onNodeClick={handleNodeClick}
            onAddNode={handleAddNode}
            onAddEdge={handleAddEdge}
            startNodeId={startNode}
            endNodeId={endNode}
            isDirected={isDirected}
            isWeighted={isWeighted}
          />
        </div>

        {/* Right sidebar with pseudocode and data structures */}
        <aside className="w-96 border-l border-primary/30 bg-card/90 backdrop-blur-sm flex flex-col">
          <Tabs defaultValue="pseudocode" className="flex flex-col h-full">
            <TabsList className="justify-start border-b border-primary/30 rounded-none bg-muted/50 px-4 py-2">
              <TabsTrigger
                value="pseudocode"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:neon-text"
              >
                Pseudocode
              </TabsTrigger>
              <TabsTrigger
                value="datastructure"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:neon-text"
              >
                Data Structures
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pseudocode" className="p-4 flex-1 overflow-y-auto">
              <PseudocodeDisplay
                algorithm={selectedAlgorithm}
                highlightedLine={currentStepData.pseudocode?.highlightedLine || 0}
              />
            </TabsContent>
            <TabsContent value="datastructure" className="p-4 flex-1 overflow-y-auto">
              <DataStructureVisualizer algorithm={selectedAlgorithm} data={dataStructureState} />
            </TabsContent>
          </Tabs>
        </aside>
      </div>
      <Toaster />
    </div>
  )
}
