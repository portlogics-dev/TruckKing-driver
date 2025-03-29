import "i18next";
import { key } from "./key";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof key;
    };
  }
}
