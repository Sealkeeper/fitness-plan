import { build } from 'esbuild';
import {muscleHealthFor} from './health.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const result = await build({entryPoints:[path.join(root,'viewer.js')],bundle:true,minify:true,format:'iife',target:['es2020'],write:false,legalComments:'inline'});
let html = await fs.readFile(path.join(root,'../训练计划.html'),'utf8');
// Replace obsolete health claims in the source data too, not just its display.
const infoStart=html.indexOf('const MUSCLE_INFO =');
const infoEnd=html.indexOf('\n};',infoStart)+3;
if(infoStart<0||infoEnd<3)throw new Error('Missing original muscle library');
const info=html.slice(infoStart,infoEnd).replace(/('([^']+)': \{part:[\s\S]*?desc:)(?:'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g,(_entry,prefix,name)=>{
 const h=muscleHealthFor(name);if(!h)throw new Error('Missing health profile: '+name);
 const text=h.role+' '+h.benefit+' '+h.limits;
 return prefix+JSON.stringify(text);
});
html=html.slice(0,infoStart)+info+html.slice(infoEnd);
const css = await fs.readFile(path.join(root,'viewer.css'),'utf8');
const licenses = await fs.readFile(path.join(root,'THIRD_PARTY_LICENSES.txt'),'utf8');
const code = ('/*\n'+licenses+'\n*/\n'+result.outputFiles[0].text).replace(/<\/script/gi,'<\\/script').replace(/[\t ]+$/gm,'');
const style = '\n/* ANATOMY_STYLES_START */\n'+css+'\n/* ANATOMY_STYLES_END */\n';
if(html.includes('/* ANATOMY_STYLES_START */')) html=html.replace(/\n\/\* ANATOMY_STYLES_START \*\/[\s\S]*?\/\* ANATOMY_STYLES_END \*\/\n/,style);
else html=html.replace('</style>',style+'</style>');
const runtime='<script id="anatomy-runtime">'+code+'</script>';
if(/^<script id="anatomy-runtime">/m.test(html)) html=html.replace(/^<script id="anatomy-runtime">[\s\S]*?<\/script>/m,()=>runtime);
else html=html.replace(/^<script id="userlib"/m,()=>runtime+'\n\n<script id="userlib"');
// File previews expose the HTML itself, without adjacent workspace assets.
// Embed model data as inert JSON; decode it only when the viewer becomes visible.
const modelSource = await fs.readFile(path.join(root,'../assets/anatomy/models.js'),'utf8');
const prefix = 'window.__ANATOMY_ASSETS__=';
const start = modelSource.indexOf(prefix);
if(start < 0) throw new Error('Missing anatomy model payload');
const models = JSON.parse(modelSource.slice(start+prefix.length).trim().replace(/;$/,''));
const modelTag = '<script id="anatomy-inline-assets" type="application/json">'+JSON.stringify(models).replace(/</g,'\\u003c')+'</script>';
if(/^<script id="anatomy-inline-assets"(?:\s|>)/m.test(html)) html=html.replace(/^<script id="anatomy-inline-assets"[^>]*>[\s\S]*?<\/script>/m,()=>modelTag);
else html=html.replace(/^<script id="anatomy-runtime">/m,()=>modelTag+'\n<script id="anatomy-runtime">');
await fs.writeFile(path.join(root,'../训练计划.html'),html);
console.log('Anatomy runtime, styles and models embedded in standalone 训练计划.html');
