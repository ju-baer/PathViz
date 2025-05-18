import type { GraphNode, GraphEdge, AlgorithmRunParams, AlgorithmResult, AlgorithmStep } from "@/lib/types"
import { getPseudocode } from "@/lib/pseudocode"

export function runAlgorithm(params: AlgorithmRunParams): AlgorithmResult {
  const { algorithm, nodes, edges, startNodeId, endNodeId } = params

  switch (algorithm) {
    case "bfs":
      return runBFS(nodes, edges, startNodeId, endNodeId)
    case "dfs":
      return runDFS(nodes, edges, startNodeId, endNodeId)
    case "dijkstra":
      return runDijkstra(nodes, edges, startNodeId, endNodeId)
    case "astar":
      return runAStar(nodes, edges, startNodeId, endNodeId)
    case "prim":
      return runPrim(nodes, edges, startNodeId)
    case "kruskal":
      return runKruskal(nodes, edges)
    case "topological":
      return runTopologicalSort(nodes, edges)
    case "bellmanford":
      return runBellmanFord(nodes, edges, startNodeId)
    case "floydwarshall":
      return runFloydWarshall(nodes, edges)
    case "tarjan":
      return runTarjan(nodes, edges)
    default:
      return { steps: [] }
  }
}

// Helper function to create a deep copy of nodes and edges
function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// BFS Implementation
function runBFS(
  originalNodes: GraphNode[],
  originalEdges: GraphEdge[],
  startNodeId: string,
  endNodeId: string | null | undefined,
): AlgorithmResult {
  const steps: AlgorithmStep[] = []
  const pseudocode = getPseudocode("bfs")

  // Initialize
  let nodes = deepCopy(originalNodes)
  let edges = deepCopy(originalEdges)
  const queue: string[] = [startNodeId]
  const visited = new Set<string>([startNodeId])
  const parents: Record<string, string | null> = {}
  parents[startNodeId] = null

  // Set start node as current
  nodes = nodes.map((node) => ({
    ...node,
    state: node.id === startNodeId ? "current" : "unvisited",
  }))

  // Add initial step
  steps.push({
    nodes,
    edges,
    dataStructure: {
      queue: [...queue],
      visited: Array.from(visited),
      parents: { ...parents },
    },
    pseudocode: {
      code: pseudocode.code,
      highlightedLine: 0,
    },
  })

  // BFS algorithm
  while (queue.length > 0) {
    const currentNodeId = queue.shift()!

    // Mark current node as visited
    nodes = nodes.map((node) => ({
      ...node,
      state:
        node.id === currentNodeId
          ? "current"
          : node.state === "frontier"
            ? "frontier"
            : visited.has(node.id)
              ? "visited"
              : "unvisited",
    }))

    // Add step after dequeuing
    steps.push({
      nodes,
      edges,
      dataStructure: {
        queue: [...queue],
        visited: Array.from(visited),
        parents: { ...parents },
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 1,
      },
    })

    // If we found the end node, break
    if (currentNodeId === endNodeId) {
      break
    }

    // Find all neighbors
    const neighbors: string[] = []
    edges.forEach((edge) => {
      if (edge.source === currentNodeId) {
        neighbors.push(edge.target)
      } else if (edge.target === currentNodeId) {
        // For undirected graphs
        neighbors.push(edge.source)
      }
    })

    // Process each neighbor
    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId)
        queue.push(neighborId)
        parents[neighborId] = currentNodeId

        // Mark neighbor as frontier
        nodes = nodes.map((node) => ({
          ...node,
          state: node.id === neighborId ? "frontier" : node.state,
        }))

        // Mark edge as visited
        edges = edges.map((edge) => ({
          ...edge,
          state:
            (edge.source === currentNodeId && edge.target === neighborId) ||
            (edge.source === neighborId && edge.target === currentNodeId)
              ? "visited"
              : edge.state,
        }))

        // Add step after processing each neighbor
        steps.push({
          nodes,
          edges,
          dataStructure: {
            queue: [...queue],
            visited: Array.from(visited),
            parents: { ...parents },
          },
          pseudocode: {
            code: pseudocode.code,
            highlightedLine: 3,
          },
        })
      }
    }

    // Mark current node as fully visited
    nodes = nodes.map((node) => ({
      ...node,
      state: node.id === currentNodeId ? "visited" : node.state,
    }))

    // Add step after processing all neighbors
    steps.push({
      nodes,
      edges,
      dataStructure: {
        queue: [...queue],
        visited: Array.from(visited),
        parents: { ...parents },
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 4,
      },
    })
  }

  // If end node is specified, highlight the path
  if (endNodeId && parents[endNodeId]) {
    const path: string[] = []
    let current = endNodeId

    while (current) {
      path.unshift(current)
      current = parents[current] as string
    }

    // Mark path nodes and edges
    nodes = nodes.map((node) => ({
      ...node,
      state: path.includes(node.id) ? "path" : node.state,
    }))

    edges = edges.map((edge) => {
      for (let i = 0; i < path.length - 1; i++) {
        if (
          (edge.source === path[i] && edge.target === path[i + 1]) ||
          (edge.source === path[i + 1] && edge.target === path[i])
        ) {
          return { ...edge, state: "path" }
        }
      }
      return edge
    })

    // Add final step with path
    steps.push({
      nodes,
      edges,
      dataStructure: {
        queue: [],
        visited: Array.from(visited),
        parents: { ...parents },
        path,
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 5,
      },
    })
  }

  return { steps }
}

