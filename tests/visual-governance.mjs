import fs from "node:fs";

const spec = JSON.parse(fs.readFileSync("src/visual-spec.json", "utf8"));

if (spec.schema_version !== 1) throw new Error("visual spec schema_version must remain 1");
if (spec.id !== "rhi.visual-spec.v1") throw new Error("visual spec id drifted");
if (spec.runtime_dependency !== false) throw new Error("visual spec must remain build-time only");
if (spec.package_ownership !== "domain-local") throw new Error("visual artwork ownership must remain domain-local");

const expectedClasses = {
  hero_scene: [2400, 800, false],
  product_wide: [1600, 950, true],
  product_square: [1400, 1400, true],
  product_landscape: [1600, 1200, true]
};

for (const [name, [width, height, transparent]] of Object.entries(expectedClasses)) {
  const row = spec.visual_classes?.[name];
  if (!row) throw new Error(`missing shared visual class: ${name}`);
  if (row.width !== width || row.height !== height) throw new Error(`${name} dimensions drifted`);
  if (row.transparent_background !== transparent) throw new Error(`${name} transparency contract drifted`);
}

if (spec.visual_classes.hero_scene.requires_focal_point !== true) throw new Error("hero_scene must require focal point metadata");
if (spec.visual_classes.hero_scene.requires_safe_area !== true) throw new Error("hero_scene must require safe-area metadata");

const quality = new Set(spec.quality_values || []);
for (const value of [
  "verified_product",
  "verified_appearance",
  "representative_brand",
  "representative_generic",
  "generic_family",
  "derived_appearance",
  "deprecated"
]) {
  if (!quality.has(value)) throw new Error(`missing visual quality value: ${value}`);
}

const order = spec.product_search_order || [];
if (order.join(">") !== "sku>brand_model>brand_type>official_manufacturer>authorised_distributor>generated_or_derived") {
  throw new Error("product search order drifted");
}

const invariants = spec.invariants || {};
for (const key of [
  "hero_must_not_be_generic_fallback",
  "domain_assets_remain_package_local",
  "core_must_not_own_domain_products",
  "verified_product_must_not_use_generic_artwork",
  "manifest_is_domain_source_of_truth"
]) {
  if (invariants[key] !== true) throw new Error(`visual invariant disabled: ${key}`);
}

const raw = fs.readFileSync("src/visual-spec.json", "utf8").toLowerCase();
for (const forbidden of [
  "solaredge",
  "homewizard",
  "jinkosolar",
  "sunpower",
  "battery_system",
  "solar_inverter",
  "vehicle",
  "charger"
]) {
  if (raw.includes(forbidden)) throw new Error(`domain/product knowledge leaked into Core visual spec: ${forbidden}`);
}

console.log("PASS shared visual-library governance contract");


import { sharedStyleOverrides, readConsumerCss } from "../tools/check-consumer-style.mjs";
import assert from "node:assert/strict";

const shared = spec.shared_layout;
if (shared.authority !== "rhi-ux-core/src/primitives.css" || shared.hero_class !== "hero_scene"
    || shared.hero_image_layer !== "background" || shared.hero_image_fit !== "cover"
    || shared.hero_copy_safe_side !== "left") throw new Error("shared shell/Hero authority drifted");
assert.deepEqual(shared.hero_heights_px,{desktop:146,desktop_compact:140,tablet:128,phone:118});
assert.deepEqual(shared.hero_breakpoints_max_px,{desktop_compact:1180,tablet:760,phone:430});
const coreCss = fs.readFileSync("src/primitives.css","utf8");
for (const size of ["height:146px;min-height:146px","height:140px;min-height:140px",
                    "height:128px;min-height:128px","height:118px;min-height:118px"]) {
  if (!coreCss.includes(size)) throw new Error("Canonical Hero geometry drifted: "+size);
}
for (const name of ["rhiUxPageHero","rhiUxPageHeroCopy","rhiUxPageHeroArt",
                    "rhiUxDomainShell","rhiUxDomainTab","rhiUxModuleTab"]) {
  if (!shared.protected_consumer_selectors.includes(name)) throw new Error("Missing protected shared selector: "+name);
}
assert.deepEqual(sharedStyleOverrides(".domain-own-card{display:grid}.domain-kpis{gap:8px}"),[]);
assert.deepEqual(sharedStyleOverrides("/* .rhiUxPageHero{height:10px} */ .domain-card{color:blue}"),[]);
for (const bad of [
  ".planning-card .rhiUxPageHero{height:126px}",
  "@media(max-width:520px){.notify-standalone .rhiUxPageHeroCopy h2{font-size:24px}}",
  ".rhiUxDomainShell,.module-card{padding:0}",
  ".finance-card .rhiUxDomainTab.active{color:red}"
]) if (sharedStyleOverrides(bad).length === 0) throw new Error("Missing consumer CSS drift detection: "+bad);
console.log("PASS central shell/Hero layout specification and consumer override detector");
