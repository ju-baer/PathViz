import type { GraphNode, GraphEdge } from "@/lib/types"

interface Graph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

// Generate a random graph
export function generateRandomGraph(nodeCount: number, isDirected: boolean, isWeighted: boolean): Graph {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  // Create nodes in a circular layout with smaller radius
  const radius = 120 // Smaller radius
  const centerX = 200 // Adjusted center
  const centerY = 150 // Adjusted center

  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * 2 * Math.PI
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)

    nodes.push({
      id: `node-${i + 1}`,
      x,
      y,
      state: "unvisited",
    })
  }

  // Create edges (about 2 * nodeCount edges for a connected graph)
  const edgeCount = nodeCount * 2

  // Ensure the graph is connected by creating a spanning tree first
  for (let i = 1; i < nodeCount; i++) {
    const sourceId = `node-${i}`
    const targetId = `node-${Math.floor(Math.random() * i) + 1}`
    const weight = isWeighted ? Math.floor(Math.random() * 9) + 1 : 1

    edges.push({
      id: `edge-${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      weight,
      state: "unvisited",
    })

    // For undirected graphs, add the reverse edge
    if (!isDirected) {
      edges.push({
        id: `edge-${targetId}-${sourceId}`,
        source: targetId,
        target: sourceId,
        weight,
        state: "unvisited",
      })
    }
  }

  // Add additional random edges
  for (let i = 0; i < edgeCount - (nodeCount - 1); i++) {
    const sourceIndex = Math.floor(Math.random() * nodeCount) + 1
    let targetIndex

    do {
      targetIndex = Math.floor(Math.random() * nodeCount) + 1
    } while (targetIndex === sourceIndex)

    const sourceId = `node-${sourceIndex}`
    const targetId = `node-${targetIndex}`

    // Check if this edge already exists
    const edgeExists = edges.some((e) => e.source === sourceId && e.target === targetId)

    if (!edgeExists) {
      const weight = isWeighted ? Math.floor(Math.random() * 9) + 1 : 1

      edges.push({
        id: `edge-${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
        weight,
        state: "unvisited",
      })

      // For undirected graphs, add the reverse edge
      if (!isDirected) {
        edges.push({
          id: `edge-${targetId}-${sourceId}`,
          source: targetId,
          target: sourceId,
          weight,
          state: "unvisited",
        })
      }
    }
  }

  return { nodes, edges }
}

// Generate a grid graph
export function generateGridGraph(rows: number, cols: number, isWeighted: boolean): Graph {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  const cellSize = 40 // Smaller cell size
  const startX = 80 // Adjusted starting position
  const startY = 80 // Adjusted starting position

  // Create nodes
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const id = `node-${row * cols + col + 1}`
      const x = startX + col * cellSize
      const y = startY + row * cellSize

      nodes.push({
        id,
        x,
        y,
        state: "unvisited",
      })
    }
  }

  // Create edges (4-connected grid)
  const directions = [
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
    [-1, 0], // up
  ]

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const nodeId = `node-${row * cols + col + 1}`

      for (const [dx, dy] of directions) {
        const newRow = row + dx
        const newCol = col + dy

        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
          const neighborId = `node-${newRow * cols + newCol + 1}`
          const weight = isWeighted ? Math.floor(Math.random() * 9) + 1 : 1

          edges.push({
            id: `edge-${nodeId}-${neighborId}`,
            source: nodeId,
            target: neighborId,
            weight,
            state: "unvisited",
          })
        }
      }
    }
  }

  return { nodes, edges }
}

// Generate a tree graph
export function generateTreeGraph(depth: number, branchingFactor: number, isWeighted: boolean): Graph {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  // Helper function to create the tree recursively
  function createTree(parentId: string | null, level: number, position: number, totalPositions: number) {
    if (level > depth) return

    const id = `node-${nodes.length + 1}`
    const x = 200 + (position - totalPositions / 2) * (300 / totalPositions) // Adjusted positioning
    const y = 80 + level * 60 // Smaller vertical spacing

    nodes.push({
      id,
      x,
      y,
      state: "unvisited",
    })

    if (parentId) {
      const weight = isWeighted ? Math.floor(Math.random() * 9) + 1 : 1

      edges.push({
        id: `edge-${parentId}-${id}`,
        source: parentId,
        target: id,
        weight,
        state: "unvisited",
      })
    }

    const newTotalPositions = totalPositions * branchingFactor
    for (let i = 0; i < branchingFactor; i++) {
      const newPosition = position * branchingFactor - (branchingFactor - 1) / 2 + i
      createTree(id, level + 1, newPosition, newTotalPositions)
    }
  }

  createTree(null, 0, 0, 1)

  return { nodes, edges }
}
