import { run } from "./translations";
import { supportLanguages } from "../src/i18n/config";
import { Key } from "../src/i18n/key";

// 키 파일과 번역 파일들의 경로
const TRANSLATIONS_DIR = "src/i18n/locales";

function main() {
  run({
    projectName: "truckking",
    keyObject: Key,
    translationsDir: TRANSLATIONS_DIR,
    supportedLanguages: supportLanguages,
    autoRemove: false,
  });
}

main();
