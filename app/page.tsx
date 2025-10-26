"use client"

import { FlightSearch } from "@/components/flight-search"
import { FlightResults } from "@/components/flight-results"
import { HotelOffers } from "@/components/hotel-offers"
import { AIChatbot } from "@/components/ai-chatbot"
import { useBooking } from "@/contexts/booking-context"
import { Plane } from "lucide-react"

export default function Home() {
  const { showHotelOffers } = useBooking()

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card flex-shrink-0">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <Plane className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-bold text-foreground">טוס תיירות</h1>
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

      {/* Hero Section */}
      {!showHotelOffers && (
        <section className="bg-gradient-to-b from-primary/5 to-background py-4 flex-shrink-0">
          <div className="container mx-auto px-4">
            <div className="mb-3 text-center">
              <h2 className="mb-1 text-2xl font-bold text-balance text-foreground">מצא את הטיסה המושלמת שלך</h2>
              <p className="text-sm text-muted-foreground">חפש והשווה מחירים מכל חברות התעופה המובילות</p>
            </div>

            <FlightSearch />
          </div>
        </section>
      )}

      {/* Results Section - Scrollable */}
      <section className="flex-1">
        <div className="container mx-auto px-4 h-full py-3">
          {showHotelOffers ? <HotelOffers /> : <FlightResults />}
        </div>
      </section>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  )
}