// DFS Implementation
function runDFS(
  originalNodes: GraphNode[],
  originalEdges: GraphEdge[],
  startNodeId: string,
  endNodeId: string | null | undefined,
): AlgorithmResult {
  const steps: AlgorithmStep[] = []
  const pseudocode = getPseudocode("dfs")

  // Initialize
  let nodes = deepCopy(originalNodes)
  let edges = deepCopy(originalEdges)
  const stack: string[] = [startNodeId]
  const visited = new Set<string>()
  const parents: Record<string, string | null> = {}
  parents[startNodeId] = null

  // Set start node as current
  nodes = nodes.map((node) => ({
    ...node,
    state: node.id === startNodeId ? "current" : "unvisited",
  }))

  // Add initial step
  steps.push({
    nodes,
    edges,
    dataStructure: {
      stack: [...stack],
      visited: Array.from(visited),
      parents: { ...parents },
    },
    pseudocode: {
      code: pseudocode.code,
      highlightedLine: 0,
    },
  })

  // DFS algorithm
  while (stack.length > 0) {
    const currentNodeId = stack.pop()!

    if (visited.has(currentNodeId)) {
      continue
    }

    visited.add(currentNodeId)

    // Mark current node as visited
    nodes = nodes.map((node) => ({
      ...node,
      state:
        node.id === currentNodeId
          ? "current"
          : node.state === "frontier"
            ? "frontier"
            : visited.has(node.id)
              ? "visited"
              : "unvisited",
    }))

    // Add step after popping from stack
    steps.push({
      nodes,
      edges,
      dataStructure: {
        stack: [...stack],
        visited: Array.from(visited),
        parents: { ...parents },
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 1,
      },
    })

    // If we found the end node, break
    if (currentNodeId === endNodeId) {
      break
    }

    // Find all neighbors
    const neighbors: string[] = []
    edges.forEach((edge) => {
      if (edge.source === currentNodeId) {
        neighbors.push(edge.target)
      } else if (edge.target === currentNodeId) {
        // For undirected graphs
        neighbors.push(edge.source)
      }
    })

    // Process each neighbor in reverse order (to maintain DFS order when popping)
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighborId = neighbors[i]
      if (!visited.has(neighborId)) {
        stack.push(neighborId)
        if (!parents[neighborId]) {
          parents[neighborId] = currentNodeId
        }

        // Mark neighbor as frontier
        nodes = nodes.map((node) => ({
          ...node,
          state: node.id === neighborId ? "frontier" : node.state,
        }))

        // Mark edge as visited
        edges = edges.map((edge) => ({
          ...edge,
          state:
            (edge.source === currentNodeId && edge.target === neighborId) ||
            (edge.source === neighborId && edge.target === currentNodeId)
              ? "visited"
              : edge.state,
        }))

        // Add step after processing each neighbor
        steps.push({
          nodes,
          edges,
          dataStructure: {
            stack: [...stack],
            visited: Array.from(visited),
            parents: { ...parents },
          },
          pseudocode: {
            code: pseudocode.code,
            highlightedLine: 3,
          },
        })
      }
    }

    // Mark current node as fully visited
    nodes = nodes.map((node) => ({
      ...node,
      state: node.id === currentNodeId ? "visited" : node.state,
    }))

    // Add step after processing all neighbors
    steps.push({
      nodes,
      edges,
      dataStructure: {
        stack: [...stack],
        visited: Array.from(visited),
        parents: { ...parents },
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 4,
      },
    })
  }

  // If end node is specified, highlight the path
  if (endNodeId && parents[endNodeId]) {
    const path: string[] = []
    let current = endNodeId

    while (current) {
      path.unshift(current)
      current = parents[current] as string
    }

    // Mark path nodes and edges
    nodes = nodes.map((node) => ({
      ...node,
      state: path.includes(node.id) ? "path" : node.state,
    }))

    edges = edges.map((edge) => {
      for (let i = 0; i < path.length - 1; i++) {
        if (
          (edge.source === path[i] && edge.target === path[i + 1]) ||
          (edge.source === path[i + 1] && edge.target === path[i])
        ) {
          return { ...edge, state: "path" }
        }
      }
      return edge
    })

    // Add final step with path
    steps.push({
      nodes,
      edges,
      dataStructure: {
        stack: [],
        visited: Array.from(visited),
        parents: { ...parents },
        path,
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 5,
      },
    })
  }

  return { steps }
}

