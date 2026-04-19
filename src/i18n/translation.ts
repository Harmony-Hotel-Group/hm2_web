/**
 * src/i18n/translation.ts
 * 
 * Módulo de Internacionalización (i18n) para Astro
 * Detecta el idioma desde la URL y proporciona funciones de traducción
 */

import esTranslations from './es.json';
import enTranslations from './en.json';

type TranslationObject = Record<string, string | TranslationObject>;
export type SupportedLang = 'en' | 'es';
export type Language = SupportedLang;

export const DEFAULT_LANG: SupportedLang = 'es';
export const SUPPORTED_LANGS: readonly SupportedLang[] = ['es', 'en'] as const;

const translationsMap: Record<SupportedLang, TranslationObject> = {
  es: esTranslations as TranslationObject,
  en: enTranslations as TranslationObject
};

/**
 * Obtiene el idioma actual desde la URL
 * - Si la URL empieza con /en/, detecta inglés
 * - Para cualquier otra ruta (incluyendo /), usa español por defecto
 */
export function getCurrentLang(url: URL): Language {
  const segments = url.pathname.split('/').filter(Boolean);
  const langCode = segments[0];

  if (langCode && SUPPORTED_LANGS.includes(langCode as SupportedLang)) {
    return langCode as Language;
  }

  return DEFAULT_LANG;
}

/**
 * Verifica si el idioma es soportado
 */
export function isValidLang(lang: string): lang is SupportedLang {
  return SUPPORTED_LANGS.includes(lang as SupportedLang);
}

/**
 * Obtiene la URL para un idioma específico, manteniendo la ruta actual
 */
export function getUrlForLang(lang: SupportedLang, currentPathname: string): string {
  // Remover cualquier prefijo de idioma existente
  const pathWithoutLang = currentPathname.replace(/^\/(en|es)/, '') || '/';
  
  if (lang === DEFAULT_LANG) {
    // Español no tiene prefijo
    return pathWithoutLang === '/' ? '/' : pathWithoutLang;
  }
  
  // Otros idiomas tienen prefijo
  return `/${lang}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
}

/**
 * Busca traducción en el objeto
 */
function findTranslation(
  obj: TranslationObject | undefined,
  key: string
): string | null {
  if (!obj || !key) return null;

  const keys = key.split('.');
  let result: string | TranslationObject = obj;

  for (const k of keys) {
    if (result == null || typeof result !== 'object' || !(k in result)) {
      return null;
    }
    result = result[k];
  }

  return typeof result === 'string' ? result : null;
}

/**
 * Reemplaza parámetros {{param}} en la traducción
 */
function replaceParams(translation: string, params?: Record<string, string | number>): string {
  if (!params || Object.keys(params).length === 0) return translation;
  
  return translation.replace(/\{\{\s*(\w+)\s*}}/g, (match, paramName) => {
    const value = params[paramName];
    return value !== undefined ? String(value) : match;
  });
}

/**
 * Factory de funciones de traducción
 * Proporciona una función t() para el idioma especificado
 */
export function createTranslations(lang: string) {
  const normalizedLang = isValidLang(lang) ? lang : DEFAULT_LANG;
  const translationFile = translationsMap[normalizedLang];
  const fallbackFile = translationsMap[DEFAULT_LANG];
  
  return function t(key: string, params?: Record<string, string | number>): string {
    if (!key) return key;
    
    let translation = findTranslation(translationFile, key);
    
    // Fallback al idioma por defecto
    if (translation === null && normalizedLang !== DEFAULT_LANG) {
      translation = findTranslation(fallbackFile, key);
    }
    
    if (translation === null) {
      console.warn(`Translation not found: ${key}`);
      return key;
    }
    
    return replaceParams(translation, params);
  };
}

// Alias directo para obtener la función de traducción
export function Translations(lang: string) {
  return createTranslations(lang);
}