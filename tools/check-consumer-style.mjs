// Build-time audit of domain-authored CSS; shared primitives are owned by UX Core.
// No runtime dependency, CSS framework, domain rules or dependency on other modules.
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
const spec = JSON.parse(fs.readFileSync(new URL("../src/visual-spec.json", import.meta.url), "utf8"));
const protectedClasses = new Set(spec.shared_layout.protected_consumer_selectors);

// A scoped selector (e.g. .planning-card .rhiUxPageHero) is still a shared override.
// Inspect selector preludes, not declaration values or comment text.
export function sharedStyleOverrides(css) {
  if (typeof css !== "string") throw new TypeError("Expected authored CSS text");
  const source = css.replace(/\\/\*[\\s\\S]*?\*\\//g, "");
  const violations = [];
  let start = 0, quote = null, escaped = false;
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (char !== "{" && char !== "}") continue;
    if (char === "{") {
      const selector = source.slice(start, i).trim();
      if (selector && !selector.startsWith("@")) {
        for (const match of selector.matchAll(/\\.([A-Za-z][\\w-]*)/g)) {
          if (protectedClasses.has(match[1])) {
            violations.push({selector: selector.slice(0, 160), sharedClass: match[1]});
          }
        }
      }
    }
    start = i + 1;
  }
  return violations;
}

export function readConsumerCss(filename, constantName) {
  const source = fs.readFileSync(filename, "utf8");
  if (!constantName) return source;
  if (!/^[A-Za-z_$][\\w$]*$/.test(constantName)) throw new Error("Invalid CSS constant name");
  // RHI consumer authors currently embed a JSON-escaped static CSS string
  // as const PLAN_CSS / NOTIFY_CSS / FINANCE_CSS. Do not evaluate source JS.
  const pattern = new RegExp("\\bconst\\s+" + constantName + "\\s*=\\s*(\\\"(?:\\\\.|[^\\\"\\\\])*\\\")\\s*;");
  const match = source.match(pattern);
  if (!match) throw new Error("Static CSS constant not found: " + constantName);
  return JSON.parse(match[1]);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [filename, constantName, ...extra] = process.argv.slice(2);
  if (!filename || extra.length) {
    console.error("Usage: node tools/check-consumer-style.mjs <domain.css|domain.js> [STATIC_CSS_CONSTANT]");
    process.exitCode = 2;
  } else {
    const violations = sharedStyleOverrides(readConsumerCss(filename, constantName));
    if (violations.length) {
      for (const {selector,sharedClass} of violations) console.error("UX Core-owned ." + sharedClass + " redefined in " + selector);
      process.exitCode = 1;
    } else {
      console.log("PASS domain CSS leaves shared shell and Hero geometry to RHI UX Core");
    }
  }
}
