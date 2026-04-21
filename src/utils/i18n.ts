// i18n utility for handling multilingual support with JSON files

import esTranslations from '../i18n/es.json';
import enTranslations from '../i18n/en.json';

export const AVAILABLE_LANGUAGES: string[] = ['es', 'en'];
export type Language = typeof AVAILABLE_LANGUAGES[number];
export const DEFAULT_LANGUAGE: Language = 'es';

const translationsMap: Record<Language, Record<string, any>> = {
  es: esTranslations as Record<string, any>,
  en: enTranslations as Record<string, any>
};

function includes<T>(arr: T[], value: T): boolean {
  return arr.indexOf(value) !== -1;
}

/**
 * Get current language with proper URL parameter support
 * Priority: URL parameter (?lang=en) > localStorage > navigator > default
 */
export function getCurrentLanguage(): Language {
  // Check for URL parameter FIRST (this is the key fix!)
  // This works in both server and client because we check window.location
  if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
    const url = new URL(window.location.href);
    const urlLang = url.searchParams.get('lang') as Language;
    if (urlLang && includes(AVAILABLE_LANGUAGES, urlLang)) {
      return urlLang;
    }
    
    // Fallback to localStorage
    const storedLang = localStorage.getItem('i18next_lang') as Language;
    if (storedLang && includes(AVAILABLE_LANGUAGES, storedLang)) {
      return storedLang;
    }
    
    // Fallback to browser language
    const browserLang = navigator.language.split('-')[0] as Language;
    if (browserLang && includes(AVAILABLE_LANGUAGES, browserLang)) {
      return browserLang;
    }
  }
  
  return DEFAULT_LANGUAGE;
}

/**
 * Get current language for display purposes (client-side)
 */
export function getCurrentLangDisplay(): Language {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    const urlLang = url.searchParams.get('lang') as Language;
    if (urlLang && includes(AVAILABLE_LANGUAGES, urlLang)) {
      return urlLang;
    }
    
    const storedLang = localStorage.getItem('i18next_lang') as Language;
    if (storedLang && includes(AVAILABLE_LANGUAGES, storedLang)) {
      return storedLang;
    }
    
    return navigator.language.split('-')[0] as Language || DEFAULT_LANGUAGE;
  }
  
  return DEFAULT_LANGUAGE;
}

/**
 * Change language - uses URL parameter for proper SSR support
 */
export function changeLanguage(lang: Language): void {
  if (!includes(AVAILABLE_LANGUAGES, lang)) {
    console.warn(`Language '${lang}' not supported`);
    return;
  }
  
  if (typeof window !== 'undefined') {
    // Save to localStorage
    localStorage.setItem('i18next_lang', lang);
    
    // Construct new URL with lang parameter
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    
    // Navigate to the URL with the language parameter
    window.location.href = url.toString();
  }
}

/**
 * Simple translation function
 */
export function t(key: string): string {
  const lang = getCurrentLanguage();
  const translations = translationsMap[lang];
  
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    if (value === null || value === undefined) {
      return key;
    }
    value = value[k];
  }
  
  if (typeof value === 'object' && value !== null) {
    return key;
  }
  
  return value !== null && value !== undefined ? String(value) : key;
}

/**
 * Get available languages
 */
export function getAvailableLanguages(): Language[] {
  return [...AVAILABLE_LANGUAGES];
}