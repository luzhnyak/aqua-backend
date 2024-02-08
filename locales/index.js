const i18next = require("i18next");
const backend = require("i18next-node-fs-backend");

i18next.use(backend).init({
  lng: "en",
  fallbackLng: "en",
  preload: ["en", "ua"],
  ns: ["translation"],
  backend: {
    loadPath: "./locales/{{lng}}/{{ns}}.json",
  },
});

module.exports = i18next;
