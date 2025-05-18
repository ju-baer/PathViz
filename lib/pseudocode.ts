import type { Algorithm } from "@/lib/types"

interface Pseudocode {
  title: string
  code: string[]
}

export function getPseudocode(algorithm: Algorithm): Pseudocode {
  switch (algorithm) {
    case "bfs":
      return {
        title: "Breadth-First Search (BFS)",
        code: [
          "function BFS(graph, start, end):",
          "  queue = [start]",
          "  visited = {start}",
          "  while queue is not empty:",
          "    current = queue.dequeue()",
          "    if current == end:",
          "      return path",
          "    for each neighbor of current:",
          "      if neighbor not in visited:",
          "        visited.add(neighbor)",
          "        queue.enqueue(neighbor)",
          "  return no path exists",
        ],
      }
    case "dfs":
      return {
        title: "Depth-First Search (DFS)",
        code: [
          "function DFS(graph, start, end):",
          "  stack = [start]",
          "  visited = {}",
          "  while stack is not empty:",
          "    current = stack.pop()",
          "    if current in visited:",
          "      continue",
          "    visited.add(current)",
          "    if current == end:",
          "      return path",
          "    for each neighbor of current:",
          "      if neighbor not in visited:",
          "        stack.push(neighbor)",
          "  return no path exists",
        ],
      }
    case "dijkstra":
      return {
        title: "Dijkstra's Algorithm",
        code: [
          "function Dijkstra(graph, start, end):",
          "  distances = {start: 0, all others: ∞}",
          "  priorityQueue = [(start, 0)]",
          "  visited = {}",
          "  while priorityQueue is not empty:",
          "    current, dist = priorityQueue.dequeue()",
          "    if current in visited:",
          "      continue",
          "    visited.add(current)",
          "    if current == end:",
          "      return distances[end]",
          "    for each neighbor, weight of current:",
          "      if distances[current] + weight < distances[neighbor]:",
          "        distances[neighbor] = distances[current] + weight",
          "        priorityQueue.enqueue((neighbor, distances[neighbor]))",
          "  return no path exists",
        ],
      }
    case "astar":
      return {
        title: "A* Search Algorithm",
        code: [
          "function AStar(graph, start, end):",
          "  openSet = {start}",
          "  gScore = {start: 0, all others: ∞}",
          "  fScore = {start: heuristic(start, end), all others: ∞}",
          "  while openSet is not empty:",
          "    current = node in openSet with lowest fScore",
          "    if current == end:",
          "      return reconstruct_path(current)",
          "    openSet.remove(current)",
          "    for each neighbor of current:",
          "      tentative_gScore = gScore[current] + distance(current, neighbor)",
          "      if tentative_gScore < gScore[neighbor]:",
          "        gScore[neighbor] = tentative_gScore",
          "        fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, end)",
          "        if neighbor not in openSet:",
          "          openSet.add(neighbor)",
          "  return no path exists",
        ],
      }
    case "prim":
      return {
        title: "Prim's Minimum Spanning Tree Algorithm",
        code: [
          "function Prim(graph, start):",
          "  visited = {start}",
          "  mst = []",
          "  while visited.size < graph.nodes.size:",
          "    minEdge = edge with minimum weight from visited to unvisited",
          "    if no such edge exists:",
          "      break  // Graph is not connected",
          "    mst.add(minEdge)",
          "    visited.add(unvisited endpoint of minEdge)",
          "  return mst",
        ],
      }
    case "kruskal":
      return {
        title: "Kruskal's Minimum Spanning Tree Algorithm",
        code: [
          "function Kruskal(graph):",
          "  sort edges by weight",
          "  mst = []",
          "  disjointSet = DisjointSet(graph.nodes)",
          "  for each edge (u, v) in sorted edges:",
          "    if disjointSet.find(u) != disjointSet.find(v):",
          "      mst.add(edge)",
          "      disjointSet.union(u, v)",
          "    if mst.size == graph.nodes.size - 1:",
          "      break",
          "  return mst",
        ],
      }
    case "topological":
      return {
        title: "Topological Sort",
        code: [
          "function TopologicalSort(graph):",
          "  visited = {}",
          "  stack = []",
          "  for each node in graph:",
          "    if node not in visited:",
          "      dfs(node, visited, stack)",
          "  return stack.reverse()",
          "",
          "function dfs(node, visited, stack):",
          "  visited.add(node)",
          "  for each neighbor of node:",
          "    if neighbor not in visited:",
          "      dfs(neighbor, visited, stack)",
          "  stack.push(node)",
        ],
      }
    case "bellmanford":
      return {
        title: "Bellman-Ford Algorithm",
        code: [
          "function BellmanFord(graph, start):",
          "  distances = {start: 0, all others: ∞}",
          "  for i = 1 to |V| - 1:",
          "    for each edge (u, v) with weight w in graph:",
          "      if distances[u] + w < distances[v]:",
          "        distances[v] = distances[u] + w",
          "  // Check for negative weight cycles",
          "  for each edge (u, v) with weight w in graph:",
          "    if distances[u] + w < distances[v]:",
          "      return 'Graph contains negative weight cycle'",
          "  return distances",
        ],
      }
    case "floydwarshall":
      return {
        title: "Floyd-Warshall Algorithm",
        code: [
          "function FloydWarshall(graph):",
          "  dist = initialize distance matrix from graph",
          "  for k = 1 to |V|:",
          "    for i = 1 to |V|:",
          "      for j = 1 to |V|:",
          "        if dist[i][k] + dist[k][j] < dist[i][j]:",
          "          dist[i][j] = dist[i][k] + dist[k][j]",
          "  return dist",
        ],
      }
    case "tarjan":
      return {
        title: "Tarjan's Strongly Connected Components Algorithm",
        code: [
          "function Tarjan(graph):",
          "  index = 0",
          "  stack = []",
          "  indices = {}, lowlinks = {}",
          "  onStack = {}",
          "  components = []",
          "  for each node in graph:",
          "    if node not in indices:",
          "      strongConnect(node)",
          "  return components",
          "",
          "function strongConnect(node):",
          "  indices[node] = index",
          "  lowlinks[node] = index",
          "  index++",
          "  stack.push(node)",
          "  onStack[node] = true",
          "  for each neighbor of node:",
          "    if neighbor not in indices:",
          "      strongConnect(neighbor)",
          "      lowlinks[node] = min(lowlinks[node], lowlinks[neighbor])",
          "    else if onStack[neighbor]:",
          "      lowlinks[node] = min(lowlinks[node], indices[neighbor])",
          "  if lowlinks[node] == indices[node]:",
          "    component = []",
          "    do:",
          "      w = stack.pop()",
          "      onStack[w] = false",
          "      component.add(w)",
          "    while w != node",
          "    components.add(component)",
        ],
      }
    default:
      return {
        title: "Algorithm",
        code: ["No pseudocode available for this algorithm."],
      }
  }
}
