'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface LocationContextType {
    location: string
    setLocation: (location: string) => void
    city: string
    setCity: (city: string) => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

const STORAGE_KEY = 'foodai_location'

export function LocationProvider({ children }: { children: ReactNode }) {
    // Default city parsed from default location or just 'Helsinki'
    const [state, setState] = useState({ location: 'Helsinki, Kamppi', city: 'Helsinki' })

    // Restore the visitor's last choice after mount (not during render, so the
    // server-rendered HTML and the first client render match). Declared before
    // the save effect so the saved value is read before anything is written.
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as { location?: unknown; city?: unknown } | null
            if (typeof saved?.city === 'string' && typeof saved.location === 'string') {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setState({ location: saved.location, city: saved.city })
            }
        } catch {
            // Storage unavailable (private mode, blocked): keep the default.
        }
    }, [])

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        } catch {
            // Not persisted; the choice still applies for this visit.
        }
    }, [state])

    const setLocation = useCallback((location: string) => setState((s) => ({ ...s, location })), [])
    const setCity = useCallback((city: string) => setState((s) => ({ ...s, city })), [])

    return (
        <LocationContext.Provider value={{ location: state.location, setLocation, city: state.city, setCity }}>
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
