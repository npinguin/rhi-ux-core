import fs from "node:fs";
const files=["src/core.js","src/tokens.css","src/primitives.css"];
const text=files.map(f=>fs.readFileSync(f,"utf8")).join("\n").toLowerCase();
const forbidden=[
  "sensor.rhi_",
  "hass.states",
  "rhi_energy_public_contract",
  "rhi_mobility",
  "battery.soc",
  "charger",
  "planning.horizons"
];
const bad=forbidden.filter(term=>text.includes(term));
if(bad.length) throw new Error("domain/runtime ownership leaked into UX Core: "+bad.join(", "));
const css=fs.readFileSync("src/primitives.css","utf8");
if(/--hi-/.test(css)) throw new Error("legacy --hi-* token namespace is forbidden; use --rhi-*");
console.log("PASS RHI UX Core ownership boundary");

const tokenCss=fs.readFileSync("src/tokens.css","utf8");
if(!tokenCss.includes("--rhi-font-family:")) throw new Error("Core must own canonical font family");
if(/font-family\s*:\s*Inter/i.test(tokenCss)) throw new Error("Core must use Home Assistant font authority with safe fallback");

if(!tokenCss.includes("--rhi-font-label:10.5px")) throw new Error("shared functional label minimum drifted below product guardrail");
if(!tokenCss.includes("--rhi-font-diagnostic:10px")) throw new Error("diagnostic compact typography must be explicit and separate");
