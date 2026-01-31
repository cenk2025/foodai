'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface LocationContextType {
    location: string
    setLocation: (location: string) => void
    city: string
    setCity: (city: string) => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
    const [location, setLocation] = useState('Helsinki, Kamppi')
    // Default city parsed from default location or just 'Helsinki'
    const [city, setCity] = useState('Helsinki')

    return (
        <LocationContext.Provider value={{ location, setLocation, city, setCity }}>
            {children}
        </LocationContext.Provider>
    )
}

export function useLocation() {
    const context = useContext(LocationContext)
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider')
    }
    return context
}
