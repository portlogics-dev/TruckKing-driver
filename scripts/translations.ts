import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";

// 번역 파일에서 키들을 추출하는 함수
function getTranslationKeys(filePath: string): string[] {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(content);
    return Object.keys(json);
  } catch (error) {
    console.log(
      chalk.red(`❌ 번역 파일을 읽을 수 없습니다: ${filePath}`),
      error
    );
    return [];
  }
}

// Key 객체의 key-value 일치 여부를 검사하는 함수
function checkKeyValuePairs<Key extends Record<string, string>>(
  keyObject: Key
): string[] {
  const mismatchedPairs = Object.entries(keyObject)
    .filter(([key, value]) => key !== value)
    .map(([key, value]) => `- "${key}": "${value}"`);

  return mismatchedPairs;
}

function removeUnnecessaryKeys(filePath: string, unnecessaryKeys: string[]) {
  const content = fs.readFileSync(filePath, "utf-8");
  const json = JSON.parse(content);

  unnecessaryKeys.forEach((key) => {
    delete json[key];
  });

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), "utf-8");
}

function run({
  projectName,
  keyObject,
  translationsDir,
  supportedLanguages,
  autoRemove = false,
}: {
  projectName: string;
  keyObject: Record<string, string>;
  translationsDir: string;
  supportedLanguages: string[];
  autoRemove?: boolean;
}) {
  console.log(
    chalk.cyan("\n══════════════════════════════════════════════════")
  );
  console.log(chalk.cyan.bold(`${projectName} 번역 키 검사 시작`));
  console.log(
    chalk.cyan("═════════════════════���════════════════════════════\n")
  );

  // Key 객체의 key-value 일치 여부 검사
  const mismatchedPairs = checkKeyValuePairs(keyObject);
  if (mismatchedPairs.length > 0) {
    console.log(chalk.yellow("📌 Key 객체 내 불일치하는 key-value 쌍"));
    console.log(chalk.gray("----------------------------------------"));
    console.log("다음 항목들의 key와 value가 서로 다릅니다:");
    console.log(chalk.yellow(mismatchedPairs.join("\n")));
    console.log(chalk.yellow("\n⚠️  주의: key와 value는 동일해야 합니다!\n"));
  }

  // 기존 번역 파일 검사 로직
  const sourceKeys = Object.keys(keyObject);

  supportedLanguages.forEach((lang) => {
    if (lang === "ko") return;

    const translationPath = path.join(
      translationsDir,
      lang,
      "translation.json"
    );

    // 파일 경로를 VSCode 링크로 변환
    const fileLink = `file://${path.resolve(translationPath)}`;

    console.log(chalk.blue.bold(`\n▣ ${lang.toUpperCase()} 번역 검사`));
    console.log(chalk.gray("--------------------------------------------"));

    // 파일 존재 여부 확인
    if (!fs.existsSync(translationPath)) {
      console.log(chalk.red(`❌ 번역 파일을 찾을 수 없습니다: ${fileLink}`));
      return; // 현재 언어 처리를 중단하고 다음 언어로 넘어감
    }

    console.log(chalk.blue(`📁 파일 위치: ${fileLink}`));
    const translationKeys = getTranslationKeys(translationPath);

    // 누락된 키 찾기
    const missingKeys = sourceKeys.filter(
      (key) => !translationKeys.includes(key)
    );

    // 불필요한 키 찾기
    const unnecessaryKeys = translationKeys.filter(
      (key) => !sourceKeys.includes(key)
    );

    if (missingKeys.length > 0) {
      console.log(chalk.red(`\n  ❌ 누락된 키: (총 ${missingKeys.length}개)`));
      console.log(chalk.gray("  " + "-".repeat(40)));
      // 10개씩 그룹화하여 출력
      for (let i = 0; i < missingKeys.length; i += 10) {
        const group = missingKeys.slice(i, i + 10);
        console.log(
          chalk.red("  " + group.map((key) => `- ${key}`).join("\n  "))
        );
        if (i + 10 < missingKeys.length) console.log();
      }
    }

    if (unnecessaryKeys.length > 0) {
      console.log(
        chalk.yellow(`\n  ⚠️  불필요한 키: (총 ${unnecessaryKeys.length}개)`)
      );
      console.log(chalk.gray("  " + "-".repeat(40)));
      // 10개씩 그룹화하여 출력
      for (let i = 0; i < unnecessaryKeys.length; i += 10) {
        const group = unnecessaryKeys.slice(i, i + 10);
        console.log(
          chalk.yellow("  " + group.map((key) => `- ${key}`).join("\n  "))
        );
        if (i + 10 < unnecessaryKeys.length) console.log();
      }

      // 자동 삭제 옵션이 활성화�� 경우 불필요한 키 삭제
      if (autoRemove) {
        removeUnnecessaryKeys(translationPath, unnecessaryKeys);
        console.log(
          chalk.green(
            `\n  ✅ ${unnecessaryKeys.length}개의 불필요한 키가 삭제되었습니다.`
          )
        );
      }
    }

    if (missingKeys.length === 0 && unnecessaryKeys.length === 0) {
      console.log(chalk.green("\n  ✅ 모든 키가 정상적으로 매칭됩니다."));
    }
  });

  console.log(
    chalk.cyan("\n══════════════════════════════════════════════════")
  );
  console.log(chalk.cyan.bold(`${projectName} 번역 키 검사 완료`));
  console.log(
    chalk.cyan("══════════════════════════════════════════════════\n")
  );
}

export { getTranslationKeys, checkKeyValuePairs, run };
