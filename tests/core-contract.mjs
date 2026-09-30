import fs from "node:fs";
import vm from "node:vm";
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const src=fs.readFileSync("dist/rhi-ux-core.js","utf8");
const context={String,Object,Array};
vm.createContext(context);
vm.runInContext(src,context);
const coreVersion=vm.runInContext("RHI_UX_CORE_VERSION",context);
if(coreVersion!==pkg.version) throw new Error(`Core version projection drift: ${coreVersion} != ${pkg.version}`);
const required=["rhiUxEscape","rhiUxDisplay","rhiUxStatusItem","rhiUxStatusGrid","rhiUxPageHero","rhiUxState","rhiUxConclusion","rhiUxTechnicalFooter","rhiUxCompanyBrand","rhiUxDomainShell","rhiUxQuickActionBar","rhiUxContextBar","rhiUxReadNavigationRegistry","rhiUxRegisterDomainNavigation","rhiUxResolveDomainAssetNavigation","rhiUxVisualPickerShell","rhiUxVisualPickerStyles","rhiUxVisualFilterButtons","rhiUxVisualChoice","rhiUxVisualSelect"];
for(const name of required){
  if(typeof context[name]!=="function") throw new Error(`missing public primitive: ${name}`);
}
if(context.rhiUxDisplay(null)!=="—") throw new Error("null display semantics drifted");
if(context.rhiUxDisplay(0)!=="0") throw new Error("zero must remain zero");
if(!context.rhiUxState({state:"unavailable",title:"No data"}).includes('data-state="unavailable"')) throw new Error("unavailable state rendering failed");
const css=fs.readFileSync("dist/rhi-ux-core.css","utf8");
for(const token of ["--rhi-color-primary","--rhi-space-1","--rhi-radius-lg","--rhi-page-max","--rhi-font-family","--rhi-font-display"]){
  if(!css.includes(token)) throw new Error(`missing token: ${token}`);
}
console.log("PASS RHI UX Core public primitive contract");

const shell=context.rhiUxDomainShell({domain:"TEST",modules:[{id:"main",label:"Main",items:[{id:"overview",label:"Overview"}]}],activeModule:"main",activeItem:"overview"});
if(!shell.includes("rhiUxDomainShell") || !shell.includes("rhiUxDomainTab active")) throw new Error("domain shell primitive failed");

const navShell=context.rhiUxDomainShell({domain:"TEST",modules:[{id:"main",label:"Main",target:"/overview",items:[{id:"overview",label:"Overview",target:"/overview"}]}],activeModule:"main",activeItem:"overview"});
if(!navShell.includes('data-nav="/overview"')) throw new Error("shared shell must expose one canonical data-nav navigation attribute");
if(navShell.includes("data-target=")) throw new Error("legacy Core data-target navigation attribute is forbidden");
console.log("PASS shared navigation attribute contract");

const brand=context.rhiUxCompanyBrand();
if(!brand.includes("rhiUxCompanyLogo") || !brand.includes("Robotix.be") || !brand.includes("DomotiX · Network · Security")) throw new Error("canonical company brand primitive failed");
if(src.includes("__RHI_UX_COMPANY_LOGO_INLINE__")) throw new Error("company logo placeholder leaked into built Core");
if(src.includes("http://www.w3.org/2000/svg")) throw new Error("inline company brand must not leak SVG namespace URL into runtime JS");
const brandAsset=fs.readFileSync("dist/assets/branding/company-logo.svg","utf8");
if(!brandAsset.includes("Robotix.be") || !brandAsset.includes("#0B4C86") || !brandAsset.includes("#5B95C8")) throw new Error("canonical company logo asset drifted");
console.log("PASS canonical company branding contract");

if(!css.includes(".rhiUxPageHeroArt{position:absolute")) throw new Error("hero image must be a background layer");
if(!css.includes(".rhiUxQuickAction.primary")) throw new Error("canonical quick-action primary state missing");
if(!css.includes(".rhiUxDomainBody")) throw new Error("canonical body grammar missing");
const actions=context.rhiUxQuickActionBar({actions:[{label:"Overview",target:"/overview"},{label:"Details",target:"/details"}]});
if(!actions.includes("rhiUxQuickAction primary") || !actions.includes('data-nav="/overview"')) throw new Error("canonical quick action bar failed");
console.log("PASS unified hero/status/actions/body contract");

