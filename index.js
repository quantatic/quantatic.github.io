(()=>{"use strict";var e,r,t,n,a,o,i={404:(e,r,t)=>{t.a(e,(async(e,r)=>{try{var n=t(838),a=e([n]);(n=(a.then?(await a)():a)[0]).Qq(),r()}catch(e){r(e)}}))},838:(e,r,t)=>{t.a(e,(async(n,a)=>{try{t.d(r,{H7:()=>f,Or:()=>l,Qq:()=>u});var o=t(530);e=t.hmd(e);var i=n([o]);o=(i.then?(await i)():i)[0];let c=new("undefined"==typeof TextDecoder?(0,e.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});c.decode();let s=null;function p(e,r){return c.decode((null!==s&&s.buffer===o.memory.buffer||(s=new Uint8Array(o.memory.buffer)),s).subarray(e,e+r))}function u(){o.greet()}function f(e,r){alert(p(e,r))}function l(e,r){throw new Error(p(e,r))}a()}catch(b){a(b)}}))},530:(e,r,t)=>{t.a(e,(async(n,a)=>{try{var o,i=n([o=t(838)]),[o]=i.then?(await i)():i;await t.v(r,e.id,"08074ae903ff45e7d4ce",{"./index_bg.js":{__wbg_alert_4914cfe43bafd4ba:o.H7,__wbindgen_throw:o.Or}}),a()}catch(e){a(e)}}),1)}},c={};function s(e){var r=c[e];if(void 0!==r)return r.exports;var t=c[e]={id:e,loaded:!1,exports:{}};return i[e](t,t.exports,s),t.loaded=!0,t.exports}e="function"==typeof Symbol?Symbol("webpack then"):"__webpack_then__",r="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",t="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",n=e=>{e&&(e.forEach((e=>e.r--)),e.forEach((e=>e.r--?e.r++:e())))},a=e=>!--e.r&&e(),o=(e,r)=>e?e.push(r):a(r),s.a=(i,c,s)=>{var p,u,f,l=s&&[],b=i.exports,h=!0,d=!1,y=(r,t,n)=>{d||(d=!0,t.r+=r.length,r.map(((r,a)=>r[e](t,n))),d=!1)},m=new Promise(((e,r)=>{f=r,u=()=>(e(b),n(l),l=0)}));m[r]=b,m[e]=(e,r)=>{if(h)return a(e);p&&y(p,e,r),o(l,e),m.catch(r)},i.exports=m,c((i=>{var c;p=(i=>i.map((i=>{if(null!==i&&"object"==typeof i){if(i[e])return i;if(i.then){var c=[];i.then((e=>{s[r]=e,n(c),c=0}),(e=>{s[t]=e,n(c),c=0}));var s={};return s[e]=(e,r)=>(o(c,e),i.catch(r)),s}}var p={};return p[e]=e=>a(e),p[r]=i,p})))(i);var s=()=>p.map((e=>{if(e[t])throw e[t];return e[r]})),u=new Promise(((e,r)=>{(c=()=>e(s)).r=0,y(p,c,r)}));return c.r?u:s()}),(e=>(e&&f(m[t]=e),u()))),h=!1},s.d=(e,r)=>{for(var t in r)s.o(r,t)&&!s.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},s.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),s.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),s.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),s.v=(e,r,t,n)=>{var a=fetch(s.p+""+t+".module.wasm");return"function"==typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(a,n).then((r=>Object.assign(e,r.instance.exports))):a.then((e=>e.arrayBuffer())).then((e=>WebAssembly.instantiate(e,n))).then((r=>Object.assign(e,r.instance.exports)))},(()=>{var e;s.g.importScripts&&(e=s.g.location+"");var r=s.g.document;if(!e&&r&&(r.currentScript&&(e=r.currentScript.src),!e)){var t=r.getElementsByTagName("script");t.length&&(e=t[t.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),s.p=e})(),s(404)})();