// Dijkstra's Algorithm Implementation
function runDijkstra(
  originalNodes: GraphNode[],
  originalEdges: GraphEdge[],
  startNodeId: string,
  endNodeId: string | null | undefined,
): AlgorithmResult {
  const steps: AlgorithmStep[] = []
  const pseudocode = getPseudocode("dijkstra")

  // Initialize
  let nodes = deepCopy(originalNodes)
  let edges = deepCopy(originalEdges)

  // Initialize distances and parents
  const distances: Record<string, number> = {}
  const parents: Record<string, string | null> = {}
  const visited = new Set<string>()

  // Initialize priority queue (simple array implementation)
  const priorityQueue: Array<{ id: string; priority: number }> = []

  // Set initial distances to Infinity and start node to 0
  nodes.forEach((node) => {
    distances[node.id] = node.id === startNodeId ? 0 : Number.POSITIVE_INFINITY
    parents[node.id] = null
  })

  // Add start node to priority queue
  priorityQueue.push({ id: startNodeId, priority: 0 })

  // Set start node as current
  nodes = nodes.map((node) => ({
    ...node,
    state: node.id === startNodeId ? "current" : "unvisited",
  }))

  // Add initial step
  steps.push({
    nodes,
    edges,
    dataStructure: {
      priorityQueue: [...priorityQueue],
      distances: { ...distances },
      parents: { ...parents },
      visited: Array.from(visited),
    },
    pseudocode: {
      code: pseudocode.code,
      highlightedLine: 0,
    },
  })

  // Dijkstra's algorithm
  while (priorityQueue.length > 0) {
    // Sort priority queue and get node with minimum distance
    priorityQueue.sort((a, b) => a.priority - b.priority)
    const { id: currentNodeId } = priorityQueue.shift()!

    // Skip if already visited
    if (visited.has(currentNodeId)) {
      continue
    }

    visited.add(currentNodeId)

    // Mark current node as visited
    nodes = nodes.map((node) => ({
      ...node,
      state:
        node.id === currentNodeId
          ? "current"
          : node.state === "frontier"
            ? "frontier"
            : visited.has(node.id)
              ? "visited"
              : "unvisited",
    }))

    // Add step after selecting node
    steps.push({
      nodes,
      edges,
      dataStructure: {
        priorityQueue: [...priorityQueue],
        distances: { ...distances },
        parents: { ...parents },
        visited: Array.from(visited),
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 1,
      },
    })

    // If we found the end node, break
    if (currentNodeId === endNodeId) {
      break
    }

    // Find all neighbors
    const neighbors: Array<{ id: string; weight: number }> = []
    edges.forEach((edge) => {
      if (edge.source === currentNodeId) {
        neighbors.push({ id: edge.target, weight: edge.weight })
      } else if (edge.target === currentNodeId) {
        // For undirected graphs
        neighbors.push({ id: edge.source, weight: edge.weight })
      }
    })

    // Process each neighbor
    for (const { id: neighborId, weight } of neighbors) {
      if (!visited.has(neighborId)) {
        const newDistance = distances[currentNodeId] + weight

        if (newDistance < distances[neighborId]) {
          distances[neighborId] = newDistance
          parents[neighborId] = currentNodeId
          priorityQueue.push({ id: neighborId, priority: newDistance })

          // Mark neighbor as frontier
          nodes = nodes.map((node) => ({
            ...node,
            state: node.id === neighborId ? "frontier" : node.state,
          }))

          // Mark edge as visited
          edges = edges.map((edge) => ({
            ...edge,
            state:
              (edge.source === currentNodeId && edge.target === neighborId) ||
              (edge.source === neighborId && edge.target === currentNodeId)
                ? "visited"
                : edge.state,
          }))
        }

        // Add step after processing each neighbor
        steps.push({
          nodes,
          edges,
          dataStructure: {
            priorityQueue: [...priorityQueue],
            distances: { ...distances },
            parents: { ...parents },
            visited: Array.from(visited),
          },
          pseudocode: {
            code: pseudocode.code,
            highlightedLine: 3,
          },
        })
      }
    }

    // Mark current node as fully visited
    nodes = nodes.map((node) => ({
      ...node,
      state: node.id === currentNodeId ? "visited" : node.state,
    }))

    // Add step after processing all neighbors
    steps.push({
      nodes,
      edges,
      dataStructure: {
        priorityQueue: [...priorityQueue],
        distances: { ...distances },
        parents: { ...parents },
        visited: Array.from(visited),
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 4,
      },
    })
  }

  // If end node is specified, highlight the path
  if (endNodeId && parents[endNodeId]) {
    const path: string[] = []
    let current = endNodeId

    while (current) {
      path.unshift(current)
      current = parents[current] as string
    }

    // Mark path nodes and edges
    nodes = nodes.map((node) => ({
      ...node,
      state: path.includes(node.id) ? "path" : node.state,
    }))

    edges = edges.map((edge) => {
      for (let i = 0; i < path.length - 1; i++) {
        if (
          (edge.source === path[i] && edge.target === path[i + 1]) ||
          (edge.source === path[i + 1] && edge.target === path[i])
        ) {
          return { ...edge, state: "path" }
        }
      }
      return edge
    })

    // Add final step with path
    steps.push({
      nodes,
      edges,
      dataStructure: {
        priorityQueue: [],
        distances: { ...distances },
        parents: { ...parents },
        visited: Array.from(visited),
        path,
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 5,
      },
    })
  }

  return { steps }
}

