import { ThemeProvider } from "@/components/theme-provider"
import PathViz from "@/components/path-viz"

export default function Home() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="pathviz-theme">
      <main className="min-h-screen bg-background">
        <PathViz />
      </main>
    </ThemeProvider>
  )
}
