import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>PathViz - Graph Algorithm Visualizer</title>
        <meta name="description" content="Interactive graph algorithm visualization tool" />
      </head>
      <body>
        <ThemeProvider defaultTheme="dark" storageKey="pathviz-theme" disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