// A* Search Implementation
function runAStar(
  originalNodes: GraphNode[],
  originalEdges: GraphEdge[],
  startNodeId: string,
  endNodeId: string | null | undefined,
): AlgorithmResult {
  const steps: AlgorithmStep[] = []
  const pseudocode = getPseudocode("astar")

  if (!endNodeId) {
    return { steps: [] }
  }

  // Initialize
  let nodes = deepCopy(originalNodes)
  let edges = deepCopy(originalEdges)

  // Initialize distances and parents
  const gScore: Record<string, number> = {}
  const fScore: Record<string, number> = {}
  const parents: Record<string, string | null> = {}
  const visited = new Set<string>()

  // Initialize priority queue (simple array implementation)
  const openSet: Array<{ id: string; priority: number }> = []

  // Set initial scores
  nodes.forEach((node) => {
    gScore[node.id] = node.id === startNodeId ? 0 : Number.POSITIVE_INFINITY
    fScore[node.id] =
      node.id === startNodeId ? heuristic(node, nodes.find((n) => n.id === endNodeId)!) : Number.POSITIVE_INFINITY
    parents[node.id] = null
  })

  // Add start node to open set
  openSet.push({ id: startNodeId, priority: fScore[startNodeId] })

  // Set start node as current
  nodes = nodes.map((node) => ({
    ...node,
    state: node.id === startNodeId ? "current" : "unvisited",
  }))

  // Add initial step
  steps.push({
    nodes,
    edges,
    dataStructure: {
      openSet: [...openSet],
      gScore: { ...gScore },
      fScore: { ...fScore },
      parents: { ...parents },
      visited: Array.from(visited),
    },
    pseudocode: {
      code: pseudocode.code,
      highlightedLine: 0,
    },
  })

  // A* algorithm
  while (openSet.length > 0) {
    // Sort open set and get node with minimum f-score
    openSet.sort((a, b) => a.priority - b.priority)
    const { id: currentNodeId } = openSet.shift()!

    // Mark current node as visited
    nodes = nodes.map((node) => ({
      ...node,
      state:
        node.id === currentNodeId
          ? "current"
          : node.state === "frontier"
            ? "frontier"
            : visited.has(node.id)
              ? "visited"
              : "unvisited",
    }))

    // Add step after selecting node
    steps.push({
      nodes,
      edges,
      dataStructure: {
        openSet: [...openSet],
        gScore: { ...gScore },
        fScore: { ...fScore },
        parents: { ...parents },
        visited: Array.from(visited),
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 1,
      },
    })

    // If we found the end node, break
    if (currentNodeId === endNodeId) {
      visited.add(currentNodeId)
      break
    }

    visited.add(currentNodeId)

    // Find all neighbors
    const neighbors: Array<{ id: string; weight: number }> = []
    edges.forEach((edge) => {
      if (edge.source === currentNodeId) {
        neighbors.push({ id: edge.target, weight: edge.weight })
      } else if (edge.target === currentNodeId) {
        // For undirected graphs
        neighbors.push({ id: edge.source, weight: edge.weight })
      }
    })

    // Process each neighbor
    for (const { id: neighborId, weight } of neighbors) {
      const tentativeGScore = gScore[currentNodeId] + weight

      if (tentativeGScore < gScore[neighborId]) {
        parents[neighborId] = currentNodeId
        gScore[neighborId] = tentativeGScore
        fScore[neighborId] =
          gScore[neighborId] +
          heuristic(nodes.find((n) => n.id === neighborId)!, nodes.find((n) => n.id === endNodeId)!)

        if (!openSet.some((item) => item.id === neighborId)) {
          openSet.push({ id: neighborId, priority: fScore[neighborId] })

          // Mark neighbor as frontier
          nodes = nodes.map((node) => ({
            ...node,
            state: node.id === neighborId ? "frontier" : node.state,
          }))

          // Mark edge as visited
          edges = edges.map((edge) => ({
            ...edge,
            state:
              (edge.source === currentNodeId && edge.target === neighborId) ||
              (edge.source === neighborId && edge.target === currentNodeId)
                ? "visited"
                : edge.state,
          }))
        }

        // Add step after processing each neighbor
        steps.push({
          nodes,
          edges,
          dataStructure: {
            openSet: [...openSet],
            gScore: { ...gScore },
            fScore: { ...fScore },
            parents: { ...parents },
            visited: Array.from(visited),
          },
          pseudocode: {
            code: pseudocode.code,
            highlightedLine: 3,
          },
        })
      }
    }

    // Mark current node as fully visited
    nodes = nodes.map((node) => ({
      ...node,
      state: node.id === currentNodeId ? "visited" : node.state,
    }))

    // Add step after processing all neighbors
    steps.push({
      nodes,
      edges,
      dataStructure: {
        openSet: [...openSet],
        gScore: { ...gScore },
        fScore: { ...fScore },
        parents: { ...parents },
        visited: Array.from(visited),
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 4,
      },
    })
  }

  // If end node is specified, highlight the path
  if (endNodeId && parents[endNodeId]) {
    const path: string[] = []
    let current = endNodeId

    while (current) {
      path.unshift(current)
      current = parents[current] as string
    }

    // Mark path nodes and edges
    nodes = nodes.map((node) => ({
      ...node,
      state: path.includes(node.id) ? "path" : node.state,
    }))

    edges = edges.map((edge) => {
      for (let i = 0; i < path.length - 1; i++) {
        if (
          (edge.source === path[i] && edge.target === path[i + 1]) ||
          (edge.source === path[i + 1] && edge.target === path[i])
        ) {
          return { ...edge, state: "path" }
        }
      }
      return edge
    })

    // Add final step with path
    steps.push({
      nodes,
      edges,
      dataStructure: {
        openSet: [],
        gScore: { ...gScore },
        fScore: { ...fScore },
        parents: { ...parents },
        visited: Array.from(visited),
        path,
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 5,
      },
    })
  }

  return { steps }
}

// Heuristic function for A* (Euclidean distance)
function heuristic(a: GraphNode, b: GraphNode): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

