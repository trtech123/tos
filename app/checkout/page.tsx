"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plane, ArrowRight, ArrowLeft, CreditCard, User, Mail, Phone, Calendar, Lock, Hotel } from "lucide-react"
import Link from "next/link"
import { useBooking } from "@/contexts/booking-context"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function CheckoutPage() {
  const { selectedFlight, selectedHotel } = useBooking()
  const searchParams = useSearchParams()

  // Get flight details from query params or context
  const [flightDetails, setFlightDetails] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    date: searchParams.get('date') || '',
    airline: searchParams.get('airline') || '',
    price: searchParams.get('price') || '',
  })

  useEffect(() => {
    // Update flight details if query params are present
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const date = searchParams.get('date')
    const airline = searchParams.get('airline')
    const price = searchParams.get('price')

    if (from || to || date || airline || price) {
      setFlightDetails({
        from: from || '',
        to: to || '',
        date: date || '',
        airline: airline || '',
        price: price || '',
      })
    }
  }, [searchParams])

  // Calculate total price
  const getFlightPrice = () => {
    if (flightDetails.price) {
      return parseInt(flightDetails.price)
    }
    if (selectedFlight) {
      return parseInt(selectedFlight.price.replace(/[^\d]/g, ""))
    }
    return 890
  }

  const flightPrice = getFlightPrice()
  const hotelPrice = selectedHotel ? parseInt(selectedHotel.totalPrice.replace(/[^\d]/g, "")) : 0
  const taxes = 110
  const insurance = 50
  const totalPrice = flightPrice + hotelPrice + taxes + insurance

  // Check if we have flight info from query params or context
  const hasFlightInfo = flightDetails.from || selectedFlight
  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card flex-shrink-0">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Plane className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">טוס תיירות</h1>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span className="text-xs">תשלום מאובטח</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-4">
          {/* Back Button Section */}
          <div className="mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="ml-2 h-3 w-3" />
                חזור לתוצאות חיפוש
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground mb-1">השלמת הזמנה</h1>
            <p className="text-sm text-muted-foreground">מלא את הפרטים להשלמת ההזמנה</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Passenger Details */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-foreground">פרטי נוסע</h2>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="firstName" className="text-sm">שם פרטי</Label>
                    <Input id="firstName" placeholder="הזן שם פרטי" className="h-9" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName" className="text-sm">שם משפחה</Label>
                    <Input id="lastName" placeholder="הזן שם משפחה" className="h-9" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-sm">אימייל</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-2.5 h-3 w-3 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="example@email.com" className="pr-9 h-9" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-sm">טלפון</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-2.5 h-3 w-3 text-muted-foreground" />
                      <Input id="phone" type="tel" placeholder="050-1234567" className="pr-9 h-9" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="passport" className="text-sm">מספר דרכון</Label>
                    <Input id="passport" placeholder="הזן מספר דרכון" className="h-9" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Details */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-foreground">פרטי תשלום</h2>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="cardNumber" className="text-sm">מספר כרטיס אשראי</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" maxLength={19} className="h-9" />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cardName" className="text-sm">שם בעל הכרטיס</Label>
                  <Input id="cardName" placeholder="כפי שמופיע על הכרטיס" className="h-9" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="expiry" className="text-sm">תוקף</Label>
                    <Input id="expiry" placeholder="MM/YY" maxLength={5} className="h-9" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="cvv" className="text-sm">CVV</Label>
                    <Input id="cvv" placeholder="123" maxLength={3} type="password" className="h-9" />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                  <Lock className="h-3 w-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">פרטי התשלום שלך מוצפנים ומאובטחים</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-4">
              <h2 className="text-lg font-bold text-foreground mb-3">סיכום הזמנה</h2>

              <div className="space-y-3">
                {/* Flight Details */}
                {(selectedFlight || flightDetails.from) && (
                  <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Plane className="h-5 w-5 text-primary" />
                      <span className="font-medium text-xs">
                        {flightDetails.airline || selectedFlight?.airline || 'טיסה'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {(flightDetails.from || selectedFlight) && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">מ</span>
                          <span className="text-xs font-medium">
                            {flightDetails.from || selectedFlight?.departure.city}
                          </span>
                        </div>
                      )}
                      {(flightDetails.to || selectedFlight) && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">ל</span>
                          <span className="text-xs font-medium">
                            {flightDetails.to || selectedFlight?.arrival.city}
                          </span>
                        </div>
                      )}
                      {(flightDetails.date || selectedFlight) && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">תאריך</span>
                          <span className="text-xs font-medium">
                            {flightDetails.date || selectedFlight?.departure.date}
                          </span>
                        </div>
                      )}
                      {selectedFlight?.duration && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">משך</span>
                          <span className="text-xs font-medium">{selectedFlight.duration}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Hotel Details */}
                {selectedHotel && (
                  <>
                    <Separator />
                    <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <Hotel className="h-5 w-5 text-primary" />
                        <span className="font-medium text-xs">{selectedHotel.name}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">לילות</span>
                          <span className="text-xs font-medium">{selectedHotel.nights} לילות</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">מחיר ללילה</span>
                          <span className="text-xs font-medium">{selectedHotel.pricePerNight}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">מחיר כרטיס</span>
                    <span className="font-medium">₪{flightPrice.toLocaleString()}</span>
                  </div>
                  {selectedHotel && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">מחיר מלון</span>
                      <span className="font-medium">₪{hotelPrice.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">מיסים ועמלות</span>
                    <span className="font-medium">₪{taxes}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">ביטוח נסיעות</span>
                    <span className="font-medium">₪{insurance}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-base font-bold">
                    <span>סה"כ לתשלום</span>
                    <span className="text-primary">₪{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <Button className="w-full" size="sm">
                  אישור ותשלום
                  <ArrowRight className="mr-2 h-3 w-3" />
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  בלחיצה על "אישור ותשלום" אתה מאשר את{" "}
                  <a href="#" className="text-primary hover:underline">
                    תנאי השימוש
                  </a>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
