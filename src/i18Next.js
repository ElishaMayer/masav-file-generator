import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { getLanguageCode } from "./functions/getLanguageCode";
import aboutEn from "./locals/en/about.json";
import convertFromExcelEn from "./locals/en/convert-from-excel.json";
import homePageEn from "./locals/en/home-page.json";
import onlineConvertorEn from "./locals/en/online-convertor.json";
import translationEn from "./locals/en/translation.json";
import aboutHe from "./locals/he/about.json";
import convertFromExcelHe from "./locals/he/convert-from-excel.json";
import homePageHe from "./locals/he/home-page.json";
import onlineConvertorHe from "./locals/he/online-convertor.json";
import translationHe from "./locals/he/translation.json";
const he = {
  ["about"]: aboutHe,
  ["convert-from-excel"]: convertFromExcelHe,
  ["home-page"]: homePageHe,
  ["online-convertor"]: onlineConvertorHe,
  ["translation"]: translationHe,
};
const en = {
  ["about"]: aboutEn,
  ["convert-from-excel"]: convertFromExcelEn,
  ["home-page"]: homePageEn,
  ["online-convertor"]: onlineConvertorEn,
  ["translation"]: translationEn,
};
const resources = { he, en };

//document.getElementById("lang-style").innerHTML = `
//* {
//  direction: rtl;
//}`;
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

i18n.use(initReactI18next).init({
  resources,
  lng: getLanguageCode(),
  fallbackLng: "en",
  debug: false,
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

export default i18n;