// Prim's Algorithm Implementation
function runPrim(originalNodes: GraphNode[], originalEdges: GraphEdge[], startNodeId: string): AlgorithmResult {
  const steps: AlgorithmStep[] = []
  const pseudocode = getPseudocode("prim")

  // Initialize
  let nodes = deepCopy(originalNodes)
  let edges = deepCopy(originalEdges)

  const visited = new Set<string>([startNodeId])
  const mst: GraphEdge[] = []

  // Set start node as current
  nodes = nodes.map((node) => ({
    ...node,
    state: node.id === startNodeId ? "current" : "unvisited",
  }))

  // Add initial step
  steps.push({
    nodes,
    edges,
    dataStructure: {
      visited: Array.from(visited),
      mst: [...mst],
    },
    pseudocode: {
      code: pseudocode.code,
      highlightedLine: 0,
    },
  })

  // Prim's algorithm
  while (visited.size < nodes.length) {
    let minEdge: GraphEdge | null = null
    let minWeight = Number.POSITIVE_INFINITY

    // Find minimum weight edge from visited to unvisited
    for (const edge of edges) {
      const sourceVisited = visited.has(edge.source)
      const targetVisited = visited.has(edge.target)

      // One endpoint is visited and the other is not
      if ((sourceVisited && !targetVisited) || (!sourceVisited && targetVisited)) {
        if (edge.weight < minWeight) {
          minWeight = edge.weight
          minEdge = edge
        }
      }
    }

    if (!minEdge) {
      // Graph is not connected
      break
    }

    // Add the new node to visited
    const newNodeId = visited.has(minEdge.source) ? minEdge.target : minEdge.source
    visited.add(newNodeId)
    mst.push(minEdge)

    // Mark new node as current and edge as part of MST
    nodes = nodes.map((node) => ({
      ...node,
      state: node.id === newNodeId ? "current" : visited.has(node.id) ? "visited" : "unvisited",
    }))

    edges = edges.map((edge) => ({
      ...edge,
      state: mst.some((e) => e.id === edge.id) ? "path" : edge.state,
    }))

    // Add step after adding edge to MST
    steps.push({
      nodes,
      edges,
      dataStructure: {
        visited: Array.from(visited),
        mst: [...mst],
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 2,
      },
    })

    // Mark current node as visited
    nodes = nodes.map((node) => ({
      ...node,
      state: node.id === newNodeId ? "visited" : node.state,
    }))

    // Add step after marking node as visited
    steps.push({
      nodes,
      edges,
      dataStructure: {
        visited: Array.from(visited),
        mst: [...mst],
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 3,
      },
    })
  }

  return { steps }
}

// Kruskal's Algorithm Implementation
function runKruskal(originalNodes: GraphNode[], originalEdges: GraphEdge[]): AlgorithmResult {
  const steps: AlgorithmStep[] = []
  const pseudocode = getPseudocode("kruskal")

  // Initialize
  let nodes = deepCopy(originalNodes)
  let edges = deepCopy(originalEdges)

  // Sort edges by weight
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight)
  const mst: GraphEdge[] = []

  // Initialize disjoint set
  const parent: Record<string, string> = {}
  nodes.forEach((node) => {
    parent[node.id] = node.id
  })

  // Find function for disjoint set
  function find(x: string): string {
    if (parent[x] !== x) {
      parent[x] = find(parent[x])
    }
    return parent[x]
  }

  // Union function for disjoint set
  function union(x: string, y: string): void {
    parent[find(x)] = find(y)
  }

  // Add initial step
  steps.push({
    nodes,
    edges,
    dataStructure: {
      sortedEdges: sortedEdges.map((e) => e.id),
      mst: [],
      parent: { ...parent },
    },
    pseudocode: {
      code: pseudocode.code,
      highlightedLine: 0,
    },
  })

  // Kruskal's algorithm
  for (const edge of sortedEdges) {
    const rootSource = find(edge.source)
    const rootTarget = find(edge.target)

    // Highlight current edge being considered
    edges = edges.map((e) => ({
      ...e,
      state: e.id === edge.id ? "current" : e.state,
    }))

    // Add step after selecting edge
    steps.push({
      nodes,
      edges,
      dataStructure: {
        sortedEdges: sortedEdges.map((e) => e.id),
        mst: mst.map((e) => e.id),
        parent: { ...parent },
        currentEdge: edge.id,
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 1,
      },
    })

    if (rootSource !== rootTarget) {
      mst.push(edge)
      union(rootSource, rootTarget)

      // Mark edge as part of MST
      edges = edges.map((e) => ({
        ...e,
        state: e.id === edge.id ? "path" : mst.some((m) => m.id === e.id) ? "path" : e.state,
      }))

      // Mark nodes connected by MST
      nodes = nodes.map((node) => ({
        ...node,
        state: mst.some((e) => e.source === node.id || e.target === node.id) ? "visited" : "unvisited",
      }))

      // Add step after adding edge to MST
      steps.push({
        nodes,
        edges,
        dataStructure: {
          sortedEdges: sortedEdges.map((e) => e.id),
          mst: mst.map((e) => e.id),
          parent: { ...parent },
          addedEdge: edge.id,
        },
        pseudocode: {
          code: pseudocode.code,
          highlightedLine: 2,
        },
      })
    } else {
      // Reset edge state if not added to MST
      edges = edges.map((e) => ({
        ...e,
        state: mst.some((m) => m.id === e.id) ? "path" : e.id === edge.id ? "visited" : e.state,
      }))

      // Add step after skipping edge
      steps.push({
        nodes,
        edges,
        dataStructure: {
          sortedEdges: sortedEdges.map((e) => e.id),
          mst: mst.map((e) => e.id),
          parent: { ...parent },
          skippedEdge: edge.id,
        },
        pseudocode: {
          code: pseudocode.code,
          highlightedLine: 3,
        },
      })
    }
  }

  return { steps }
}

