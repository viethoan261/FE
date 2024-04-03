import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './en/translation.json';
import translationVI from './vi/translation.json';
import { CONFIG } from '@/configs';

const resources = {
  en: {
    translation: translationEN
  },
  vi: {
    translation: translationVI
  }
};

export const defaultNS = 'translation';
export const langs = ['vi', 'en'];

i18next.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('lang') || 'vi',
  ns: ['translation'],
  defaultNS,
  returnNull: false,
  debug: CONFIG.NODE_ENV === 'development',
  fallbackLng: 'vi',
  parseMissingKeyHandler: (_key, defaultValue = '') => {
    if (CONFIG.NODE_ENV === 'development') return _key;
    return defaultValue;
  }
});

export default i18next;
