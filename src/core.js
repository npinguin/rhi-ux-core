// RHI UX Core 1.5.2 — build-time presentation primitives only.
// No domain semantics or Home Assistant contract/entity knowledge belongs here.
const RHI_UX_CORE_VERSION = "1.5.2";
const RHI_UX_COMPANY_LOGO_SVG = "__RHI_UX_COMPANY_LOGO_INLINE__";

function rhiUxEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[ch]));
}

function rhiUxDisplay(value, fallback = "—") {
  return value === undefined || value === null || value === "" ? fallback : String(value);
}

function rhiUxStatusItem({ icon = "•", label = "", value = "—", detail = "" } = {}) {
  const iconMarkup = /^mdi:/.test(String(icon || "")) ? `<ha-icon icon="${rhiUxEscape(icon)}"></ha-icon>` : rhiUxEscape(icon);
  return `<div class="rhiUxStatusItem"><span class="rhiUxStatusIcon">${iconMarkup}</span><div class="rhiUxStatusCopy"><small>${rhiUxEscape(label)}</small><b>${rhiUxEscape(rhiUxDisplay(value))}</b>${detail ? `<em>${rhiUxEscape(detail)}</em>` : ""}</div></div>`;
}

function rhiUxStatusGrid(items = []) {
  return `<section class="rhiUxStatusGrid">${items.map(rhiUxStatusItem).join("")}</section>`;
}

function rhiUxPageHero({ eyebrow = "", title = "", description = "", image = "", imageAlt = "" } = {}) {
  return `<section class="rhiUxPageHero"><div class="rhiUxPageHeroCopy">${eyebrow ? `<small>${rhiUxEscape(eyebrow)}</small>` : ""}<h2>${rhiUxEscape(title)}</h2>${description ? `<p>${rhiUxEscape(description)}</p>` : ""}</div>${image ? `<div class="rhiUxPageHeroArt"><img src="${rhiUxEscape(image)}" alt="${rhiUxEscape(imageAlt)}"></div>` : ""}</section>`;
}

function rhiUxState({ state = "unavailable", title = "Unavailable", detail = "" } = {}) {
  return `<div class="rhiUxState" data-state="${rhiUxEscape(state)}"><b>${rhiUxEscape(title)}</b>${detail ? `<span>${rhiUxEscape(detail)}</span>` : ""}</div>`;
}

function rhiUxConclusion({ title = "", detail = "", label = "Conclusion" } = {}) {
  return `<section class="rhiUxConclusion"><div><small>${rhiUxEscape(label)}</small><h2>${rhiUxEscape(title)}</h2>${detail ? `<p>${rhiUxEscape(detail)}</p>` : ""}</div></section>`;
}

function rhiUxTechnicalFooter({ product = "", uxVersion = "", backendVersion = "", issue = "", severity = "" } = {}) {
  return `<footer class="rhiUxTechnicalFooter"><span>${rhiUxEscape(product)} UX ${rhiUxEscape(uxVersion)}</span><span>Backend ${rhiUxEscape(rhiUxDisplay(backendVersion,"Unknown"))}</span>${issue ? `<span data-severity="${rhiUxEscape(severity)}">${rhiUxEscape(issue)}</span>` : ""}</footer>`;
}

function rhiUxCompanyBrand({ ariaLabel = "Robotix.be — DomotiX · Network · Security" } = {}) {
  return `<span class="rhiUxCompanyLogo" role="img" aria-label="${rhiUxEscape(ariaLabel)}">${RHI_UX_COMPANY_LOGO_SVG}</span>`;
}

function rhiUxDomainShell({ product = "Home Intelligence", domain = "", modules = [], activeModule = "", activeItem = "", brandHtml = rhiUxCompanyBrand() } = {}) {
  const selected = modules.find(row => String(row.id || "") === String(activeModule || "")) || modules[0] || { items:[] };
  const moduleButtons = modules.map(row => {
    const active = String(row.id || "") === String(selected.id || "");
    return `<button type="button" class="rhiUxModuleTab${active ? " active" : ""}" data-rhi-module="${rhiUxEscape(row.id || "")}"${row.target ? ` data-nav="${rhiUxEscape(row.target)}"` : ""}><span>${rhiUxEscape(row.label || row.id || "")}</span></button>`;
  }).join("");
  const itemButtons = (selected.items || []).map(row => {
    const active = String(row.id || "") === String(activeItem || "");
    return `<button type="button" class="rhiUxDomainTab${active ? " active" : ""}" data-rhi-item="${rhiUxEscape(row.id || "")}"${row.target ? ` data-nav="${rhiUxEscape(row.target)}"` : ""}><span>${rhiUxEscape(row.label || row.id || "")}</span></button>`;
  }).join("");
  return `<header class="rhiUxDomainShell"><div class="rhiUxProductArea"><div class="rhiUxDomainShellTop"><div class="rhiUxDomainIdentity"><span>${rhiUxEscape(product)}</span><strong>${rhiUxEscape(domain)}</strong></div><nav class="rhiUxModuleTabs" aria-label="Modules">${moduleButtons}</nav></div><div class="rhiUxDomainShellBottom"><nav class="rhiUxDomainTabs" aria-label="${rhiUxEscape(selected.label || domain || "Domain")} navigation">${itemButtons}</nav></div></div>${brandHtml ? `<div class="rhiUxCompanyBrand">${brandHtml}</div>` : ""}</header>`;
}


