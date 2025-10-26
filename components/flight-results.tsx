"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plane, Clock, ArrowLeft } from "lucide-react"
import { useBooking } from "@/contexts/booking-context"

const mockFlights = [
  {
    id: 1,
    airline: "אל על",
    logo: "/abstract-airline-logo.png",
    departure: {
      time: "06:45",
      airport: "TLV",
      city: "תל אביב",
    },
    arrival: {
      time: "09:15",
      airport: "LCA",
      city: "לרנקה",
    },
    duration: "1ש 30ד",
    stops: "ישיר",
    price: "₪890",
    class: "תיירים",
  },
  {
    id: 2,
    airline: "קפריסין איירווייז",
    logo: "/abstract-airline-logo.png",
    departure: {
      time: "14:20",
      airport: "TLV",
      city: "תל אביב",
    },
    arrival: {
      time: "16:50",
      airport: "LCA",
      city: "לרנקה",
    },
    duration: "1ש 30ד",
    stops: "ישיר",
    price: "₪750",
    class: "תיירים",
  },
  {
    id: 3,
    airline: "איג'יאן איירליינס",
    logo: "/abstract-airline-logo.png",
    departure: {
      time: "18:00",
      airport: "TLV",
      city: "תל אביב",
    },
    arrival: {
      time: "21:30",
      airport: "ATH",
      city: "אתונה",
    },
    duration: "2ש 30ד",
    stops: "ישיר",
    price: "₪1,120",
    class: "תיירים",
  },
]

export function FlightResults() {
  const { setSelectedFlight, setShowHotelOffers } = useBooking()

  const handleSelectFlight = (flight: typeof mockFlights[0]) => {
    setSelectedFlight(flight)
    setShowHotelOffers(true)
  }

  return (
    <div className="h-full flex flex-col w-full">
      <div className="flex items-center justify-between mb-1 flex-shrink-0 pb-2 border-b">
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">טיסות זמינות</h2>
        <p className="text-sm text-muted-foreground">נמצאו <span className="font-bold text-foreground">{mockFlights.length}</span> טיסות</p>
      </div>

      <div className="flex-1 overflow-y-auto pt-1">
        <div className="space-y-2">
          {mockFlights.map((flight) => (
            <Card key={flight.id} className="p-3.5 hover:shadow-xl hover:border-primary/30 transition-all duration-200 w-full bg-card/50 backdrop-blur">
              <div className="flex items-center justify-between">
                {/* Left Section: Price & Button */}
                <div className="flex flex-col gap-2 items-start min-w-[140px]">
                  <div className="text-2xl font-bold text-primary">{flight.price}</div>
                  <Button
                    className="w-full shadow-md hover:shadow-lg transition-all text-xs h-8"
                    onClick={() => handleSelectFlight(flight)}
                  >
                    בחר טיסה
                    <ArrowLeft className="mr-1.5 h-3 w-3" />
                  </Button>
                </div>

                {/* Center Section: Flight Details */}
                <div className="flex-1 px-10">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    {/* Departure */}
                    <div className="text-left">
                      <div className="text-2xl font-bold text-foreground leading-none">{flight.departure.time}</div>
                      <div className="text-xs text-muted-foreground mt-1.5">
                        {flight.departure.city}
                      </div>
                      <div className="text-[10px] text-muted-foreground/70">
                        {flight.departure.airport}
                      </div>
                    </div>

                    {/* Duration & Stops */}
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="flex items-center gap-2 text-muted-foreground w-full justify-center">
                        <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-border to-border max-w-[40px]" />
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <Plane className="h-3 w-3 rotate-90 text-primary" />
                        </div>
                        <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-border to-border max-w-[40px]" />
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-2.5 w-2.5" />
                        <span className="font-medium">{flight.duration}</span>
                      </div>
                      <Badge variant={flight.stops === "ישיר" ? "default" : "secondary"} className="text-[10px] px-2 py-0.5 shadow-sm">
                        {flight.stops}
                      </Badge>
                    </div>

                    {/* Arrival */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground leading-none">{flight.arrival.time}</div>
                      <div className="text-xs text-muted-foreground mt-1.5">
                        {flight.arrival.city}
                      </div>
                      <div className="text-[10px] text-muted-foreground/70">
                        {flight.arrival.airport}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section: Airline */}
                <div className="flex items-center gap-2 min-w-[140px] justify-end">
                  <span className="font-bold text-sm text-foreground">{flight.airline}</span>
                  <div className="w-9 h-9 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-lg flex items-center justify-center shadow-sm">
                    <Plane className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
