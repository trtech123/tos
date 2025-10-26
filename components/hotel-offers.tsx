"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Wifi, Coffee, Car, Check, ArrowLeft } from "lucide-react"
import { useBooking, Hotel } from "@/contexts/booking-context"
import { useRouter } from "next/navigation"

const mockHotels: Hotel[] = [
  {
    id: 1,
    name: "מלון ים המלח ספא",
    image: "/placeholder.svg",
    rating: 4.5,
    location: "לרנקה, קפריסין",
    amenities: ["Wi-Fi חינם", "בריכה", "חנייה", "ארוחת בוקר"],
    pricePerNight: "₪450",
    totalPrice: "₪1,350",
    nights: 3,
  },
  {
    id: 2,
    name: "מלון לרנקה פלאזה",
    image: "/placeholder.svg",
    rating: 4.2,
    location: "מרכז לרנקה, קפריסין",
    amenities: ["Wi-Fi חינם", "חדר כושר", "מסעדה"],
    pricePerNight: "₪380",
    totalPrice: "₪1,140",
    nights: 3,
  },
  {
    id: 3,
    name: "סאן ריזורט לרנקה",
    image: "/placeholder.svg",
    rating: 4.7,
    location: "חוף לרנקה, קפריסין",
    amenities: ["Wi-Fi חינם", "בריכה", "חנייה", "ספא", "חדר כושר"],
    pricePerNight: "₪620",
    totalPrice: "₪1,860",
    nights: 3,
  },
  {
    id: 4,
    name: "מלון סיטי סנטר",
    image: "/placeholder.svg",
    rating: 4.0,
    location: "לרנקה, קפריסין",
    amenities: ["Wi-Fi חינם", "ארוחת בוקר"],
    pricePerNight: "₪290",
    totalPrice: "₪870",
    nights: 3,
  },
]

const amenityIcons: Record<string, any> = {
  "Wi-Fi חינם": Wifi,
  "בריכה": Coffee,
  "חנייה": Car,
  "ארוחת בוקר": Coffee,
  "חדר כושר": Coffee,
  "מסעדה": Coffee,
  "ספא": Coffee,
}

export function HotelOffers() {
  const { selectedFlight, setSelectedHotel, setShowHotelOffers } = useBooking()
  const router = useRouter()
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null)

  if (!selectedFlight) return null

  const handleSelectHotel = (hotel: Hotel) => {
    setSelectedHotelId(hotel.id)
    setSelectedHotel(hotel)
  }

  const handleContinue = () => {
    if (selectedHotelId) {
      router.push("/checkout")
    }
  }

  const handleSkip = () => {
    setSelectedHotel(null)
    router.push("/checkout")
  }

  return (
    <div className="h-full flex flex-col w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0 pb-3 border-b px-2">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            הצעות מלון מומלצות
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            השלימו את החופשה שלכם עם מלון באזור היעד
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSkip} className="hover:bg-muted">
          דלג על שלב זה →
        </Button>
      </div>

      {/* Hotel Cards Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 pt-2">
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {mockHotels.map((hotel) => {
            const isSelected = selectedHotelId === hotel.id

            return (
              <Card
                key={hotel.id}
                className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] ${
                  isSelected
                    ? "ring-2 ring-primary shadow-xl bg-primary/5 border-primary"
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleSelectHotel(hotel)}
              >
                <div className="space-y-3">
                  {/* Header with hotel name and selection indicator */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🏨</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm leading-tight">{hotel.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>{hotel.location}</span>
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(hotel.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                    <span className="text-sm font-bold mr-1">{hotel.rating}</span>
                    <span className="text-xs text-muted-foreground">מעולה</span>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5">
                    {hotel.amenities.map((amenity) => (
                      <Badge
                        key={amenity}
                        variant="secondary"
                        className="text-xs px-2 py-0.5 bg-muted hover:bg-muted/80"
                      >
                        {amenity}
                      </Badge>
                    ))}
                  </div>

                  {/* Price Section */}
                  <div className="pt-3 border-t flex items-end justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {hotel.nights} לילות
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {hotel.pricePerNight} ללילה
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground mb-0.5">מחיר כולל</p>
                      <p className="text-xl font-bold text-primary">
                        {hotel.totalPrice}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Continue Button - Fixed at bottom */}
      <div className="flex justify-center mt-4 pt-4 border-t flex-shrink-0">
        {selectedHotelId ? (
          <Button
            size="lg"
            onClick={handleContinue}
            className="min-w-[250px] shadow-lg hover:shadow-xl transition-all"
          >
            המשך לתשלום
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">בחרו מלון כדי להמשיך</p>
        )}
      </div>
    </div>
  )
}
