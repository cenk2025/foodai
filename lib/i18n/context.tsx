'use client'

import React, { createContext, useContext, useState } from 'react';
import { dictionary, Locale } from './dictionary';

interface LanguageContextType {
    locale: Locale;
    t: typeof dictionary['en'];
    setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    // Load from local storage if available with lazy initialization
    const [locale, setLocale] = useState<Locale>(() => {
        if (typeof window !== 'undefined') {
            const savedLocale = localStorage.getItem('foodai_locale') as Locale;
            if (savedLocale && (savedLocale === 'fi' || savedLocale === 'en')) {
                return savedLocale;
            }
        }
        return 'fi';
    });

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
