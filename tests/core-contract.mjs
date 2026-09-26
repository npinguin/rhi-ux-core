import fs from "node:fs";
import vm from "node:vm";
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const src=fs.readFileSync("dist/rhi-ux-core.js","utf8");
const context={String,Object,Array};
vm.createContext(context);
vm.runInContext(src,context);
const coreVersion=vm.runInContext("RHI_UX_CORE_VERSION",context);
if(coreVersion!==pkg.version) throw new Error(`Core version projection drift: ${coreVersion} != ${pkg.version}`);
const required=["rhiUxEscape","rhiUxDisplay","rhiUxStatusItem","rhiUxStatusGrid","rhiUxPageHero","rhiUxState","rhiUxConclusion","rhiUxTechnicalFooter","rhiUxCompanyBrand","rhiUxDomainShell"];
for(const name of required){
  if(typeof context[name]!=="function") throw new Error(`missing public primitive: ${name}`);
}
if(context.rhiUxDisplay(null)!=="—") throw new Error("null display semantics drifted");
if(context.rhiUxDisplay(0)!=="0") throw new Error("zero must remain zero");
if(!context.rhiUxState({state:"unavailable",title:"No data"}).includes('data-state="unavailable"')) throw new Error("unavailable state rendering failed");
const css=fs.readFileSync("dist/rhi-ux-core.css","utf8");
for(const token of ["--rhi-color-primary","--rhi-space-1","--rhi-radius-lg","--rhi-page-max"]){
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
