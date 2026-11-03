import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = ["BaseLessons.ts", "ExpandedLessons.ts", "ExtraLessons.ts", "CuratedLessons.ts"];
let errors = 0;
let warnings = 0;

function fail(msg) {
  console.error("ERROR:", msg);
  errors++;
}
function warn(msg) {
  console.warn("WARN:", msg);
  warnings++;
}

const idRe = /id:\s*"([^"]+)"/g;
const ids = new Set();

for (const file of files) {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) {
    warn(`${file} missing`);
    continue;
  }
  const text = fs.readFileSync(p, "utf8");
  if (file === "ExtraLessons.ts" && text.includes("buildLesson") && text.includes("variant")) {
    warn("ExtraLessons.ts still contains generated variants; do not count them as independently authored lessons");
  }

  if (file === "CuratedLessons.ts") {
    const authored = (text.match(/id:\s*"cur-[^"]+"/g) || []).length;
    if (authored < 10) fail(`CuratedLessons.ts: expected at least 10 authored lessons, found ${authored}`);
    const entries = text.split(/\n  },\n/);
    for (const [index, entry] of entries.entries()) {
      if (!entry.includes('id: "cur-')) continue;
      for (const field of ["question:", "options:", "answer:", "feedback:", "words:"]) {
        if (!entry.includes(field)) fail(`CuratedLessons.ts entry ${index + 1} missing ${field}`);
      }
      const options = entry.match(/options:\s*\[([\s\S]*?)\],\s*answer:\s*"([^"]+)"/);
      if (!options || !options[1].includes(options[2])) {
        fail(`CuratedLessons.ts entry ${index + 1}: answer must appear in options`);
      }
    }
    console.log(`CuratedLessons.ts: ${authored} individually authored lessons checked`);
  }
  let m;
  const fileIds = [];
  while ((m = idRe.exec(text))) {
    const id = m[1];
    fileIds.push(id);
    if (ids.has(id)) fail(`duplicate id: ${id} in ${file}`);
    ids.add(id);
  }
  console.log(`${file}: ~${fileIds.length} id literals scanned`);
}

console.log(`\nUnique ids: ${ids.size}`);
console.log(`Errors: ${errors}, Warnings: ${warnings}`);
if (errors > 0) process.exit(1);
console.log("Content validation passed (structural scan).");
