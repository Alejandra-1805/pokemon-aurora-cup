import vm from 'node:vm';
import fs from 'node:fs';
const source=JSON.parse(fs.readFileSync(new URL('./game-source.json',import.meta.url),'utf8'));
export function replayRound(seed,round,steps){
 if(!Number.isInteger(round)||round<0||round>3||!Array.isArray(steps)||steps.length>12000||steps.length<2)throw Error('Invalid replay');
 let elapsed=0;
 for(const packet of steps){if(!Array.isArray(packet)||packet.length!==3)throw Error('Invalid frame');const [dt,mask,events]=packet;if(!Number.isFinite(dt)||dt<=0||dt>.040001||!Number.isInteger(mask)||mask<0||mask>15||!Array.isArray(events)||events.length>12)throw Error('Invalid input');elapsed+=dt;for(const e of events){if(!Array.isArray(e)||e.length!==3||![0,1].includes(e[0])||!Number.isInteger(e[1])||e[1]<0||e[1]>15||!Number.isInteger(e[2])||e[2]<0||e[2]>3)throw Error('Invalid action')}}
 if(elapsed<(round===1?45:30)-.06||elapsed>(round===1?45:30)+.08)throw Error('Incomplete round');
 const ctx=new Proxy({},{get:()=>()=>{}}),els={};function el(id){return els[id]??={style:{},value:'Player',getContext:()=>ctx,querySelectorAll:()=>[],querySelector:()=>el('canvas'),addEventListener:()=>{}}}
 const math=Object.create(Math);let rng=(seed+round)>>>0;math.random=()=>{rng=(rng+0x6D2B79F5)>>>0;let t=rng;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296};
 const box={Math:math,JSON,Image:class {complete=false;naturalWidth=0;},console:{log:()=>{}},document:{getElementById:el,querySelectorAll:()=>[],activeElement:{tagName:'BODY'}},window:{addEventListener:()=>{}},localStorage:{getItem:()=>null,setItem:()=>{}},setTimeout:()=>{},clearTimeout:()=>{},setInterval:()=>{},requestAnimationFrame:()=>{},packets:steps,requestedRound:round};
 vm.createContext(box);vm.runInContext(source.core+'\n'+source.game,box,{timeout:1000});
 vm.runInContext(`tour.round=requestedRound;time=0;last=0;begin();function maskKeys(m){return {ArrowUp:!!(m&1),ArrowRight:!!(m&2),ArrowDown:!!(m&4),ArrowLeft:!!(m&8)}};for(const [dt,m,events] of packets){if(tour.mode!=='play')throw Error('Extra replay frames');for(const [kind,em,arg] of events){keys=maskKeys(em);if(kind===0)action();else memory(arg)}keys=maskKeys(m);frame(last+dt*1000)}if(tour.mode!=='result')throw Error('Round not finished');verifiedScore=tour.total;`,box,{timeout:4000});
 return {score:box.verifiedScore,elapsed};
}
