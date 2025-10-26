"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface Flight {
  id: number
  airline: string
  logo: string
  departure: {
    time: string
    airport: string
    city: string
  }
  arrival: {
    time: string
    airport: string
    city: string
  }
  duration: string
  stops: string
  price: string
  class: string
}

export interface Hotel {
  id: number
  name: string
  image: string
  rating: number
  location: string
  amenities: string[]
  pricePerNight: string
  totalPrice: string
  nights: number
}

interface BookingContextType {
  selectedFlight: Flight | null
  selectedHotel: Hotel | null
  setSelectedFlight: (flight: Flight | null) => void
  setSelectedHotel: (hotel: Hotel | null) => void
  showHotelOffers: boolean
  setShowHotelOffers: (show: boolean) => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [showHotelOffers, setShowHotelOffers] = useState(false)

  return (
    <BookingContext.Provider
      value={{
        selectedFlight,
        selectedHotel,
        setSelectedFlight,
        setSelectedHotel,
        showHotelOffers,
        setShowHotelOffers,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}
