"use client"

import { FullScreenChat } from "@/components/full-screen-chat"
import { Plane } from "lucide-react"

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card flex-shrink-0">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Plane className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">טוס תיירות</h1>
            </div>
            <nav className="flex gap-6">
              <button className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                הטיסות שלי
              </button>
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                התחבר
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Full Screen Chat */}
      <FullScreenChat />
    </div>
  )
}