// Topological Sort Implementation
function runTopologicalSort(originalNodes: GraphNode[], originalEdges: GraphEdge[]): AlgorithmResult {
  const steps: AlgorithmStep[] = []
  const pseudocode = getPseudocode("topological")

  // Initialize
  let nodes = deepCopy(originalNodes)
  let edges = deepCopy(originalEdges)

  const visited = new Set<string>()
  const stack: string[] = []

  // Add initial step
  steps.push({
    nodes,
    edges,
    dataStructure: {
      visited: Array.from(visited),
      stack: [...stack],
    },
    pseudocode: {
      code: pseudocode.code,
      highlightedLine: 0,
    },
  })

  // DFS function for topological sort
  function dfs(nodeId: string) {
    visited.add(nodeId)

    // Mark node as current
    nodes = nodes.map((node) => ({
      ...node,
      state: node.id === nodeId ? "current" : visited.has(node.id) ? "visited" : "unvisited",
    }))

    // Add step after visiting node
    steps.push({
      nodes,
      edges,
      dataStructure: {
        visited: Array.from(visited),
        stack: [...stack],
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 1,
      },
    })

    // Find all neighbors
    const neighbors: string[] = []
    edges.forEach((edge) => {
      if (edge.source === nodeId) {
        neighbors.push(edge.target)

        // Mark edge as current
        edges = edges.map((e) => ({
          ...e,
          state: e.id === edge.id ? "current" : e.state,
        }))
      }
    })

    // Process each neighbor
    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        // Mark edge as visited
        edges = edges.map((edge) => ({
          ...edge,
          state: edge.source === nodeId && edge.target === neighborId ? "visited" : edge.state,
        }))

        // Add step before recursive call
        steps.push({
          nodes,
          edges,
          dataStructure: {
            visited: Array.from(visited),
            stack: [...stack],
            exploring: neighborId,
          },
          pseudocode: {
            code: pseudocode.code,
            highlightedLine: 2,
          },
        })

        dfs(neighborId)
      }
    }

    // Add node to stack
    stack.push(nodeId)

    // Mark node as fully processed
    nodes = nodes.map((node) => ({
      ...node,
      state: node.id === nodeId ? "path" : node.state,
    }))

    // Add step after processing node
    steps.push({
      nodes,
      edges,
      dataStructure: {
        visited: Array.from(visited),
        stack: [...stack],
        added: nodeId,
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 3,
      },
    })
  }

  // Run DFS on all unvisited nodes
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      dfs(node.id)
    }
  }

  // Reverse the stack to get topological order
  const topologicalOrder = [...stack].reverse()

  // Mark nodes in topological order
  let order = 0
  for (const nodeId of topologicalOrder) {
    order++

    nodes = nodes.map((node) => ({
      ...node,
      state: node.id === nodeId ? "path" : node.state,
    }))

    // Add step for each node in topological order
    steps.push({
      nodes,
      edges,
      dataStructure: {
        visited: Array.from(visited),
        stack: [...stack],
        topologicalOrder,
        currentOrder: order,
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 4,
      },
    })
  }

  return { steps }
}

// Bellman-Ford Algorithm Implementation
function runBellmanFord(originalNodes: GraphNode[], originalEdges: GraphEdge[], startNodeId: string): AlgorithmResult {
  const steps: AlgorithmStep[] = []
  const pseudocode = getPseudocode("bellmanford")

  // Initialize
  let nodes = deepCopy(originalNodes)
  let edges = deepCopy(originalEdges)

  // Initialize distances and parents
  const distances: Record<string, number> = {}
  const parents: Record<string, string | null> = {}

  // Set initial distances to Infinity and start node to 0
  nodes.forEach((node) => {
    distances[node.id] = node.id === startNodeId ? 0 : Number.POSITIVE_INFINITY
    parents[node.id] = null
  })

  // Set start node as current
  nodes = nodes.map((node) => ({
    ...node,
    state: node.id === startNodeId ? "current" : "unvisited",
  }))

  // Add initial step
  steps.push({
    nodes,
    edges,
    dataStructure: {
      distances: { ...distances },
      parents: { ...parents },
    },
    pseudocode: {
      code: pseudocode.code,
      highlightedLine: 0,
    },
  })

  // Bellman-Ford algorithm
  const n = nodes.length

  // Relax edges |V| - 1 times
  for (let i = 0; i < n - 1; i++) {
    let relaxed = false

    for (const edge of edges) {
      const u = edge.source
      const v = edge.target
      const weight = edge.weight

      // Highlight current edge being considered
      edges = edges.map((e) => ({
        ...e,
        state: e.id === edge.id ? "current" : e.state,
      }))

      // Add step before relaxation
      steps.push({
        nodes,
        edges,
        dataStructure: {
          distances: { ...distances },
          parents: { ...parents },
          iteration: i + 1,
          edge: edge.id,
        },
        pseudocode: {
          code: pseudocode.code,
          highlightedLine: 1,
        },
      })

      if (distances[u] !== Number.POSITIVE_INFINITY && distances[u] + weight < distances[v]) {
        distances[v] = distances[u] + weight
        parents[v] = u
        relaxed = true

        // Mark target node as updated
        nodes = nodes.map((node) => ({
          ...node,
          state: node.id === v ? "frontier" : node.state,
        }))

        // Mark edge as relaxed
        edges = edges.map((e) => ({
          ...e,
          state: e.id === edge.id ? "visited" : e.state,
        }))

        // Add step after relaxation
        steps.push({
          nodes,
          edges,
          dataStructure: {
            distances: { ...distances },
            parents: { ...parents },
            iteration: i + 1,
            relaxed: edge.id,
          },
          pseudocode: {
            code: pseudocode.code,
            highlightedLine: 2,
          },
        })
      }
    }

    // If no relaxation occurred, we can terminate early
    if (!relaxed) {
      break
    }
  }

  // Check for negative weight cycles
  let hasNegativeCycle = false

  for (const edge of edges) {
    const u = edge.source
    const v = edge.target
    const weight = edge.weight

    if (distances[u] !== Number.POSITIVE_INFINITY && distances[u] + weight < distances[v]) {
      hasNegativeCycle = true

      // Mark edge as part of negative cycle
      edges = edges.map((e) => ({
        ...e,
        state: e.id === edge.id ? "path" : e.state,
      }))

      // Add step after finding negative cycle
      steps.push({
        nodes,
        edges,
        dataStructure: {
          distances: { ...distances },
          parents: { ...parents },
          negativeCycle: true,
          edge: edge.id,
        },
        pseudocode: {
          code: pseudocode.code,
          highlightedLine: 3,
        },
      })

      break
    }
  }

  if (!hasNegativeCycle) {
    // Mark all nodes with finite distance as visited
    nodes = nodes.map((node) => ({
      ...node,
      state: distances[node.id] !== Number.POSITIVE_INFINITY ? "visited" : "unvisited",
    }))

    // Add final step
    steps.push({
      nodes,
      edges,
      dataStructure: {
        distances: { ...distances },
        parents: { ...parents },
        complete: true,
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 4,
      },
    })
  }

  return { steps }
}

