import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import en from "./locales/en.json";
import my from "./locales/my.json";

const i18n = new I18n({
  en,
  my,
});

i18n.enableFallback = true;
i18n.defaultLocale = "en";
i18n.locale = getLocales()[0]?.languageCode ?? "en";

export default i18n;
