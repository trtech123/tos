"use client"

import { ReactNode } from "react"
import { BookingProvider } from "@/contexts/booking-context"

export function Providers({ children }: { children: ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>
}
