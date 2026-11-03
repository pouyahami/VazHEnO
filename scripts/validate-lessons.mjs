import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = ["BaseLessons.ts", "ExpandedLessons.ts", "ExtraLessons.ts"];
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
    warn("ExtraLessons.ts uses generative variants — many lessons may be near-duplicates");
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
