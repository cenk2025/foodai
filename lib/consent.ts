export type ConsentChoice = 'statistics' | 'necessary'

type StoredConsent = { version: number; choice: ConsentChoice; decidedAt: string }

const STORAGE_KEY = 'foodai_consent'
// Raise this when what the popup asks about changes: everyone is then asked again.
const CONSENT_VERSION = 1
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000

const listeners = new Set<() => void>()
// Keeps the choice for this page load when the browser blocks storage.
let memoryConsent: StoredConsent | null = null
let settingsOpen = false

function notify() {
    listeners.forEach(listener => listener())
}

function isValid(saved: Partial<StoredConsent> | null): saved is StoredConsent {
    return saved?.version === CONSENT_VERSION
        && (saved.choice === 'statistics' || saved.choice === 'necessary')
        && Date.now() - new Date(saved.decidedAt ?? 0).getTime() < MAX_AGE_MS
}

export function getConsent(): ConsentChoice | null {
    if (memoryConsent) return memoryConsent.choice
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<StoredConsent> | null
        return isValid(saved) ? saved.choice : null
    } catch {
        return null
    }
}

export function setConsent(choice: ConsentChoice) {
    memoryConsent = { version: CONSENT_VERSION, choice, decidedAt: new Date().toISOString() }
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryConsent))
    } catch {
        // The choice still holds for this page load.
    }
    settingsOpen = false
    notify()
}

export function openConsentSettings() {
    settingsOpen = true
    notify()
}

export function isConsentDialogOpen() {
    return settingsOpen || getConsent() === null
}

export function subscribeToConsent(listener: () => void) {
    listeners.add(listener)
    return () => {
        listeners.delete(listener)
    }
}
