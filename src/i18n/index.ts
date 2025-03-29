import { use as i18next } from "i18next";
import { useMemo } from "react";
import { initReactI18next, useTranslation } from "react-i18next";
import { getLocales } from "react-native-localize";

import { LanguageType, fallbackLng, supportLanguages } from "./config";
import { key } from "./key";
import id from "./locales/id.json";

export const isSupportLanguage = (
  language: string | LanguageType
): language is LanguageType =>
  supportLanguages.includes(language as LanguageType);

const getLanguageName = (
  currentLng: LanguageType,
  languageCode: LanguageType
) => {
  try {
    return new Intl.DisplayNames([currentLng], { type: "language" }).of(
      languageCode
    );
  } catch {
    return languageCode;
  }
};

const getLanguageFlag = (languageCode: LanguageType) => {
  switch (languageCode) {
    case "en":
      return "🇺🇸";
    case "id":
      return "🇮🇩";
  }
};

i18next(initReactI18next).init({
  lng: getLocales()[0].languageCode, // 사용할 언어
  fallbackLng, // 번역 불가 시 대체 언어
  supportedLngs: supportLanguages, // 지원 언어
  resources: {
    en: {
      translation: key,
    },
    id: {
      translation: id,
    },
  },
});

export function useI18n() {
  const { t, i18n } = useTranslation();

  const lng =
    i18n.options.lng && isSupportLanguage(i18n.options.lng)
      ? i18n.options.lng
      : fallbackLng;

  const languages = useMemo(() => {
    return supportLanguages.map((language) => ({
      label: getLanguageName(lng, language),
      key: language,
      flag: getLanguageFlag(language),
    }));
  }, [lng]);

  const currentLanguageName = useMemo(() => {
    return getLanguageName(lng, lng);
  }, [lng]);

  const changeLanguage = async (language: LanguageType) => {
    if (!isSupportLanguage(language)) return;

    await i18n.changeLanguage(language);
    // await loadDayjsLocale(language);
  };

  return {
    t,
    i18n,
    lng: i18n.options.lng,
    languages,
    currentLanguageName,
    changeLanguage,
  };
}
