"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar, MapPin, Search, Users } from "lucide-react"

export function FlightSearch() {
  const [tripType, setTripType] = useState("round-trip")

  return (
    <Card className="p-6 shadow-lg">
      <div className="space-y-6">
        {/* Trip Type Selection */}
        <RadioGroup value={tripType} onValueChange={setTripType} className="flex gap-6">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="round-trip" id="round-trip" />
            <Label htmlFor="round-trip" className="cursor-pointer font-medium">
              הלוך ושוב
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="one-way" id="one-way" />
            <Label htmlFor="one-way" className="cursor-pointer font-medium">
              כיוון אחד
            </Label>
          </div>
        </RadioGroup>

        {/* Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* From */}
          <div className="space-y-2">
            <Label htmlFor="from" className="text-sm font-medium">
              מאיפה
            </Label>
            <div className="relative">
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="from" placeholder="תל אביב (TLV)" className="pr-10 text-right" />
            </div>
          </div>

          {/* To */}
          <div className="space-y-2">
            <Label htmlFor="to" className="text-sm font-medium">
              לאן
            </Label>
            <div className="relative">
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="to" placeholder="ניו יורק (JFK)" className="pr-10 text-right" />
            </div>
          </div>

          {/* Departure Date */}
          <div className="space-y-2">
            <Label htmlFor="departure" className="text-sm font-medium">
              תאריך יציאה
            </Label>
            <div className="relative">
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="departure" type="date" className="pr-10 text-right" />
            </div>
          </div>

          {/* Return Date */}
          {tripType === "round-trip" && (
            <div className="space-y-2">
              <Label htmlFor="return" className="text-sm font-medium">
                תאריך חזרה
              </Label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="return" type="date" className="pr-10 text-right" />
              </div>
            </div>
          )}

          {/* Passengers */}
          <div className="space-y-2">
            <Label htmlFor="passengers" className="text-sm font-medium">
              נוסעים
            </Label>
            <div className="relative">
              <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="passengers" type="number" min="1" defaultValue="1" className="pr-10 text-right" />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Button size="lg" className="w-full md:w-auto md:px-12">
          <Search className="ml-2 h-5 w-5" />
          חפש טיסות
        </Button>
      </div>
    </Card>
  )
}
