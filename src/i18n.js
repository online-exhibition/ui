import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import de from "locales/de/translation";
import userDe from "locales/de/user";

import en from "locales/en/translation";
import userEn from "locales/de/user";

const resources = {
  de: Object.assign(de, { user: userDe }),
  en: Object.assign(en, { user: userEn }),
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
