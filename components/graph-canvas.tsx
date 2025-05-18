"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import type { GraphNode, GraphEdge } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { useTheme } from "next-themes"

interface GraphCanvasProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  onNodeClick: (nodeId: string) => void
  onAddNode: (x: number, y: number) => void
  onAddEdge: (sourceId: string, targetId: string, weight?: number) => void
  startNodeId: string | null
  endNodeId: string | null
  isDirected: boolean
  isWeighted: boolean
}

export function GraphCanvas({
  nodes,
  edges,
  onNodeClick,
  onAddNode,
  onAddEdge,
  startNodeId,
  endNodeId,
  isDirected,
  isWeighted,
}: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)
  const { theme } = useTheme()

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect()
        setDimensions({
          width: Math.max(width, 300), // Ensure minimum width
          height: Math.max(height, 300), // Ensure minimum height
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Update the D3 rendering with neon cyberpunk styling
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || nodes.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // Update the grid background
    const gridSize = 30 // Smaller grid size
    const gridColor = theme === "dark" ? "rgba(0, 255, 255, 0.05)" : "rgba(0, 255, 255, 0.1)"

    const grid = svg.append("g").attr("class", "grid")

    // Horizontal grid lines
    for (let y = 0; y < dimensions.height; y += gridSize) {
      grid
        .append("line")
        .attr("x1", 0)
        .attr("y1", y)
        .attr("x2", dimensions.width)
        .attr("y2", y)
        .attr("stroke", gridColor)
        .attr("stroke-width", 1)
    }

    // Vertical grid lines
    for (let x = 0; x < dimensions.width; x += gridSize) {
      grid
        .append("line")
        .attr("x1", x)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", dimensions.height)
        .attr("stroke", gridColor)
        .attr("stroke-width", 1)
    }

    // Define arrow marker for directed graphs with neon glow
    if (isDirected) {
      const defs = svg.append("defs")

      // Glow filter
      const glowFilter = defs
        .append("filter")
        .attr("id", "glow")
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%")

      glowFilter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur")

      const feMerge = glowFilter.append("feMerge")
      feMerge.append("feMergeNode").attr("in", "coloredBlur")
      feMerge.append("feMergeNode").attr("in", "SourceGraphic")

      // Arrow marker with glow
      defs
        .append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 20)
        .attr("refY", 0)
        .attr("orient", "auto")
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#00ffff")
        .attr("filter", "url(#glow)")
    }

    // Create a group for the graph
    const g = svg.append("g")

    // Add edges with neon glow effect
    const edgeElements = g.selectAll(".edge").data(edges).enter().append("g").attr("class", "edge")

    edgeElements
      .append("line")
      .attr("x1", (d) => {
        const source = nodes.find((n) => n.id === d.source)
        return source ? source.x : 0
      })
      .attr("y1", (d) => {
        const source = nodes.find((n) => n.id === d.source)
        return source ? source.y : 0
      })
      .attr("x2", (d) => {
        const target = nodes.find((n) => n.id === d.target)
        return target ? target.x : 0
      })
      .attr("y2", (d) => {
        const target = nodes.find((n) => n.id === d.target)
        return target ? target.y : 0
      })
      .attr("stroke", (d) => {
        switch (d.state) {
          case "visited":
            return "#00ff9d" // Neon green
          case "current":
            return "#ff9d00" // Neon orange
          case "path":
            return "#d600ff" // Neon purple
          default:
            return "#4d4d6b" // Dark blue-gray
        }
      })
      .attr("stroke-width", (d) => (d.state === "path" ? 3 : 2))
      .attr("marker-end", isDirected ? "url(#arrowhead)" : "")
      .attr("class", "transition-all duration-300 ease-in-out")
      .attr("filter", (d) => (d.state !== "unvisited" ? "url(#glow)" : ""))
      .attr("opacity", (d) => (d.state === "unvisited" ? 0.6 : 1))

    // Add weight labels for weighted graphs
    if (isWeighted) {
      edgeElements
        .append("text")
        .attr("x", (d) => {
          const source = nodes.find((n) => n.id === d.source)
          const target = nodes.find((n) => n.id === d.target)
          return source && target ? (source.x + target.x) / 2 : 0
        })
        .attr("y", (d) => {
          const source = nodes.find((n) => n.id === d.source)
          const target = nodes.find((n) => n.id === d.target)
          return source && target ? (source.y + target.y) / 2 - 5 : 0
        })
        .text((d) => d.weight)
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("fill", "#00ffff") // Cyan text
        .attr("class", "select-none pointer-events-none")
        .attr("filter", "url(#glow)")
    }

    // Add nodes with neon glow effect
    const nodeElements = g
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on("start", (event, d) => {
            setDraggedNodeId(d.id)
          })
          .on("drag", (event, d) => {
            d.x = event.x
            d.y = event.y
            d3.select(event.sourceEvent.target.parentNode).attr("transform", `translate(${d.x}, ${d.y})`)

            // Update connected edges
            svg
              .selectAll("line")
              .filter((e: any) => e.source === d.id || e.target === d.id)
              .attr("x1", (e: any) => {
                const source = nodes.find((n) => n.id === e.source)
                return source ? source.x : 0
              })
              .attr("y1", (e: any) => {
                const source = nodes.find((n) => n.id === e.source)
                return source ? source.y : 0
              })
              .attr("x2", (e: any) => {
                const target = nodes.find((n) => n.id === e.target)
                return target ? target.x : 0
              })
              .attr("y2", (e: any) => {
                const target = nodes.find((n) => n.id === e.target)
                return target ? target.y : 0
              })

            // Update weight labels
            if (isWeighted) {
              svg
                .selectAll("text")
                .filter((e: any) => e.source === d.id || e.target === d.id)
                .attr("x", (e: any) => {
                  const source = nodes.find((n) => n.id === e.source)
                  const target = nodes.find((n) => n.id === e.target)
                  return source && target ? (source.x + target.x) / 2 : 0
                })
                .attr("y", (e: any) => {
                  const source = nodes.find((n) => n.id === e.source)
                  const target = nodes.find((n) => n.id === e.target)
                  return source && target ? (source.y + target.y) / 2 - 5 : 0
                })
            }
          })
          .on("end", () => {
            setDraggedNodeId(null)
          }),
      )
      .on("click", (event, d) => {
        event.stopPropagation()
        onNodeClick(d.id)
      })

    // Node outer glow
    nodeElements
      .append("circle")
      .attr("r", 16) // Smaller radius
      .attr("fill", "none")
      .attr("stroke", (d) => {
        if (d.id === startNodeId) return "#00ffff" // Cyan for start
        if (d.id === endNodeId) return "#ff00aa" // Pink for end

        switch (d.state) {
          case "visited":
            return "#00ff9d" // Neon green
          case "current":
            return "#ff9d00" // Neon orange
          case "frontier":
            return "#d600ff" // Neon purple
          case "path":
            return "#ff00aa" // Neon pink
          default:
            return "#4d4d6b" // Dark blue-gray
        }
      })
      .attr("stroke-width", 1)
      .attr("opacity", 0.5)
      .attr("filter", "url(#glow)")
      .attr("class", "transition-all duration-300 ease-in-out")

    // Node circles with glow effect
    nodeElements
      .append("circle")
      .attr("r", 13) // Smaller radius
      .attr("fill", (d) => {
        if (d.id === startNodeId) return "#00ffff" // Cyan for start
        if (d.id === endNodeId) return "#ff00aa" // Pink for end

        switch (d.state) {
          case "visited":
            return "#00ff9d" // Neon green
          case "current":
            return "#ff9d00" // Neon orange
          case "frontier":
            return "#d600ff" // Neon purple
          case "path":
            return "#ff00aa" // Neon pink
          default:
            return "#1a1a2e" // Dark blue background
        }
      })
      .attr("stroke", (d) => {
        if (d.id === startNodeId) return "#00ffff" // Cyan for start
        if (d.id === endNodeId) return "#ff00aa" // Pink for end

        switch (d.state) {
          case "visited":
            return "#00ff9d" // Neon green
          case "current":
            return "#ff9d00" // Neon orange
          case "frontier":
            return "#d600ff" // Neon purple
          case "path":
            return "#ff00aa" // Neon pink
          default:
            return "#4d4d6b" // Dark blue-gray
        }
      })
      .attr("stroke-width", 2)
      .attr("filter", (d) => {
        if (d.state !== "unvisited" || d.id === startNodeId || d.id === endNodeId) {
          return "url(#glow)"
        }
        return ""
      })
      .attr("class", "transition-all duration-300 ease-in-out cursor-pointer")

    // Update pulse animation circles
    nodeElements
      .filter((d) => d.state === "current" || d.state === "frontier")
      .append("circle")
      .attr("r", 13) // Smaller radius
      .attr("fill", "none")
      .attr("stroke", (d) => {
        switch (d.state) {
          case "current":
            return "#ff9d00" // Neon orange
          case "frontier":
            return "#d600ff" // Neon purple
          default:
            return "transparent"
        }
      })
      .attr("stroke-width", 2)
      .attr("opacity", 0.5)
      .attr("class", "pulse")

    // Node labels with neon text effect
    nodeElements
      .append("text")
      .text((d) => d.id.replace("node-", ""))
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("font-size", "10px")
      .attr("fill", "#ffffff")
      .attr("class", "select-none pointer-events-none")
      .attr("filter", "url(#glow)")

    // Add click handler to add new nodes
    svg.on("dblclick", (event) => {
      const [x, y] = d3.pointer(event)
      onAddNode(x, y)
    })
  }, [nodes, edges, dimensions, onNodeClick, startNodeId, endNodeId, isDirected, isWeighted, theme])

  return (
    <Card className="w-full h-full overflow-hidden border-0 rounded-none bg-background/50 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* D3 will render here */}
      </svg>
    </Card>
  )
}