function rhiUxQuickActionBar({ label = "Quick actions", actions = [] } = {}) {
  return `<section class="rhiUxQuickActionBar" aria-label="${rhiUxEscape(label)}"><small>${rhiUxEscape(label)}</small><div class="rhiUxQuickActions">${actions.map((action,index) => `<button type="button" class="rhiUxQuickAction${action.primary || index === 0 ? " primary" : ""}"${action.target ? ` data-nav="${rhiUxEscape(action.target)}"` : ""}${action.disabled ? " disabled" : ""}>${action.icon ? `<ha-icon icon="${rhiUxEscape(action.icon)}"></ha-icon>` : ""}<span>${rhiUxEscape(action.label || "Open")}</span></button>`).join("")}</div></section>`;
}

function rhiUxContextBar({ label = "View", controls = [], controlsId = "" } = {}) {
  if (!Array.isArray(controls) || controls.length === 0) return "";
  const labelled = label ? `<small>${rhiUxEscape(label)}</small>` : "";
  const body = controls.map((control,index) => {
    const attrs = [];
    if (control.value !== undefined) attrs.push(`data-value="${rhiUxEscape(control.value)}"`);
    if (control.target) attrs.push(`data-nav="${rhiUxEscape(control.target)}"`);
    if (control.pressed !== undefined) attrs.push(`aria-pressed="${control.pressed ? "true" : "false"}"`);
    if (control.disabled) attrs.push("disabled");
    const cls = `rhiUxContextControl${control.active || control.pressed ? " active" : ""}`;
    return `<button type="button" class="${cls}" ${attrs.join(" ")}>${rhiUxEscape(control.label || control.value || `Option ${index+1}`)}</button>`;
  }).join("");
  const idAttr = controlsId ? ` aria-controls="${rhiUxEscape(controlsId)}"` : "";
  return `<section class="rhiUxContextBar" aria-label="${rhiUxEscape(label || "View controls")}"${idAttr}>${labelled}<div class="rhiUxContextControls">${body}</div></section>`;
}


const RHI_UX_NAVIGATION_STORAGE_KEY = "rhi.navigation.registry.v1";

function rhiUxReadNavigationRegistry(storage = globalThis?.localStorage) {
  try {
    const raw = storage?.getItem?.(RHI_UX_NAVIGATION_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (_) {
    return {};
  }
}

function rhiUxRegisterDomainNavigation({ domain = "", assetDetailTemplate = "" } = {}, storage = globalThis?.localStorage) {
  const key = String(domain || "").trim();
  const template = String(assetDetailTemplate || "").trim();
  if (!/^[a-z0-9][a-z0-9_-]*$/.test(key)) return false;
  if (!template || !template.includes("{asset_id}")) return false;
  if (/^https?:\/\//i.test(template)) return false;
  try {
    const registry = rhiUxReadNavigationRegistry(storage);
    registry[key] = { asset_detail_template:template };
    storage?.setItem?.(RHI_UX_NAVIGATION_STORAGE_KEY, JSON.stringify(registry));
    return true;
  } catch (_) {
    return false;
  }
}

function rhiUxResolveDomainAssetNavigation(domain = "", assetId = "", storage = globalThis?.localStorage) {
  const key = String(domain || "").trim();
  const id = String(assetId || "").trim();
  if (!key || !id) return "";
  const row = rhiUxReadNavigationRegistry(storage)[key];
  const template = String(row?.asset_detail_template || "");
  if (!template.includes("{asset_id}")) return "";
  return template.replaceAll("{asset_id}", encodeURIComponent(id));
}


function rhiUxVisualPickerShell({
  eyebrow = "Appearance",
  title = "Choose appearance",
  description = "",
  filtersHtml = "",
  choicesHtml = "",
  refineHtml = "",
  selectedHtml = "",
  resetHtml = "",
  cancelHtml = "",
  saveHtml = "",
  modal = false,
  closeHtml = ""
} = {}) {
  const panel = `<section class="rhiUxVisualPickerPanel" role="${modal ? "dialog" : "region"}"${modal ? ' aria-modal="true"' : ""}>
    <header class="rhiUxVisualPickerHead"><div><small>${rhiUxEscape(eyebrow)}</small><h3>${rhiUxEscape(title)}</h3>${description ? `<p>${rhiUxEscape(description)}</p>` : ""}</div>${closeHtml}</header>
    ${filtersHtml ? `<div class="rhiUxVisualPickerFilters">${filtersHtml}</div>` : ""}
    <div class="rhiUxVisualChoiceGrid">${choicesHtml}</div>
    ${refineHtml ? `<div class="rhiUxVisualPickerRefine">${refineHtml}</div>` : ""}
    <footer class="rhiUxVisualPickerFooter">${resetHtml}<span class="rhiUxVisualPickerSpacer"></span>${selectedHtml}${cancelHtml}${saveHtml}</footer>
  </section>`;
  return modal ? `<div class="rhiUxVisualPickerBackdrop">${panel}</div>` : panel;
}
