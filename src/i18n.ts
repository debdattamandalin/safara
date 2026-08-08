import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';
import te from './locales/te.json';
import mr from './locales/mr.json';
import ta from './locales/ta.json';
import zh from './locales/zh.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

const resources = {
  English: { translation: en },
  Hindi: { translation: hi },
  Bengali: { translation: bn },
  Telugu: { translation: te },
  Marathi: { translation: mr },
  Tamil: { translation: ta },
  Mandarin: { translation: zh },
  Spanish: { translation: es },
  French: { translation: fr },
  Arabic: { translation: ar },
};

// Get stored language from localStorage or default to English
let initialLang = 'English';
try {
  const dataStr = localStorage.getItem('safara_user_data');
  if (dataStr) {
    const data = JSON.parse(dataStr);
    if (data.language) initialLang = data.language;
  }
} catch (_e) {}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang, // Set default language
    fallbackLng: 'English',
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

export default i18n;
