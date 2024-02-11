const i18next = require("i18next");
const i18nextBackend = require("i18next-node-fs-backend");
const path = require("path");

i18next.use(i18nextBackend).init({
  fallbackLng: "en",
  ns: ["translation"],
  defaultNS: "translation",
  backend: {
    loadPath: path.join(__dirname, "{{lng}}/{{ns}}.json"),
  },
  lng: "ua",
});

module.exports = i18next;