// Floyd-Warshall Algorithm Implementation
function runFloydWarshall(originalNodes: GraphNode[], originalEdges: GraphEdge[]): AlgorithmResult {
  const steps: AlgorithmStep[] = []
  const pseudocode = getPseudocode("floydwarshall")

  // Initialize
  let nodes = deepCopy(originalNodes)
  const edges = deepCopy(originalEdges)

  const n = nodes.length
  const nodeIds = nodes.map((node) => node.id)

  // Initialize distance matrix
  const dist: Record<string, Record<string, number>> = {}
  const next: Record<string, Record<string, string | null>> = {}

  // Initialize distances
  for (const u of nodeIds) {
    dist[u] = {}
    next[u] = {}

    for (const v of nodeIds) {
      if (u === v) {
        dist[u][v] = 0
        next[u][v] = null
      } else {
        dist[u][v] = Number.POSITIVE_INFINITY
        next[u][v] = null
      }
    }
  }

  // Set direct edge weights
  for (const edge of edges) {
    const u = edge.source
    const v = edge.target
    const weight = edge.weight

    dist[u][v] = weight
    next[u][v] = v

    // For undirected graphs
    if (!edges.some((e) => e.source === v && e.target === u)) {
      dist[v][u] = weight
      next[v][u] = u
    }
  }

  // Add initial step
  steps.push({
    nodes,
    edges,
    dataStructure: {
      dist: JSON.parse(JSON.stringify(dist)),
      next: JSON.parse(JSON.stringify(next)),
      k: 0,
    },
    pseudocode: {
      code: pseudocode.code,
      highlightedLine: 0,
    },
  })

  // Floyd-Warshall algorithm
  for (let k = 0; k < n; k++) {
    const kId = nodeIds[k]

    // Highlight intermediate node
    nodes = nodes.map((node) => ({
      ...node,
      state: node.id === kId ? "current" : "unvisited",
    }))

    // Add step for new intermediate node
    steps.push({
      nodes,
      edges,
      dataStructure: {
        dist: JSON.parse(JSON.stringify(dist)),
        next: JSON.parse(JSON.stringify(next)),
        k: k + 1,
        kId,
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 1,
      },
    })

    for (let i = 0; i < n; i++) {
      const iId = nodeIds[i]

      for (let j = 0; j < n; j++) {
        const jId = nodeIds[j]

        // Highlight current pair of nodes
        nodes = nodes.map((node) => ({
          ...node,
          state: node.id === kId ? "current" : node.id === iId || node.id === jId ? "frontier" : "unvisited",
        }))

        // Add step before relaxation
        steps.push({
          nodes,
          edges,
          dataStructure: {
            dist: JSON.parse(JSON.stringify(dist)),
            next: JSON.parse(JSON.stringify(next)),
            k: k + 1,
            i: i + 1,
            j: j + 1,
            iId,
            jId,
            kId,
          },
          pseudocode: {
            code: pseudocode.code,
            highlightedLine: 2,
          },
        })

        if (
          dist[iId][kId] !== Number.POSITIVE_INFINITY &&
          dist[kId][jId] !== Number.POSITIVE_INFINITY &&
          dist[iId][kId] + dist[kId][jId] < dist[iId][jId]
        ) {
          dist[iId][jId] = dist[iId][kId] + dist[kId][jId]
          next[iId][jId] = next[iId][kId]

          // Add step after relaxation
          steps.push({
            nodes,
            edges,
            dataStructure: {
              dist: JSON.parse(JSON.stringify(dist)),
              next: JSON.parse(JSON.stringify(next)),
              k: k + 1,
              i: i + 1,
              j: j + 1,
              iId,
              jId,
              kId,
              relaxed: true,
            },
            pseudocode: {
              code: pseudocode.code,
              highlightedLine: 3,
            },
          })
        }
      }
    }
  }

  // Add final step
  steps.push({
    nodes,
    edges,
    dataStructure: {
      dist: JSON.parse(JSON.stringify(dist)),
      next: JSON.parse(JSON.stringify(next)),
      complete: true,
    },
    pseudocode: {
      code: pseudocode.code,
      highlightedLine: 4,
    },
  })

  return { steps }
}

