'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionary, Locale } from './dictionary';

interface LanguageContextType {
    locale: Locale;
    t: typeof dictionary['en'];
    setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    // Default to Finnish
    const [locale, setLocale] = useState<Locale>('fi');

    // Load from local storage if available
    useEffect(() => {
        const savedLocale = localStorage.getItem('foodai_locale') as Locale;
        if (savedLocale && (savedLocale === 'fi' || savedLocale === 'en')) {
            setLocale(savedLocale);
        }
    }, []);

    const changeLocale = (newLocale: Locale) => {
        setLocale(newLocale);
        localStorage.setItem('foodai_locale', newLocale);
    };

    const value = {
        locale,
        t: dictionary[locale],
        setLocale: changeLocale,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
