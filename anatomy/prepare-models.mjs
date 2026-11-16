import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup,prune,simplify,meshopt} from '@gltf-transform/functions';
import {MeshoptEncoder,MeshoptDecoder,MeshoptSimplifier} from 'meshoptimizer';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const input=process.argv[2];
if(!input)throw new Error('Usage: node prepare-models.mjs /path/to/BodyExplorer/public');
await Promise.all([MeshoptEncoder.ready,MeshoptDecoder.ready,MeshoptSimplifier.ready]);
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder});
const output=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../assets/anatomy');
await fs.mkdir(output,{recursive:true});
const payload={};
for(const name of ['anatomy','skeleton']){
 const document=await io.read(path.resolve(input,name+'.glb'));
 await document.transform(dedup(),simplify({simplifier:MeshoptSimplifier,ratio:name==='anatomy'?0.55:0.4,error:0.0005}),prune(),meshopt({encoder:MeshoptEncoder,level:'medium'}));
 const bytes=await io.writeBinary(document);
 payload[name]=Buffer.from(bytes).toString('base64');
 console.log(name,bytes.length,'bytes');
}
payload.mapping=JSON.parse(await fs.readFile(path.resolve(input,'mesh_mapping.json'),'utf8'));
await fs.writeFile(path.join(output,'models.js'),'/* BodyParts3D: CC BY-SA 2.1 JP. Z-Anatomy: CC BY-SA 4.0. See ATTRIBUTION.md. */\nwindow.__ANATOMY_ASSETS__='+JSON.stringify(payload)+';\n');