if(!css.includes(".rhiUxPageStack>.rhiUxPageHero{order:1}")) throw new Error("page hero order invariant missing");
if(!css.includes(".rhiUxPageStack>.rhiUxStatusGrid{order:2}")) throw new Error("page status order invariant missing");
if(!css.includes(".rhiUxPageStack>.rhiUxQuickActionBar{order:3}")) throw new Error("page quick-action order invariant missing");

const noContext=context.rhiUxContextBar({controls:[]});
if(noContext!=="") throw new Error("empty context controls must not render chrome");
const contextBar=context.rhiUxContextBar({label:"Period",controls:[{label:"Today",value:"D0",active:true},{label:"Tomorrow",value:"D1"}],controlsId:"planning-body"});
if(!contextBar.includes("rhiUxContextBar") || !contextBar.includes('aria-controls="planning-body"') || !contextBar.includes("rhiUxContextControl active")) throw new Error("body-scoped context controls primitive failed");
console.log("PASS optional body-scoped context controls");


const memoryStore = (() => {
  let value = {};
  return {
    getItem:key => value[key] ?? null,
    setItem:(key,next) => { value[key]=String(next); }
  };
})();
if(!context.rhiUxRegisterDomainNavigation({domain:"rhi_test",assetDetailTemplate:"/custom-dashboard/asset-detail?asset={asset_id}"},memoryStore)) throw new Error("domain navigation registration failed");
const resolvedNav=context.rhiUxResolveDomainAssetNavigation("rhi_test","vehicle one",memoryStore);
if(resolvedNav!=="/custom-dashboard/asset-detail?asset=vehicle%20one") throw new Error("domain asset navigation resolution failed");
if(context.rhiUxRegisterDomainNavigation({domain:"rhi_bad",assetDetailTemplate:"https://example.test/{asset_id}"},memoryStore)) throw new Error("absolute navigation templates must be rejected");
console.log("PASS generic cross-domain navigation registry");

const visualFilters=context.rhiUxVisualFilterButtons({values:["Audi","BMW"],active:"Audi"});if(!visualFilters.includes('aria-pressed="true"'))throw new Error("visual filter primitive failed");const visualChoice=context.rhiUxVisualChoice({id:"q8",image:"/q8.png",label:"Q8",selected:true});if(!visualChoice.includes("rhiUxVisualChoice selected"))throw new Error("visual choice primitive failed");const visualSelect=context.rhiUxVisualSelect({label:"Colour",value:"grey",options:[{value:"grey",label:"Grey"}]});if(!visualSelect.includes('value="grey" selected'))throw new Error("visual select primitive failed");console.log("PASS canonical cross-domain appearance primitives");


for (const token of [
  '.rhiUxVisualChoice{height:142px;min-height:142px;max-height:142px',
  '.rhiUxVisualChoiceImage{width:100%;height:86px;min-width:0;min-height:86px;max-width:none;max-height:86px',
  '.rhiUxVisualChoiceImage img{display:block;width:100%;height:100%;min-width:0;min-height:0;max-width:100%;max-height:100%;object-fit:contain;object-position:center}',
  '.rhiUxVisualChoice{height:116px;min-height:116px;max-height:116px;grid-template-columns:94px minmax(0,1fr)'
]) {
  if (!css.includes(token)) throw new Error('visual choice image zone must be fixed, bounded and source-size independent: '+token);
}
console.log("PASS visual choice artwork geometry is fixed and source-size independent");


const pickerCss=context.rhiUxVisualPickerStyles();
for(const token of [
  "max-height:min(82vh,760px)",
  "grid-template-columns:repeat(3,minmax(0,1fr))",
  "grid-auto-rows:142px",
  "overflow-y:auto",
  "object-fit:contain",
  "grid-template-rows:auto auto minmax(0,1fr) auto auto"
]){
  if(!pickerCss.includes(token)) throw new Error(`bounded appearance picker contract missing: ${token}`);
}
if(pickerCss.includes("overflow:auto;background:#fff")) throw new Error("whole appearance modal must not own scrolling");
console.log("PASS bounded compact appearance picker contract");
