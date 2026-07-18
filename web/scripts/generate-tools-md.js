// Run from web/: node scripts/generate-tools-md.js
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const dataJs = fs.readFileSync(path.join(root, "data.js"), "utf8");
const AI_TOOLS = eval(dataJs.replace(/^const AI_TOOLS = /, "").replace(/;\s*$/, ""));

const outDir = path.join(root, "tools");
fs.mkdirSync(outDir, { recursive: true });

for (const tool of AI_TOOLS) {
  const md = `# ${tool.name}

## 一句話

${tool.description}

## 最適合

${tool.bestFor}

## 分類

${tool.category}

## 標籤

${tool.tags.join("、")}

## 定價

${tool.pricing}

## 連結

- [前往官網](${tool.url})
`;
  fs.writeFileSync(path.join(outDir, `${tool.id}.md`), md, "utf8");
}

console.log(`Generated ${AI_TOOLS.length} files in web/tools/`);
