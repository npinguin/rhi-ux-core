import fs from "node:fs";
import vm from "node:vm";
const src=fs.readFileSync("dist/rhi-ux-core.js","utf8");
const context={String,Object,Array};
vm.createContext(context);
vm.runInContext(src,context);
const required=["rhiUxEscape","rhiUxDisplay","rhiUxStatusItem","rhiUxStatusGrid","rhiUxPageHero","rhiUxState","rhiUxConclusion","rhiUxTechnicalFooter"];
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