// Tarjan's Strongly Connected Components Algorithm
function runTarjan(originalNodes: GraphNode[], originalEdges: GraphEdge[]): AlgorithmResult {
  const steps: AlgorithmStep[] = []
  const pseudocode = getPseudocode("tarjan")

  // Initialize
  let nodes = deepCopy(originalNodes)
  let edges = deepCopy(originalEdges)

  let index = 0
  const indices: Record<string, number> = {}
  const lowLinks: Record<string, number> = {}
  const onStack: Set<string> = new Set()
  const stack: string[] = []
  const components: string[][] = []

  // Add initial step
  steps.push({
    nodes,
    edges,
    dataStructure: {
      indices,
      lowLinks,
      stack: [...stack],
      components: [...components],
    },
    pseudocode: {
      code: pseudocode.code,
      highlightedLine: 0,
    },
  })

  // Tarjan's algorithm
  function strongConnect(nodeId: string) {
    // Set the depth index for v
    indices[nodeId] = index
    lowLinks[nodeId] = index
    index++
    stack.push(nodeId)
    onStack.add(nodeId)

    // Mark node as current
    nodes = nodes.map((node) => ({
      ...node,
      state: node.id === nodeId ? "current" : onStack.has(node.id) ? "frontier" : "unvisited",
    }))

    // Add step after pushing to stack
    steps.push({
      nodes,
      edges,
      dataStructure: {
        indices: { ...indices },
        lowLinks: { ...lowLinks },
        stack: [...stack],
        components: [...components],
      },
      pseudocode: {
        code: pseudocode.code,
        highlightedLine: 1,
      },
    })

    // Consider successors of v
    const neighbors: string[] = []
    edges.forEach((edge) => {
      if (edge.source === nodeId) {
        neighbors.push(edge.target)
      }
    })

    for (const neighborId of neighbors) {
      // Highlight current edge
      edges = edges.map((edge) => ({
        ...edge,
        state: edge.source === nodeId && edge.target === neighborId ? "current" : edge.state,
      }))

      if (!(neighborId in indices)) {
        // Neighbor has not yet been visited; recurse on it
        steps.push({
          nodes,
          edges,
          dataStructure: {
            indices: { ...indices },
            lowLinks: { ...lowLinks },
            stack: [...stack],
            components: [...components],
            exploring: neighborId,
          },
          pseudocode: {
            code: pseudocode.code,
            highlightedLine: 2,
          },
        })

        strongConnect(neighborId)
        lowLinks[nodeId] = Math.min(lowLinks[nodeId], lowLinks[neighborId])

        // Add step after recursion
        steps.push({
          nodes,
          edges,
          dataStructure: {
            indices: { ...indices },
            lowLinks: { ...lowLinks },
            stack: [...stack],
            components: [...components],
            updated: nodeId,
          },
          pseudocode: {
            code: pseudocode.code,
            highlightedLine: 3,
          },
        })
      } else if (onStack.has(neighborId)) {
        // Neighbor is in stack and hence in the current SCC
        lowLinks[nodeId] = Math.min(lowLinks[nodeId], indices[neighborId])

        // Add step after updating lowlink
        steps.push({
          nodes,
          edges,
          dataStructure: {
            indices: { ...indices },
            lowLinks: { ...lowLinks },
            stack: [...stack],
            components: [...components],
            updated: nodeId,
          },
          pseudocode: {
            code: pseudocode.code,
            highlightedLine: 4,
          },
        })
      }

      // Reset edge state
      edges = edges.map((edge) => ({
        ...edge,
        state: edge.source === nodeId && edge.target === neighborId ? "visited" : edge.state,
      }))
    }

    // If v is a root node, pop the stack and generate an SCC
    if (lowLinks[nodeId] === indices[nodeId]) {
      const component: string[] = []
      let w: string

      do {
        w = stack.pop()!
        onStack.delete(w)
        component.push(w)
      } while (w !== nodeId)

      components.push(component)

      // Mark component nodes
      const componentColor = components.length % 5
      nodes = nodes.map((node) => ({
        ...node,
        state: component.includes(node.id) ? "path" : node.state,
      }))

      // Add step after finding component
      steps.push({
        nodes,
        edges,
        dataStructure: {
          indices: { ...indices },
          lowLinks: { ...lowLinks },
          stack: [...stack],
          components: [...components],
          newComponent: component,
        },
        pseudocode: {
          code: pseudocode.code,
          highlightedLine: 5,
        },
      })
    }
  }

  // Run algorithm on all unvisited nodes
  for (const node of nodes) {
    if (!(node.id in indices)) {
      strongConnect(node.id)
    }
  }

  return { steps }
}
