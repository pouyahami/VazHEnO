import { build } from "esbuild";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const LEVELS = ["A0", "A1", "A2", "B1", "B2", "C1"];
const sources = [
  ["BaseLessons.ts", "baseLessons"],
  ["ExpandedLessons.ts", "expandedLessons"],
  ["ExtraLessons.ts", "extraLessons"],
  ["SpanishLessons.ts", "spanishLessons"],
];

let errors = 0;
let warnings = 0;
const fail = (msg) => { console.error("ERROR:", msg); errors++; };
const warn = (msg) => { console.warn("WARN: ", msg); warnings++; };

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vazheno-"));
const all = [];

for (const [file, exportName] of sources) {
  if (!fs.existsSync(file)) { warn(`${file} پیدا نشد`); continue; }
  const out = path.join(tmp, file.replace(/\.ts$/, ".mjs"));
  await build({ entryPoints: [file], outfile: out, bundle: true, format: "esm", platform: "node", logLevel: "silent" });
  const mod = await import(pathToFileURL(out).href);
  const list = mod[exportName];
  if (!Array.isArray(list)) { fail(`${file}: خروجی ${exportName} آرایه نیست`); continue; }
  console.log(`${file}: ${list.length} درس`);
  list.forEach((l) => all.push({ ...l, __file: file }));
}

const seenIds = new Map();
const seenQuestions = new Map();
const str = (v) => typeof v === "string" && v.trim().length > 0;

for (const l of all) {
  const where = `${l.__file} › ${l.id}`;
  if (!str(l.id)) { fail(`${where}: id خالی`); continue; }
  if (seenIds.has(l.id)) fail(`${where}: id تکراری (قبلاً در ${seenIds.get(l.id)})`);
  seenIds.set(l.id, l.__file);
  if (!LEVELS.includes(l.level)) fail(`${where}: سطح نامعتبر «${l.level}»`);
  for (const key of ["title", "category", "explanation", "example", "translation", "tip", "question", "answer", "feedback"]) {
    if (!str(l[key])) fail(`${where}: فیلد ${key} خالی است`);
  }
  if (!Array.isArray(l.options) || l.options.length < 3) fail(`${where}: حداقل ۳ گزینه لازم است`);
  else {
    if (!l.options.includes(l.answer)) fail(`${where}: پاسخ در میان گزینه‌ها نیست`);
    if (new Set(l.options).size !== l.options.length) fail(`${where}: گزینهٔ تکراری`);
    if (l.options.some((o) => !str(o))) fail(`${where}: گزینهٔ خالی`);
  }
  if (!(l.minutes > 0 && l.minutes <= 60)) warn(`${where}: minutes غیرعادی (${l.minutes})`);
  (l.words ?? []).forEach((w, i) => {
    if (!str(w.word) || !str(w.meaning)) fail(`${where}: واژهٔ ${i + 1} ناقص است`);
  });
  const qKey = `${l.__file}|${l.question}|${l.answer}`;
  if (seenQuestions.has(qKey)) warn(`${where}: پرسش و پاسخ مشابه ${seenQuestions.get(qKey)}`);
  seenQuestions.set(qKey, l.id);
}

const byLevel = LEVELS.map((lv) => `${lv}: ${all.filter((l) => l.level === lv).length}`).join("  ");
console.log(`\nمجموع: ${all.length} درس | ${byLevel}`);
console.log(`خطا: ${errors}  هشدار: ${warnings}`);
fs.rmSync(tmp, { recursive: true, force: true });
if (errors > 0) process.exit(1);
console.log("اعتبارسنجی محتوا موفق بود.");
