// Node Types
export interface GraphNode {
  id: string
  x: number
  y: number
  state: NodeState
}

export type NodeState = "unvisited" | "visited" | "current" | "frontier" | "path"

// Edge Types
export interface GraphEdge {
  id: string
  source: string
  target: string
  weight: number
  state: EdgeState
}

export type EdgeState = "unvisited" | "visited" | "current" | "path"

// Graph Types
export type GraphType = "undirected" | "directed" | "weighted" | "weighted-directed" | "tree" | "dag" | "grid"

// Algorithm Types
export type Algorithm =
  | "bfs"
  | "dfs"
  | "dijkstra"
  | "astar"
  | "prim"
  | "kruskal"
  | "topological"
  | "bellmanford"
  | "floydwarshall"
  | "tarjan"

// Algorithm Step
export interface AlgorithmStep {
  nodes: GraphNode[]
  edges: GraphEdge[]
  dataStructure: any
  pseudocode: {
    code: string[]
    highlightedLine: number
  }
}

// Algorithm Result
export interface AlgorithmResult {
  steps: AlgorithmStep[]
  path?: string[]
}

// Algorithm Run Parameters
export interface AlgorithmRunParams {
  algorithm: Algorithm
  nodes: GraphNode[]
  edges: GraphEdge[]
  startNodeId: string
  endNodeId?: string | null
}
