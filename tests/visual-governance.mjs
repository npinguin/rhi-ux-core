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
