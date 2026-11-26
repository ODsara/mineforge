const lu="modulepreload",cu=function(i){return"/"+i},Ml={},hu=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){let a=function(l){return Promise.all(l.map(d=>Promise.resolve(d).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),c=o?.nonce||o?.getAttribute("nonce");s=a(e.map(l=>{if(l=cu(l),l in Ml)return;Ml[l]=!0;const d=l.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${u}`))return;const h=document.createElement("link");if(h.rel=d?"stylesheet":lu,d||(h.as="script"),h.crossOrigin="",h.href=l,c&&h.setAttribute("nonce",c),document.head.appendChild(h),d)return new Promise((f,g)=>{h.addEventListener("load",f),h.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return t().catch(r)})};/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const es={ROTATE:0,DOLLY:1,PAN:2},ts={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},uu=0,yl=1,du=2,Br=1,fu=2,Cs=3,Ci=0,rn=1,cn=2,ns=0,Ns=1,bl=2,El=3,Tl=4,pu=5,Qi=100,mu=101,gu=102,_u=103,vu=104,xu=200,Su=201,Mu=202,yu=203,ih=204,sh=205,bu=206,Eu=207,Tu=208,Au=209,wu=210,Ru=211,Cu=212,Pu=213,Lu=214,Za=0,$a=1,Ja=2,Bs=3,Qa=4,ja=5,to=6,eo=7,rh=0,Du=1,Nu=2,jn=0,ah=1,oh=2,lh=3,Vo=4,ch=5,hh=6,uh=7,Al="attached",Iu="detached",dh=300,as=301,ks=302,ha=303,ua=304,no=1e3,$n=1001,io=1002,ke=1003,Uu=1004,sr=1005,sn=1006,da=1007,di=1008,hn=1009,fh=1010,ph=1011,zs=1012,Go=1013,kn=1014,gn=1015,zn=1016,Wo=1017,Xo=1018,os=1020,mh=35902,gh=35899,_h=1021,vh=1022,bn=1023,gi=1026,fi=1027,qo=1028,Yo=1029,Pi=1030,Ko=1031,Zo=1033,kr=33776,zr=33777,Hr=33778,Vr=33779,so=35840,ro=35841,ao=35842,oo=35843,lo=36196,co=37492,ho=37496,uo=37488,fo=37489,qr=37490,po=37491,mo=37808,go=37809,_o=37810,vo=37811,xo=37812,So=37813,Mo=37814,yo=37815,bo=37816,Eo=37817,To=37818,Ao=37819,wo=37820,Ro=37821,Co=36492,Po=36494,Lo=36495,Do=36283,No=36284,Yr=36285,Io=36286,Kr=2300,Uo=2301,fa=2302,wl=2303,Rl=2400,Cl=2401,Pl=2402,Fu=2500,Uv=0,Fv=1,Ov=2,Ou=3200,Fo=0,Bu=1,ui="",fn="srgb",Zr="srgb-linear",$r="linear",ge="srgb",pa=7680,ku=519,zu=512,Hu=513,Vu=514,xh=515,Gu=516,Wu=517,Sh=518,Mh=519,yh=35044,Ll="300 es",En=2e3,Hs=2001;function Xu(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function qu(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Vs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Yu(){const i=Vs("canvas");return i.style.display="block",i}const Dl={};function Jr(...i){const t="THREE."+i.shift();console.log(t,...i)}function bh(i){const t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Nt(...i){i=bh(i);const t="THREE."+i.shift();{const e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function Gt(...i){i=bh(i);const t="THREE."+i.shift();{const e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function is(...i){const t=i.join(" ");t in Dl||(Dl[t]=!0,Nt(...i))}function Ku(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const Zu={[Za]:Za,[Ja]:to,[Qa]:Qa,[Bs]:ja,[$a]:$a,[to]:Ja,[eo]:eo,[ja]:Bs};class xi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Ge=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Nl=1234567;const ss=Math.PI/180,ls=180/Math.PI;function Hn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ge[i&255]+Ge[i>>8&255]+Ge[i>>16&255]+Ge[i>>24&255]+"-"+Ge[t&255]+Ge[t>>8&255]+"-"+Ge[t>>16&15|64]+Ge[t>>24&255]+"-"+Ge[e&63|128]+Ge[e>>8&255]+"-"+Ge[e>>16&255]+Ge[e>>24&255]+Ge[n&255]+Ge[n>>8&255]+Ge[n>>16&255]+Ge[n>>24&255]).toLowerCase()}function Yt(i,t,e){return Math.max(t,Math.min(e,i))}function $o(i,t){return(i%t+t)%t}function $u(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Ju(i,t,e){return i!==t?(e-i)/(t-i):0}function Is(i,t,e){return(1-e)*i+e*t}function Qu(i,t,e,n){return Is(i,t,1-Math.exp(-e*n))}function ju(i,t=1){return t-Math.abs($o(i,t*2)-t)}function td(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function ed(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function nd(i,t){return i+Math.floor(Math.random()*(t-i+1))}function id(i,t){return i+Math.random()*(t-i)}function sd(i){return i*(.5-Math.random())}function rd(i){i!==void 0&&(Nl=i);let t=Nl+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function ad(i){return i*ss}function od(i){return i*ls}function ld(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function cd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Eh(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function hd(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+n)/2),d=a((t+n)/2),u=r((t-n)/2),h=a((t-n)/2),f=r((n-t)/2),g=a((n-t)/2);switch(s){case"XYX":i.set(o*d,c*u,c*h,o*l);break;case"YZY":i.set(c*h,o*d,c*u,o*l);break;case"ZXZ":i.set(c*u,c*h,o*d,o*l);break;case"XZX":i.set(o*d,c*g,c*f,o*l);break;case"YXY":i.set(c*f,o*d,c*g,o*l);break;case"ZYZ":i.set(c*g,c*f,o*d,o*l);break;default:Nt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ia(i){switch(i.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Jo(i,t){if(t.constructor===Float32Array)return i;const e=ia(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(i/e,-1)}function Qo(i,t){if(t.constructor===Float32Array)return i;const e=ia(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(i*e)}const nn={DEG2RAD:ss,RAD2DEG:ls,generateUUID:Hn,clamp:Yt,euclideanModulo:$o,mapLinear:$u,inverseLerp:Ju,lerp:Is,damp:Qu,pingpong:ju,smoothstep:td,smootherstep:ed,randInt:nd,randFloat:id,randFloatSpread:sd,seededRandom:rd,degToRad:ad,radToDeg:od,isPowerOfTwo:ld,ceilPowerOfTwo:cd,floorPowerOfTwo:Eh,setQuaternionFromProperEuler:hd,normalize:Qo,denormalize:Jo};class wt{static{this.prototype.isVector2=!0}constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Yt(this.x,t.x,e.x),this.y=Yt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Yt(this.x,t,e),this.y=Yt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Yt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Yt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ni{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let c=n[s+0],l=n[s+1],d=n[s+2],u=n[s+3],h=r[a+0],f=r[a+1],g=r[a+2],x=r[a+3];if(u!==x||c!==h||l!==f||d!==g){let m=c*h+l*f+d*g+u*x;m<0&&(h=-h,f=-f,g=-g,x=-x,m=-m);let p=1-o;if(m<.9995){const v=Math.acos(m),E=Math.sin(v);p=Math.sin(p*v)/E,o=Math.sin(o*v)/E,c=c*p+h*o,l=l*p+f*o,d=d*p+g*o,u=u*p+x*o}else{c=c*p+h*o,l=l*p+f*o,d=d*p+g*o,u=u*p+x*o;const v=1/Math.sqrt(c*c+l*l+d*d+u*u);c*=v,l*=v,d*=v,u*=v}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],d=n[s+3],u=r[a],h=r[a+1],f=r[a+2],g=r[a+3];return t[e]=o*g+d*u+c*f-l*h,t[e+1]=c*g+d*h+l*u-o*f,t[e+2]=l*g+d*f+o*h-c*u,t[e+3]=d*g-o*u-c*h-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),d=o(s/2),u=o(r/2),h=c(n/2),f=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=h*d*u+l*f*g,this._y=l*f*u-h*d*g,this._z=l*d*g+h*f*u,this._w=l*d*u-h*f*g;break;case"YXZ":this._x=h*d*u+l*f*g,this._y=l*f*u-h*d*g,this._z=l*d*g-h*f*u,this._w=l*d*u+h*f*g;break;case"ZXY":this._x=h*d*u-l*f*g,this._y=l*f*u+h*d*g,this._z=l*d*g+h*f*u,this._w=l*d*u-h*f*g;break;case"ZYX":this._x=h*d*u-l*f*g,this._y=l*f*u+h*d*g,this._z=l*d*g-h*f*u,this._w=l*d*u+h*f*g;break;case"YZX":this._x=h*d*u+l*f*g,this._y=l*f*u+h*d*g,this._z=l*d*g-h*f*u,this._w=l*d*u-h*f*g;break;case"XZY":this._x=h*d*u-l*f*g,this._y=l*f*u-h*d*g,this._z=l*d*g+h*f*u,this._w=l*d*u+h*f*g;break;default:Nt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],d=e[6],u=e[10],h=n+o+u;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(d-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(d-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+d)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+d)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Yt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,d=e._w;return this._x=n*d+a*o+s*l-r*c,this._y=s*d+a*c+r*o-n*l,this._z=r*d+a*l+n*c-s*o,this._w=a*d-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-e;if(o<.9995){const l=Math.acos(o),d=Math.sin(l);c=Math.sin(c*l)/d,e=Math.sin(e*l)/d,this._x=this._x*c+n*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this._onChangeCallback()}else this._x=this._x*c+n*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{static{this.prototype.isVector3=!0}constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Il.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Il.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*n),d=2*(o*e-r*s),u=2*(r*n-a*e);return this.x=e+c*l+a*u-o*d,this.y=n+c*d+o*l-r*u,this.z=s+c*u+r*d-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Yt(this.x,t.x,e.x),this.y=Yt(this.y,t.y,e.y),this.z=Yt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Yt(this.x,t,e),this.y=Yt(this.y,t,e),this.z=Yt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Yt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ma.copy(this).projectOnVector(t),this.sub(ma)}reflect(t){return this.sub(ma.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Yt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ma=new I,Il=new ni;class qt{static{this.prototype.isMatrix3=!0}constructor(t,e,n,s,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l)}set(t,e,n,s,r,a,o,c,l){const d=this.elements;return d[0]=t,d[1]=s,d[2]=o,d[3]=e,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],d=n[4],u=n[7],h=n[2],f=n[5],g=n[8],x=s[0],m=s[3],p=s[6],v=s[1],E=s[4],b=s[7],T=s[2],A=s[5],_=s[8];return r[0]=a*x+o*v+c*T,r[3]=a*m+o*E+c*A,r[6]=a*p+o*b+c*_,r[1]=l*x+d*v+u*T,r[4]=l*m+d*E+u*A,r[7]=l*p+d*b+u*_,r[2]=h*x+f*v+g*T,r[5]=h*m+f*E+g*A,r[8]=h*p+f*b+g*_,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8];return e*a*d-e*o*l-n*r*d+n*o*c+s*r*l-s*a*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8],u=d*a-o*l,h=o*c-d*r,f=l*r-a*c,g=e*u+n*h+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return t[0]=u*x,t[1]=(s*l-d*n)*x,t[2]=(o*n-s*a)*x,t[3]=h*x,t[4]=(d*e-s*c)*x,t[5]=(s*r-o*e)*x,t[6]=f*x,t[7]=(n*c-l*e)*x,t[8]=(a*e-n*r)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return is("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ga.makeScale(t,e)),this}rotate(t){return is("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ga.makeRotation(-t)),this}translate(t,e){return is("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ga.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ga=new qt,Ul=new qt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Fl=new qt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ud(){const i={enabled:!0,workingColorSpace:Zr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ge&&(s.r=ti(s.r),s.g=ti(s.g),s.b=ti(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ge&&(s.r=rs(s.r),s.g=rs(s.g),s.b=rs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ui?$r:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Zr]:{primaries:t,whitePoint:n,transfer:$r,toXYZ:Ul,fromXYZ:Fl,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:fn},outputColorSpaceConfig:{drawingBufferColorSpace:fn}},[fn]:{primaries:t,whitePoint:n,transfer:ge,toXYZ:Ul,fromXYZ:Fl,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:fn}}}),i}const ie=ud();function ti(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function rs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Oi;class dd{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Oi===void 0&&(Oi=Vs("canvas")),Oi.width=t.width,Oi.height=t.height;const s=Oi.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Oi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Vs("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ti(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ti(e[n]/255)*255):e[n]=ti(e[n]);return{data:e,width:t.width,height:t.height}}else return Nt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let fd=0;class jo{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:fd++}),this.uuid=Hn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width||0,e.height||0,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(_a(s[a].image)):r.push(_a(s[a]))}else r=_a(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function _a(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?dd.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Nt("Texture: Unable to serialize Texture."),{})}let pd=0;const va=new I;class qe extends xi{constructor(t=qe.DEFAULT_IMAGE,e=qe.DEFAULT_MAPPING,n=$n,s=$n,r=sn,a=di,o=bn,c=hn,l=qe.DEFAULT_ANISOTROPY,d=ui){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:pd++}),this.uuid=Hn(),this.name="",this.source=new jo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new wt(0,0),this.repeat=new wt(1,1),this.center=new wt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qt,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(va).x}get height(){return this.source.getSize(va).y}get depth(){return this.source.getSize(va).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.mipmapsAutoUpdate=t.mipmapsAutoUpdate,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isPMREMTexture=t.isPMREMTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){Nt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Nt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==dh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case no:t.x=t.x-Math.floor(t.x);break;case $n:t.x=t.x<0?0:1;break;case io:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case no:t.y=t.y-Math.floor(t.y);break;case $n:t.y=t.y<0?0:1;break;case io:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}qe.DEFAULT_IMAGE=null;qe.DEFAULT_MAPPING=dh;qe.DEFAULT_ANISOTROPY=1;class Me{static{this.prototype.isVector4=!0}constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],d=c[4],u=c[8],h=c[1],f=c[5],g=c[9],x=c[2],m=c[6],p=c[10];if(Math.abs(d-h)<.01&&Math.abs(u-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+x)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const E=(l+1)/2,b=(f+1)/2,T=(p+1)/2,A=(d+h)/4,_=(u+x)/4,y=(g+m)/4;return E>b&&E>T?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=A/n,r=_/n):b>T?b<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),n=A/s,r=y/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=_/r,s=y/r),this.set(n,s,r,e),this}let v=Math.sqrt((m-g)*(m-g)+(u-x)*(u-x)+(h-d)*(h-d));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(u-x)/v,this.z=(h-d)/v,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Yt(this.x,t.x,e.x),this.y=Yt(this.y,t.y,e.y),this.z=Yt(this.z,t.z,e.z),this.w=Yt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Yt(this.x,t,e),this.y=Yt(this.y,t,e),this.z=Yt(this.z,t,e),this.w=Yt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Yt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class md extends xi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:sn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Me(0,0,t,e),this.scissorTest=!1,this.viewport=new Me(0,0,t,e),this.textures=[];const s=n.count;for(let r=0;r<s;r++)this.textures[r]=new qe({width:t,height:e,depth:n.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:sn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.mipmapsAutoUpdate!==void 0&&(e.mipmapsAutoUpdate=t.mipmapsAutoUpdate),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new jo(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){const e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;else this.depthTexture=null;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class On extends md{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Th extends qe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=ke,this.minFilter=ke,this.wrapR=$n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class gd extends qe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=ke,this.minFilter=ke,this.wrapR=$n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}}class Qt{static{this.prototype.isMatrix4=!0}constructor(t,e,n,s,r,a,o,c,l,d,u,h,f,g,x,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l,d,u,h,f,g,x,m)}set(t,e,n,s,r,a,o,c,l,d,u,h,f,g,x,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=d,p[10]=u,p[14]=h,p[3]=f,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Qt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,n=t.elements,s=1/Bi.setFromMatrixColumn(t,0).length(),r=1/Bi.setFromMatrixColumn(t,1).length(),a=1/Bi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),d=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const h=a*d,f=a*u,g=o*d,x=o*u;e[0]=c*d,e[4]=-c*u,e[8]=l,e[1]=f+g*l,e[5]=h-x*l,e[9]=-o*c,e[2]=x-h*l,e[6]=g+f*l,e[10]=a*c}else if(t.order==="YXZ"){const h=c*d,f=c*u,g=l*d,x=l*u;e[0]=h+x*o,e[4]=g*o-f,e[8]=a*l,e[1]=a*u,e[5]=a*d,e[9]=-o,e[2]=f*o-g,e[6]=x+h*o,e[10]=a*c}else if(t.order==="ZXY"){const h=c*d,f=c*u,g=l*d,x=l*u;e[0]=h-x*o,e[4]=-a*u,e[8]=g+f*o,e[1]=f+g*o,e[5]=a*d,e[9]=x-h*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const h=a*d,f=a*u,g=o*d,x=o*u;e[0]=c*d,e[4]=g*l-f,e[8]=h*l+x,e[1]=c*u,e[5]=x*l+h,e[9]=f*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const h=a*c,f=a*l,g=o*c,x=o*l;e[0]=c*d,e[4]=x-h*u,e[8]=g*u+f,e[1]=u,e[5]=a*d,e[9]=-o*d,e[2]=-l*d,e[6]=f*u+g,e[10]=h-x*u}else if(t.order==="XZY"){const h=a*c,f=a*l,g=o*c,x=o*l;e[0]=c*d,e[4]=-u,e[8]=l*d,e[1]=h*u+x,e[5]=a*d,e[9]=f*u-g,e[2]=g*u-f,e[6]=o*d,e[10]=x*u+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(_d,t,vd)}lookAt(t,e,n){const s=this.elements;return an.subVectors(t,e),an.lengthSq()===0&&(an.z=1),an.normalize(),ri.crossVectors(n,an),ri.lengthSq()===0&&(Math.abs(n.z)===1?an.x+=1e-4:an.z+=1e-4,an.normalize(),ri.crossVectors(n,an)),ri.normalize(),rr.crossVectors(an,ri),s[0]=ri.x,s[4]=rr.x,s[8]=an.x,s[1]=ri.y,s[5]=rr.y,s[9]=an.y,s[2]=ri.z,s[6]=rr.z,s[10]=an.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],d=n[1],u=n[5],h=n[9],f=n[13],g=n[2],x=n[6],m=n[10],p=n[14],v=n[3],E=n[7],b=n[11],T=n[15],A=s[0],_=s[4],y=s[8],L=s[12],R=s[1],N=s[5],U=s[9],W=s[13],P=s[2],k=s[6],G=s[10],V=s[14],st=s[3],q=s[7],j=s[11],nt=s[15];return r[0]=a*A+o*R+c*P+l*st,r[4]=a*_+o*N+c*k+l*q,r[8]=a*y+o*U+c*G+l*j,r[12]=a*L+o*W+c*V+l*nt,r[1]=d*A+u*R+h*P+f*st,r[5]=d*_+u*N+h*k+f*q,r[9]=d*y+u*U+h*G+f*j,r[13]=d*L+u*W+h*V+f*nt,r[2]=g*A+x*R+m*P+p*st,r[6]=g*_+x*N+m*k+p*q,r[10]=g*y+x*U+m*G+p*j,r[14]=g*L+x*W+m*V+p*nt,r[3]=v*A+E*R+b*P+T*st,r[7]=v*_+E*N+b*k+T*q,r[11]=v*y+E*U+b*G+T*j,r[15]=v*L+E*W+b*V+T*nt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],d=t[2],u=t[6],h=t[10],f=t[14],g=t[3],x=t[7],m=t[11],p=t[15],v=c*f-l*h,E=o*f-l*u,b=o*h-c*u,T=a*f-l*d,A=a*h-c*d,_=a*u-o*d;return e*(x*v-m*E+p*b)-n*(g*v-m*T+p*A)+s*(g*E-x*T+p*_)-r*(g*b-x*A+m*_)}determinantAffine(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],a=t[5],o=t[9],c=t[2],l=t[6],d=t[10];return e*(a*d-o*l)-n*(r*d-o*c)+s*(r*l-a*c)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8],u=t[9],h=t[10],f=t[11],g=t[12],x=t[13],m=t[14],p=t[15],v=e*o-n*a,E=e*c-s*a,b=e*l-r*a,T=n*c-s*o,A=n*l-r*o,_=s*l-r*c,y=d*x-u*g,L=d*m-h*g,R=d*p-f*g,N=u*m-h*x,U=u*p-f*x,W=h*p-f*m,P=v*W-E*U+b*N+T*R-A*L+_*y;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const k=1/P;return t[0]=(o*W-c*U+l*N)*k,t[1]=(s*U-n*W-r*N)*k,t[2]=(x*_-m*A+p*T)*k,t[3]=(h*A-u*_-f*T)*k,t[4]=(c*R-a*W-l*L)*k,t[5]=(e*W-s*R+r*L)*k,t[6]=(m*b-g*_-p*E)*k,t[7]=(d*_-h*b+f*E)*k,t[8]=(a*U-o*R+l*y)*k,t[9]=(n*R-e*U-r*y)*k,t[10]=(g*A-x*b+p*v)*k,t[11]=(u*b-d*A-f*v)*k,t[12]=(o*L-a*N-c*y)*k,t[13]=(e*N-n*L+s*y)*k,t[14]=(x*E-g*T-m*v)*k,t[15]=(d*T-u*E+h*v)*k,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,l=r*a,d=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+n,d*c-s*a,0,l*c-s*o,d*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,d=a+a,u=o+o,h=r*l,f=r*d,g=r*u,x=a*d,m=a*u,p=o*u,v=c*l,E=c*d,b=c*u,T=n.x,A=n.y,_=n.z;return s[0]=(1-(x+p))*T,s[1]=(f+b)*T,s[2]=(g-E)*T,s[3]=0,s[4]=(f-b)*A,s[5]=(1-(h+p))*A,s[6]=(m+v)*A,s[7]=0,s[8]=(g+E)*_,s[9]=(m-v)*_,s[10]=(1-(h+x))*_,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=Bi.set(s[0],s[1],s[2]).length();const o=Bi.set(s[4],s[5],s[6]).length(),c=Bi.set(s[8],s[9],s[10]).length();r<0&&(a=-a),xn.copy(this);const l=1/a,d=1/o,u=1/c;return xn.elements[0]*=l,xn.elements[1]*=l,xn.elements[2]*=l,xn.elements[4]*=d,xn.elements[5]*=d,xn.elements[6]*=d,xn.elements[8]*=u,xn.elements[9]*=u,xn.elements[10]*=u,e.setFromRotationMatrix(xn),n.x=a,n.y=o,n.z=c,this}makePerspective(t,e,n,s,r,a,o=En,c=!1){const l=this.elements,d=2*r/(e-t),u=2*r/(n-s),h=(e+t)/(e-t),f=(n+s)/(n-s);let g,x;if(c)g=r/(a-r),x=a*r/(a-r);else if(o===En)g=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===Hs)g=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=En,c=!1){const l=this.elements,d=2/(e-t),u=2/(n-s),h=-(e+t)/(e-t),f=-(n+s)/(n-s);let g,x;if(c)g=1/(a-r),x=a/(a-r);else if(o===En)g=-2/(a-r),x=-(a+r)/(a-r);else if(o===Hs)g=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=0,l[12]=h,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Bi=new I,xn=new Qt,_d=new I(0,0,0),vd=new I(1,1,1),ri=new I,rr=new I,an=new I,Ol=new Qt,Bl=new ni;class _i{constructor(t=0,e=0,n=0,s=_i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],d=s[9],u=s[2],h=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Yt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Yt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Yt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Yt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Yt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Yt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,f),this._y=0);break;default:Nt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ol.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ol,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Bl.setFromEuler(this),this.setFromQuaternion(Bl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_i.DEFAULT_ORDER="XYZ";class tl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let xd=0;const kl=new I,ki=new ni,Wn=new Qt,ar=new I,xs=new I,Sd=new I,Md=new ni,zl=new I(1,0,0),Hl=new I(0,1,0),Vl=new I(0,0,1),Gl={type:"added"},yd={type:"removed"},zi={type:"childadded",child:null},xa={type:"childremoved",child:null};class Te extends xi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:xd++}),this.uuid=Hn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Te.DEFAULT_UP.clone();const t=new I,e=new _i,n=new ni,s=new I(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Qt},normalMatrix:{value:new qt}}),this.matrix=new Qt,this.matrixWorld=new Qt,this.matrixAutoUpdate=Te.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Te.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new tl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ki.setFromAxisAngle(t,e),this.quaternion.multiply(ki),this}rotateOnWorldAxis(t,e){return ki.setFromAxisAngle(t,e),this.quaternion.premultiply(ki),this}rotateX(t){return this.rotateOnAxis(zl,t)}rotateY(t){return this.rotateOnAxis(Hl,t)}rotateZ(t){return this.rotateOnAxis(Vl,t)}translateOnAxis(t,e){return kl.copy(t).applyQuaternion(this.quaternion),this.position.add(kl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(zl,t)}translateY(t){return this.translateOnAxis(Hl,t)}translateZ(t){return this.translateOnAxis(Vl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Wn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ar.copy(t):ar.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),xs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Wn.lookAt(xs,ar,this.up):Wn.lookAt(ar,xs,this.up),this.quaternion.setFromRotationMatrix(Wn),s&&(Wn.extractRotation(s.matrixWorld),ki.setFromRotationMatrix(Wn),this.quaternion.premultiply(ki.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Gt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Gl),zi.child=t,this.dispatchEvent(zi),zi.child=null):Gt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(yd),xa.child=t,this.dispatchEvent(xa),xa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Wn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Wn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Wn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Gl),zi.child=t,this.dispatchEvent(zi),zi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xs,t,Sd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xs,Md,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){const s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),d=a(t.images),u=a(t.shapes),h=a(t.skeletons),f=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const c=[];for(const l in o){const d=o[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Te.DEFAULT_UP=new I(0,1,0);Te.DEFAULT_MATRIX_AUTO_UPDATE=!0;Te.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class yn extends Te{constructor(){super(),this.isGroup=!0,this.type="Group"}}const bd={type:"move"};class Sa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new yn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new yn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new yn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const x of t.hand.values()){const m=e.getJointPose(x,n),p=this._getHandJoint(l,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.quaternion,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const d=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],h=d.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&h>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.quaternion,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(bd)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new yn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Ah={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ai={h:0,s:0,l:0},or={h:0,s:0,l:0};function Ma(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Kt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=fn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ie.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=ie.workingColorSpace){return this.r=t,this.g=e,this.b=n,ie.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=ie.workingColorSpace){if(t=$o(t,1),e=Yt(e,0,1),n=Yt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Ma(a,r,t+1/3),this.g=Ma(a,r,t),this.b=Ma(a,r,t-1/3)}return ie.colorSpaceToWorking(this,s),this}setStyle(t,e=fn){function n(r){r!==void 0&&parseFloat(r)<1&&Nt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,e);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Nt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Nt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=fn){const n=Ah[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Nt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ti(t.r),this.g=ti(t.g),this.b=ti(t.b),this}copyLinearToSRGB(t){return this.r=rs(t.r),this.g=rs(t.g),this.b=rs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=fn){return ie.workingToColorSpace(We.copy(this),t),Math.round(Yt(We.r*255,0,255))*65536+Math.round(Yt(We.g*255,0,255))*256+Math.round(Yt(We.b*255,0,255))}getHexString(t=fn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ie.workingColorSpace){ie.workingToColorSpace(We.copy(this),e);const n=We.r,s=We.g,r=We.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const d=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=d<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=ie.workingColorSpace){return ie.workingToColorSpace(We.copy(this),e),t.r=We.r,t.g=We.g,t.b=We.b,t}getStyle(t=fn){ie.workingToColorSpace(We.copy(this),t);const e=We.r,n=We.g,s=We.b;return t!==fn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(ai),this.setHSL(ai.h+t,ai.s+e,ai.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ai),t.getHSL(or);const n=Is(ai.h,or.h,e),s=Is(ai.s,or.s,e),r=Is(ai.l,or.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const We=new Kt;Kt.NAMES=Ah;class Ed extends Te{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _i,this.environmentIntensity=1,this.environmentRotation=new _i,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),this.background=t.background!==null?t.background.clone():null,this.environment=t.environment!==null?t.environment.clone():null,this.fog=t.fog!==null?t.fog.clone():null,this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),this.overrideMaterial=t.overrideMaterial!==null?t.overrideMaterial.clone():null,this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}}const Sn=new I,Xn=new I,ya=new I,qn=new I,Hi=new I,Vi=new I,Wl=new I,ba=new I,Ea=new I,Ta=new I,Aa=new Me,wa=new Me,Ra=new Me;class mn{constructor(t=new I,e=new I,n=new I){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Sn.subVectors(t,e),s.cross(Sn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Sn.subVectors(s,e),Xn.subVectors(n,e),ya.subVectors(t,e);const a=Sn.dot(Sn),o=Sn.dot(Xn),c=Sn.dot(ya),l=Xn.dot(Xn),d=Xn.dot(ya),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const h=1/u,f=(l*c-o*d)*h,g=(a*d-o*c)*h;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,qn)===null?!1:qn.x>=0&&qn.y>=0&&qn.x+qn.y<=1}static getInterpolation(t,e,n,s,r,a,o,c){return this.getBarycoord(t,e,n,s,qn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,qn.x),c.addScaledVector(a,qn.y),c.addScaledVector(o,qn.z),c)}static getInterpolatedAttribute(t,e,n,s,r,a){return Aa.setScalar(0),wa.setScalar(0),Ra.setScalar(0),Aa.fromBufferAttribute(t,e),wa.fromBufferAttribute(t,n),Ra.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(Aa,r.x),a.addScaledVector(wa,r.y),a.addScaledVector(Ra,r.z),a}static isFrontFacing(t,e,n,s){return Sn.subVectors(n,e),Xn.subVectors(t,e),Sn.cross(Xn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Sn.subVectors(this.c,this.b),Xn.subVectors(this.a,this.b),Sn.cross(Xn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return mn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return mn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return mn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return mn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return mn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Hi.subVectors(s,n),Vi.subVectors(r,n),ba.subVectors(t,n);const c=Hi.dot(ba),l=Vi.dot(ba);if(c<=0&&l<=0)return e.copy(n);Ea.subVectors(t,s);const d=Hi.dot(Ea),u=Vi.dot(Ea);if(d>=0&&u<=d)return e.copy(s);const h=c*u-d*l;if(h<=0&&c>=0&&d<=0&&c-d>0)return a=c/(c-d),e.copy(n).addScaledVector(Hi,a);Ta.subVectors(t,r);const f=Hi.dot(Ta),g=Vi.dot(Ta);if(g>=0&&f<=g)return e.copy(r);const x=f*l-c*g;if(x<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(Vi,o);const m=d*g-f*u;if(m<=0&&u-d>=0&&f-g>=0)return Wl.subVectors(r,s),o=(u-d)/(u-d+(f-g)),e.copy(s).addScaledVector(Wl,o);const p=1/(m+x+h);return a=x*p,o=h*p,e.copy(n).addScaledVector(Hi,a).addScaledVector(Vi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class Tn{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Mn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Mn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Mn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0&&t.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Mn):Mn.fromBufferAttribute(r,a),Mn.applyMatrix4(t.matrixWorld),this.expandByPoint(Mn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),lr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),lr.copy(n.boundingBox)),lr.applyMatrix4(t.matrixWorld),this.union(lr)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Mn),Mn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ss),cr.subVectors(this.max,Ss),Gi.subVectors(t.a,Ss),Wi.subVectors(t.b,Ss),Xi.subVectors(t.c,Ss),oi.subVectors(Wi,Gi),li.subVectors(Xi,Wi),Ei.subVectors(Gi,Xi);let e=[0,-oi.z,oi.y,0,-li.z,li.y,0,-Ei.z,Ei.y,oi.z,0,-oi.x,li.z,0,-li.x,Ei.z,0,-Ei.x,-oi.y,oi.x,0,-li.y,li.x,0,-Ei.y,Ei.x,0];return!Ca(e,Gi,Wi,Xi,cr)||(e=[1,0,0,0,1,0,0,0,1],!Ca(e,Gi,Wi,Xi,cr))?!1:(hr.crossVectors(oi,li),e=[hr.x,hr.y,hr.z],Ca(e,Gi,Wi,Xi,cr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Mn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Mn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Yn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Yn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Yn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Yn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Yn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Yn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Yn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Yn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Yn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Yn=[new I,new I,new I,new I,new I,new I,new I,new I],Mn=new I,lr=new Tn,Gi=new I,Wi=new I,Xi=new I,oi=new I,li=new I,Ei=new I,Ss=new I,cr=new I,hr=new I,Ti=new I;function Ca(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Ti.fromArray(i,r);const o=s.x*Math.abs(Ti.x)+s.y*Math.abs(Ti.y)+s.z*Math.abs(Ti.z),c=t.dot(Ti),l=e.dot(Ti),d=n.dot(Ti);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}const Re=new I,ur=new wt;let Td=0;class ei extends xi{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Td++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=yh,this.updateRanges=[],this.gpuType=gn,this.version=0,this._normalizationScale=t!==void 0?ia(t):void 0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this._normalizationScale=t._normalizationScale,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ur.fromBufferAttribute(this,e),ur.applyMatrix3(t),this.setXY(e,ur.x,ur.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyMatrix3(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyMatrix4(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyNormalMatrix(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.transformDirection(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=this._denormalize(n)),n}setComponent(t,e,n){return this.normalized&&(n=this._normalize(n)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=this._denormalize(e)),e}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=this._denormalize(e)),e}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=this._denormalize(e)),e}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=this._denormalize(e)),e}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),s=this._normalize(s)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(t){const e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):Jo(t,this.array)}_normalize(t){const e=this._normalizationScale;return e!==void 0?Math.round(t*e):Qo(t,this.array)}}class wh extends ei{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Rh extends ei{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Pe extends ei{constructor(t,e,n){super(new Float32Array(t),e,n)}}const Ad=new Tn,Ms=new I,Pa=new I;class ii{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Ad.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ms.subVectors(t,this.center);const e=Ms.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Ms,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Pa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ms.copy(t.center).add(Pa)),this.expandByPoint(Ms.copy(t.center).sub(Pa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let wd=0;const dn=new Qt,La=new Te,qi=new I,on=new Tn,ys=new Tn,Ie=new I;class tn extends xi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:wd++}),this.uuid=Hn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Xu(t)?Rh:wh)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new qt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return dn.makeRotationFromQuaternion(t),this.applyMatrix4(dn),this}rotateX(t){return dn.makeRotationX(t),this.applyMatrix4(dn),this}rotateY(t){return dn.makeRotationY(t),this.applyMatrix4(dn),this}rotateZ(t){return dn.makeRotationZ(t),this.applyMatrix4(dn),this}translate(t,e,n){return dn.makeTranslation(t,e,n),this.applyMatrix4(dn),this}scale(t,e,n){return dn.makeScale(t,e,n),this.applyMatrix4(dn),this}lookAt(t){return La.lookAt(t),La.updateMatrix(),this.applyMatrix4(La.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(qi).negate(),this.translate(qi.x,qi.y,qi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Pe(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Nt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Tn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Gt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];on.setFromBufferAttribute(r),this.morphTargetsRelative?(Ie.addVectors(this.boundingBox.min,on.min),this.boundingBox.expandByPoint(Ie),Ie.addVectors(this.boundingBox.max,on.max),this.boundingBox.expandByPoint(Ie)):(this.boundingBox.expandByPoint(on.min),this.boundingBox.expandByPoint(on.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Gt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ii);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Gt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){const n=this.boundingSphere.center;if(on.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];ys.setFromBufferAttribute(o),this.morphTargetsRelative?(Ie.addVectors(on.min,ys.min),on.expandByPoint(Ie),Ie.addVectors(on.max,ys.max),on.expandByPoint(Ie)):(on.expandByPoint(ys.min),on.expandByPoint(ys.max))}on.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Ie.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ie));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)Ie.fromBufferAttribute(o,l),c&&(qi.fromBufferAttribute(t,l),Ie.add(qi)),s=Math.max(s,n.distanceToSquared(Ie))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Gt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Gt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new ei(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],c=[],l=new Uint8Array(n.count);for(let L=0;L<n.count;L++)o[L]=new I,c[L]=new I;const d=new I,u=new I,h=new I,f=new wt,g=new wt,x=new wt,m=new I,p=new I;function v(L,R,N){l[L]=l[R]=l[N]=1,d.fromBufferAttribute(n,L),u.fromBufferAttribute(n,R),h.fromBufferAttribute(n,N),f.fromBufferAttribute(r,L),g.fromBufferAttribute(r,R),x.fromBufferAttribute(r,N),u.sub(d),h.sub(d),g.sub(f),x.sub(f);const U=1/(g.x*x.y-x.x*g.y);isFinite(U)&&(m.copy(u).multiplyScalar(x.y).addScaledVector(h,-g.y).multiplyScalar(U),p.copy(h).multiplyScalar(g.x).addScaledVector(u,-x.x).multiplyScalar(U),o[L].add(m),o[R].add(m),o[N].add(m),c[L].add(p),c[R].add(p),c[N].add(p))}let E=this.groups;E.length===0&&(E=[{start:0,count:t.count}]);for(let L=0,R=E.length;L<R;++L){const N=E[L],U=N.start,W=N.count;for(let P=U,k=U+W;P<k;P+=3)v(t.getX(P+0),t.getX(P+1),t.getX(P+2))}const b=new I,T=new I,A=new I,_=new I;function y(L){A.fromBufferAttribute(s,L),_.copy(A);const R=o[L];b.copy(R),b.sub(A.multiplyScalar(A.dot(R))).normalize(),T.crossVectors(_,R);const U=T.dot(c[L])<0?-1:1;a.setXYZW(L,b.x,b.y,b.z,U)}for(let L=0,R=n.count;L<R;++L)l[L]&&y(L);this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new ei(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);const s=new I,r=new I,a=new I,o=new I,c=new I,l=new I,d=new I,u=new I;if(t)for(let h=0,f=t.count;h<f;h+=3){const g=t.getX(h+0),x=t.getX(h+1),m=t.getX(h+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,x),a.fromBufferAttribute(e,m),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,m),o.add(d),c.add(d),l.add(d),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let h=0,f=e.count;h<f;h+=3)s.fromBufferAttribute(e,h+0),r.fromBufferAttribute(e,h+1),a.fromBufferAttribute(e,h+2),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),n.setXYZ(h+0,d.x,d.y,d.z),n.setXYZ(h+1,d.x,d.y,d.z),n.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ie.fromBufferAttribute(t,e),Ie.normalize(),t.setXYZ(e,Ie.x,Ie.y,Ie.z)}toNonIndexed(){function t(o,c){const l=o.array,d=o.itemSize,u=o.normalized,h=new l.constructor(c.length*d);let f=0,g=0;for(let x=0,m=c.length;x<m;x++){o.isInterleavedBufferAttribute?f=c[x]*o.data.stride+o.offset:f=c[x]*d;for(let p=0;p<d;p++)h[g++]=l[f++]}return new ei(h,d,u)}if(this.index===null)return Nt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new tn,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,n);e.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let d=0,u=l.length;d<u;d++){const h=l[d],f=t(h,n);c.push(f)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let u=0,h=l.length;u<h;u++){const f=l[u];d.push(f.toJSON(t.data))}d.length>0&&(s[c]=d,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const l in s){const d=s[l];this.setAttribute(l,d.clone(e))}const r=t.morphAttributes;for(const l in r){const d=[],u=r[l];for(let h=0,f=u.length;h<f;h++)d.push(u[h].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,d=a.length;l<d;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Bv{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=yh,this.updateRanges=[],this.version=0,this.uuid=Hn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={});const e=Xl(this.array);t.arrayBuffers[e]===void 0&&(t.arrayBuffers[e]=this.array.slice(0).buffer);const n=new this.array.constructor(t.arrayBuffers[e]),s=new this.constructor(n,this.stride);return s.setUsage(this.usage),s}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={});const e=Xl(this.array);t.arrayBuffers[e]===void 0&&(t.arrayBuffers[e]=Array.from(new Uint32Array(this.array.slice(0).buffer)));const n={uuid:this.uuid,buffer:e,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}}function Xl(i){return i.buffer._uuid===void 0&&(i.buffer._uuid=Hn()),i.byteOffset===0&&i.byteLength===i.buffer.byteLength?i.buffer._uuid:i.buffer._uuid+":"+i.byteOffset+":"+i.byteLength}const Ke=new I;class Ch{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s,this._normalizationScale=t!==void 0?ia(t.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.applyMatrix4(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.applyNormalMatrix(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.transformDirection(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=this._denormalize(n)),n}setComponent(t,e,n){return this.normalized&&(n=this._normalize(n)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=this._denormalize(e)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=this._denormalize(e)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=this._denormalize(e)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=this._denormalize(e)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=this._normalize(e),n=this._normalize(n)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=this._normalize(e),n=this._normalize(n),s=this._normalize(s)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=this._normalize(e),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){Jr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new ei(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Ch(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){Jr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(t){const e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):Jo(t,this.data.array)}_normalize(t){const e=this._normalizationScale;return e!==void 0?Math.round(t*e):Qo(t,this.data.array)}}const Da=new I,Rd=new I,Cd=new qt;class Nn{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Da.subVectors(n,e).cross(Rd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){const s=t.delta(Da),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(s,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Cd.getNormalMatrix(t),s=this.coplanarPoint(Da).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}}let Pd=0;class Di extends xi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Pd++}),this.uuid=Hn(),this.name="",this.type="Material",this.blending=Ns,this.side=Ci,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ih,this.blendDst=sh,this.blendEquation=Qi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Kt(0,0,0),this.blendAlpha=0,this.depthFunc=Bs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ku,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=pa,this.stencilZFail=pa,this.stencilZPass=pa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){Nt(`Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Nt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(t).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Kt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.diffuseRoughness!==void 0&&(this.diffuseRoughness=t.diffuseRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum),t.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=t.iridescenceThicknessRange[1]),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new Nn().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new wt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new wt().fromArray(t.clearcoatNormalScale)),t.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=e[t.diffuseRoughnessMap]||null),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}const Kn=new I,Na=new I,dr=new I,fr=new I;class us{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Kn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Kn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Kn.copy(this.origin).addScaledVector(this.direction,e),Kn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Na.copy(t).add(e).multiplyScalar(.5),dr.copy(e).sub(t).normalize(),fr.copy(this.origin).sub(Na);const r=t.distanceTo(e)*.5,a=-this.direction.dot(dr),o=fr.dot(this.direction),c=-fr.dot(dr),l=fr.lengthSq(),d=Math.abs(1-a*a);let u,h,f,g;if(d>0)if(u=a*c-o,h=a*o-c,g=r*d,u>=0)if(h>=-g)if(h<=g){const x=1/d;u*=x,h*=x,f=u*(u+a*h+2*o)+h*(a*u+h+2*c)+l}else h=r,u=Math.max(0,-(a*h+o)),f=-u*u+h*(h+2*c)+l;else h=-r,u=Math.max(0,-(a*h+o)),f=-u*u+h*(h+2*c)+l;else h<=-g?(u=Math.max(0,-(-a*r+o)),h=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+h*(h+2*c)+l):h<=g?(u=0,h=Math.min(Math.max(-r,-c),r),f=h*(h+2*c)+l):(u=Math.max(0,-(a*r+o)),h=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+h*(h+2*c)+l);else h=a>0?-r:r,u=Math.max(0,-(a*h+o)),f=-u*u+h*(h+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Na).addScaledVector(dr,h),f}intersectSphere(t,e){if(t.radius<0)return null;Kn.subVectors(t.center,this.origin);const n=Kn.dot(this.direction),s=Kn.dot(Kn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,c;const l=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return l>=0?(n=(t.min.x-h.x)*l,s=(t.max.x-h.x)*l):(n=(t.max.x-h.x)*l,s=(t.min.x-h.x)*l),d>=0?(r=(t.min.y-h.y)*d,a=(t.max.y-h.y)*d):(r=(t.max.y-h.y)*d,a=(t.min.y-h.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-h.z)*u,c=(t.max.z-h.z)*u):(o=(t.max.z-h.z)*u,c=(t.min.z-h.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Kn)!==null}intersectTriangle(t,e,n,s,r){const a=this.origin,o=this.direction,c=o.x,l=o.y,d=o.z,u=t.x-a.x,h=t.y-a.y,f=t.z-a.z,g=e.x-a.x,x=e.y-a.y,m=e.z-a.z,p=n.x-a.x,v=n.y-a.y,E=n.z-a.z,b=Math.abs(c),T=Math.abs(l),A=Math.abs(d);let _,y,L,R,N,U,W,P,k,G,V,st;if(b>=T&&b>=A?(L=c,U=u,k=g,st=p,c>=0?(_=l,y=d,R=h,N=f,W=x,P=m,G=v,V=E):(_=d,y=l,R=f,N=h,W=m,P=x,G=E,V=v)):T>=A?(L=l,U=h,k=x,st=v,l>=0?(_=d,y=c,R=f,N=u,W=m,P=g,G=E,V=p):(_=c,y=d,R=u,N=f,W=g,P=m,G=p,V=E)):(L=d,U=f,k=m,st=E,d>=0?(_=c,y=l,R=u,N=h,W=g,P=x,G=p,V=v):(_=l,y=c,R=h,N=u,W=x,P=g,G=v,V=p)),L===0)return null;const q=_/L,j=y/L,nt=1/L,Rt=R-q*U,Vt=N-j*U,$=W-q*k,Mt=P-j*k,At=G-q*st,Ut=V-j*st,yt=At*Mt-Ut*$,et=Rt*Ut-Vt*At,de=$*Vt-Mt*Rt;if(s){if(yt<0||et<0||de<0)return null}else if((yt<0||et<0||de<0)&&(yt>0||et>0||de>0))return null;const It=yt+et+de;if(It===0)return null;const le=nt*(yt*U+et*k+de*st);return(It>0?le<0:le>0)?null:this.at(le/It,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ld extends Di{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Kt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _i,this.combine=rh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ql=new Qt,Ai=new us,pr=new ii,Yl=new I,mr=new I,gr=new I,_r=new I,Ia=new I,vr=new I,Kl=new I,xr=new I;class un extends Te{constructor(t=new tn,e=new Ld){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){vr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const d=o[c],u=r[c];d!==0&&(Ia.fromBufferAttribute(u,t),a?vr.addScaledVector(Ia,d):vr.addScaledVector(Ia.sub(e),d))}e.add(vr)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),pr.copy(n.boundingSphere),pr.applyMatrix4(r),Ai.copy(t.ray).recast(t.near),!(pr.containsPoint(Ai.origin)===!1&&(Ai.intersectSphere(pr,Yl)===null||Ai.origin.distanceToSquared(Yl)>(t.far-t.near)**2))&&(ql.copy(r).invert(),Ai.copy(t.ray).applyMatrix4(ql),!(n.boundingBox!==null&&Ai.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ai)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,d=r.attributes.uv1,u=r.attributes.normal,h=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,x=h.length;g<x;g++){const m=h[g],p=a[m.materialIndex],v=Math.max(m.start,f.start),E=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let b=v,T=E;b<T;b+=3){const A=o.getX(b),_=o.getX(b+1),y=o.getX(b+2);s=Sr(this,p,t,n,l,d,u,A,_,y),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){const v=o.getX(m),E=o.getX(m+1),b=o.getX(m+2);s=Sr(this,a,t,n,l,d,u,v,E,b),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,x=h.length;g<x;g++){const m=h[g],p=a[m.materialIndex],v=Math.max(m.start,f.start),E=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let b=v,T=E;b<T;b+=3){const A=b,_=b+1,y=b+2;s=Sr(this,p,t,n,l,d,u,A,_,y),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),x=Math.min(c.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){const v=m,E=m+1,b=m+2;s=Sr(this,a,t,n,l,d,u,v,E,b),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Dd(i,t,e,n,s,r,a,o){let c;if(t.side===rn?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,t.side===Ci,o),c===null)return null;xr.copy(o),xr.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(xr);return l<e.near||l>e.far?null:{distance:l,point:xr.clone(),object:i}}function Sr(i,t,e,n,s,r,a,o,c,l){i.getVertexPosition(o,mr),i.getVertexPosition(c,gr),i.getVertexPosition(l,_r);const d=Dd(i,t,e,n,mr,gr,_r,Kl);if(d){const u=new I;mn.getBarycoord(Kl,mr,gr,_r,u),s&&(d.uv=mn.getInterpolatedAttribute(s,o,c,l,u,new wt)),r&&(d.uv1=mn.getInterpolatedAttribute(r,o,c,l,u,new wt)),a&&(d.normal=mn.getInterpolatedAttribute(a,o,c,l,u,new I),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const h={a:o,b:c,c:l,normal:new I,materialIndex:0};mn.getNormal(mr,gr,_r,h.normal),d.face=h,d.barycoord=u}return d}const bs=new Me,Zl=new Me,$l=new Me,Nd=new Me,Jl=new Qt,Mr=new I,Ua=new ii,Ql=new Qt,Fa=new us;class kv extends un{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Al,this.bindMatrix=new Qt,this.bindMatrixInverse=new Qt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Tn),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Mr),this.boundingBox.expandByPoint(Mr)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ii),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Mr),this.boundingSphere.expandByPoint(Mr)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this}raycast(t,e){const n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ua.copy(this.boundingSphere),Ua.applyMatrix4(s),t.ray.intersectsSphere(Ua)!==!1&&(Ql.copy(s).invert(),Fa.copy(t.ray).applyMatrix4(Ql),!(this.boundingBox!==null&&Fa.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Fa)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new Me,e=this.geometry.attributes.skinWeight;for(let n=0,s=e.count;n<s;n++){t.fromBufferAttribute(e,n);const r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===Al?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Iu?this.bindMatrixInverse.copy(this.bindMatrix).invert():Nt("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const n=this.skeleton,s=this.geometry;Zl.fromBufferAttribute(s.attributes.skinIndex,t),$l.fromBufferAttribute(s.attributes.skinWeight,t),e.isVector4?(bs.copy(e),e.set(0,0,0,0)):(bs.set(e.x,e.y,e.z,1),e.set(0,0,0)),bs.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const a=$l.getComponent(r);if(a!==0){const o=Zl.getComponent(r);Jl.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),e.addScaledVector(Nd.copy(bs).applyMatrix4(Jl),a)}}return e.isVector4&&(e.w=bs.w),e.applyMatrix4(this.bindMatrixInverse)}}class Id extends Te{constructor(){super(),this.isBone=!0,this.type="Bone"}}class el extends qe{constructor(t=null,e=1,n=1,s,r,a,o,c,l=ke,d=ke,u,h){super(null,a,o,c,l,d,s,r,u,h),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const jl=new Qt,Ud=new Qt;class Ph{constructor(t=[],e=[]){this.uuid=Hn(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.previousBoneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){Nt("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Qt)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const n=new Qt;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const t=this.bones,e=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,a=t.length;r<a;r++){const o=t[r]?t[r].matrixWorld:Ud;jl.multiplyMatrices(o,e[r]),jl.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new Ph(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const n=new el(e,t,t,bn,gn);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){const s=this.bones[e];if(s.name===t)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null),this.previousBoneTexture!==null&&(this.previousBoneTexture.dispose(),this.previousBoneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,s=t.bones.length;n<s;n++){const r=t.bones[n];let a=e[r];a===void 0&&(Nt("Skeleton: No bone found with UUID:",r),a=new Id),this.bones.push(a),this.boneInverses.push(new Qt().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,n=this.boneInverses;for(let s=0,r=e.length;s<r;s++){const a=e[s];t.bones.push(a.uuid);const o=n[s];t.boneInverses.push(o.toArray())}return t}}class tc extends ei{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Yi=new Qt,ec=new Qt,yr=[],nc=new Tn,Fd=new Qt,Es=new un,Ts=new ii;class Od extends un{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new tc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Fd)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Tn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Yi),nc.copy(t.boundingBox).applyMatrix4(Yi),this.boundingBox.union(nc)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ii),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Yi),Ts.copy(t.boundingSphere).applyMatrix4(Yi),this.boundingSphere.union(Ts)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),this.morphTexture=t.morphTexture!==null?t.morphTexture.clone():null,this.instanceColor=t.instanceColor!==null?t.instanceColor.clone():null,this.count=t.count,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Es.geometry=this.geometry,Es.material=this.material,Es.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ts.copy(this.boundingSphere),Ts.applyMatrix4(n),t.ray.intersectsSphere(Ts)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Yi),ec.multiplyMatrices(n,Yi),Es.matrixWorld=ec,Es.raycast(t,yr);for(let a=0,o=yr.length;a<o;a++){const c=yr[a];c.instanceId=r,c.object=this,e.push(c)}yr.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new tc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new el(new Float32Array(s*this.count),s,this.count,qo,gn));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=s*t;return r[c]=o,r.set(n,c+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const wi=new ii,Bd=new wt(.5,.5),br=new I;class Gs{constructor(t=new Nn,e=new Nn,n=new Nn,s=new Nn,r=new Nn,a=new Nn){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=En,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],c=r[2],l=r[3],d=r[4],u=r[5],h=r[6],f=r[7],g=r[8],x=r[9],m=r[10],p=r[11],v=r[12],E=r[13],b=r[14],T=r[15];if(s[0].setComponents(l-a,f-d,p-g,T-v).normalize(),s[1].setComponents(l+a,f+d,p+g,T+v).normalize(),s[2].setComponents(l+o,f+u,p+x,T+E).normalize(),s[3].setComponents(l-o,f-u,p-x,T-E).normalize(),n)s[4].setComponents(c,h,m,b).normalize(),s[5].setComponents(l-c,f-h,p-m,T-b).normalize();else if(s[4].setComponents(l-c,f-h,p-m,T-b).normalize(),e===En)s[5].setComponents(l+c,f+h,p+m,T+b).normalize();else if(e===Hs)s[5].setComponents(c,h,m,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),wi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),wi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(wi)}intersectsSprite(t){wi.center.set(0,0,0);const e=Bd.distanceTo(t.center);return wi.radius=.7071067811865476+e,wi.applyMatrix4(t.matrixWorld),this.intersectsSphere(wi)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(br.x=s.normal.x>0?t.max.x:t.min.x,br.y=s.normal.y>0?t.max.y:t.min.y,br.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(br)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const ic=new Qt;class nl{constructor(){this.coordinateSystem=En,this._frustums=[],this._count=0}setFromArrayCamera(t){const e=t.cameras,n=this._frustums;for(let s=0;s<e.length;s++){const r=e[s];ic.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[s]===void 0&&(n[s]=new Gs),n[s].setFromProjectionMatrix(ic,r.coordinateSystem,r.reversedDepth)}return this._count=e.length,this}getFrustum(t){return this._frustums[t]}intersectsObject(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsObject(t))return!0;return!1}intersectsSprite(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSprite(t))return!0;return!1}intersectsSphere(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSphere(t))return!0;return!1}intersectsBox(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsBox(t))return!0;return!1}containsPoint(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;const e=this._frustums,n=t._frustums;for(let s=0;s<t._count;s++)e[s]===void 0&&(e[s]=new Gs),e[s].copy(n[s]);return this._count=t._count,this}clone(){return new nl().copy(this)}}class Qr extends Di{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Kt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const jr=new I,ta=new I,sc=new Qt,As=new us,Er=new ii,Oa=new I,rc=new I;class sa extends Te{constructor(t=new tn,e=new Qr){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)jr.fromBufferAttribute(e,s-1),ta.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=jr.distanceTo(ta);t.setAttribute("lineDistance",new Pe(n,1))}else Nt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Er.copy(n.boundingSphere),Er.applyMatrix4(s),Er.radius+=r,t.ray.intersectsSphere(Er)===!1)return;sc.copy(s).invert(),As.copy(t.ray).applyMatrix4(sc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,d=n.index,h=n.attributes.position;if(d!==null){const f=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let x=f,m=g-1;x<m;x+=l){const p=d.getX(x),v=d.getX(x+1),E=Tr(this,t,As,c,p,v,x);E&&e.push(E)}if(this.isLineLoop){const x=d.getX(g-1),m=d.getX(f),p=Tr(this,t,As,c,x,m,g-1);p&&e.push(p)}}else{const f=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let x=f,m=g-1;x<m;x+=l){const p=Tr(this,t,As,c,x,x+1,x);p&&e.push(p)}if(this.isLineLoop){const x=Tr(this,t,As,c,g-1,f,g-1);x&&e.push(x)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Tr(i,t,e,n,s,r,a){const o=i.geometry.attributes.position;if(jr.fromBufferAttribute(o,s),ta.fromBufferAttribute(o,r),e.distanceSqToSegment(jr,ta,Oa,rc)>n)return;Oa.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Oa);if(!(l<t.near||l>t.far))return{distance:l,point:rc.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const ac=new I,oc=new I;class kd extends sa{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)ac.fromBufferAttribute(e,s),oc.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+ac.distanceTo(oc);t.setAttribute("lineDistance",new Pe(n,1))}else Nt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class zv extends sa{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class zd extends Di{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Kt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const lc=new Qt,Oo=new us,Ar=new ii,wr=new I;class Hv extends Te{constructor(t=new tn,e=new zd){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ar.copy(n.boundingSphere),Ar.applyMatrix4(s),Ar.radius+=r,t.ray.intersectsSphere(Ar)===!1)return;lc.copy(s).invert(),Oo.copy(t.ray).applyMatrix4(lc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,u=n.attributes.position;if(l!==null){const h=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let g=h,x=f;g<x;g++){const m=l.getX(g);wr.fromBufferAttribute(u,m),cc(wr,m,c,s,t,e,this)}}else{const h=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let g=h,x=f;g<x;g++)wr.fromBufferAttribute(u,g),cc(wr,g,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function cc(i,t,e,n,s,r,a){const o=Oo.distanceSqToPoint(i);if(o<e){const c=new I;Oo.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class Lh extends qe{constructor(t=[],e=as,n,s,r,a,o,c,l,d){super(t,e,n,s,r,a,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class cs extends qe{constructor(t,e,n=kn,s,r,a,o=ke,c=ke,l,d=gi,u=1){if(d!==gi&&d!==fi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:t,height:e,depth:u};super(h,s,r,a,o,c,d,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new jo(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}}class Dh extends cs{constructor(t,e=kn,n=as,s,r,a=ke,o=ke,c,l=gi){const d={width:t,height:t,depth:1},u=[d,d,d,d,d,d];super(t,t,e,n,s,r,a,o,c,l),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class Nh extends qe{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class ds extends tn{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],d=[],u=[];let h=0,f=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Pe(l,3)),this.setAttribute("normal",new Pe(d,3)),this.setAttribute("uv",new Pe(u,2));function g(x,m,p,v,E,b,T,A,_,y,L){const R=b/_,N=T/y,U=b/2,W=T/2,P=A/2,k=_+1,G=y+1;let V=0,st=0;const q=new I;for(let j=0;j<G;j++){const nt=j*N-W;for(let Rt=0;Rt<k;Rt++){const Vt=Rt*R-U;q[x]=Vt*v,q[m]=nt*E,q[p]=P,l.push(q.x,q.y,q.z),q[x]=0,q[m]=0,q[p]=A>0?1:-1,d.push(q.x,q.y,q.z),u.push(Rt/_),u.push(1-j/y),V+=1}}for(let j=0;j<y;j++)for(let nt=0;nt<_;nt++){const Rt=h+nt+k*j,Vt=h+nt+k*(j+1),$=h+(nt+1)+k*(j+1),Mt=h+(nt+1)+k*j;c.push(Rt,Vt,Mt),c.push(Vt,$,Mt),st+=6}o.addGroup(f,st,L),f+=st,h+=V}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ds(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class Ws extends tn{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const d=[],u=[],h=[],f=[];let g=0;const x=[],m=n/2;let p=0;v(),a===!1&&(t>0&&E(!0),e>0&&E(!1)),this.setIndex(d),this.setAttribute("position",new Pe(u,3)),this.setAttribute("normal",new Pe(h,3)),this.setAttribute("uv",new Pe(f,2));function v(){const b=new I,T=new I;let A=0;const _=(e-t)/n;for(let y=0;y<=r;y++){const L=[],R=y/r,N=R*(e-t)+t;for(let U=0;U<=s;U++){const W=U/s,P=W*c+o,k=Math.sin(P),G=Math.cos(P);T.x=N*k,T.y=-R*n+m,T.z=N*G,u.push(T.x,T.y,T.z),b.set(k,_,G).normalize(),h.push(b.x,b.y,b.z),f.push(W,1-R),L.push(g++)}x.push(L)}for(let y=0;y<s;y++)for(let L=0;L<r;L++){const R=x[L][y],N=x[L+1][y],U=x[L+1][y+1],W=x[L][y+1];(t>0||L!==0)&&(d.push(R,N,W),A+=3),(e>0||L!==r-1)&&(d.push(N,U,W),A+=3)}l.addGroup(p,A,0),p+=A}function E(b){const T=g,A=new wt,_=new I;let y=0;const L=b===!0?t:e,R=b===!0?1:-1;for(let U=1;U<=s;U++)u.push(0,m*R,0),h.push(0,R,0),f.push(.5,.5),g++;const N=g;for(let U=0;U<=s;U++){const P=U/s*c+o,k=Math.cos(P),G=Math.sin(P);_.x=L*G,_.y=m*R,_.z=L*k,u.push(_.x,_.y,_.z),h.push(0,R,0),A.x=k*.5+.5,A.y=G*.5*R+.5,f.push(A.x,A.y),g++}for(let U=0;U<s;U++){const W=T+U,P=N+U;b===!0?d.push(P,P+1,W):d.push(P+1,P,W),y+=3}l.addGroup(p,y,b===!0?1:2),p+=y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ws(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class il extends tn{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),l(n),d(),this.setAttribute("position",new Pe(r,3)),this.setAttribute("normal",new Pe(r.slice(),3)),this.setAttribute("uv",new Pe(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const E=new I,b=new I,T=new I;for(let A=0;A<e.length;A+=3)f(e[A+0],E),f(e[A+1],b),f(e[A+2],T),c(E,b,T,v)}function c(v,E,b,T){const A=T+1,_=[];for(let y=0;y<=A;y++){_[y]=[];const L=v.clone().lerp(b,y/A),R=E.clone().lerp(b,y/A),N=A-y;for(let U=0;U<=N;U++)U===0&&y===A?_[y][U]=L:_[y][U]=L.clone().lerp(R,U/N)}for(let y=0;y<A;y++)for(let L=0;L<2*(A-y)-1;L++){const R=Math.floor(L/2);L%2===0?(h(_[y][R+1]),h(_[y+1][R]),h(_[y][R])):(h(_[y][R+1]),h(_[y+1][R+1]),h(_[y+1][R]))}}function l(v){const E=new I;for(let b=0;b<r.length;b+=3)E.x=r[b+0],E.y=r[b+1],E.z=r[b+2],E.normalize().multiplyScalar(v),r[b+0]=E.x,r[b+1]=E.y,r[b+2]=E.z}function d(){const v=new I;for(let E=0;E<r.length;E+=3){v.x=r[E+0],v.y=r[E+1],v.z=r[E+2];const b=m(v)/2/Math.PI+.5,T=p(v)/Math.PI+.5;a.push(b,1-T)}g(),u()}function u(){for(let v=0;v<a.length;v+=6){const E=a[v+0],b=a[v+2],T=a[v+4],A=Math.max(E,b,T),_=Math.min(E,b,T);A>.9&&_<.1&&(E<.2&&(a[v+0]+=1),b<.2&&(a[v+2]+=1),T<.2&&(a[v+4]+=1))}}function h(v){r.push(v.x,v.y,v.z)}function f(v,E){const b=v*3;E.x=t[b+0],E.y=t[b+1],E.z=t[b+2]}function g(){const v=new I,E=new I,b=new I,T=new I,A=new wt,_=new wt,y=new wt;for(let L=0,R=0;L<r.length;L+=9,R+=6){v.set(r[L+0],r[L+1],r[L+2]),E.set(r[L+3],r[L+4],r[L+5]),b.set(r[L+6],r[L+7],r[L+8]),A.set(a[R+0],a[R+1]),_.set(a[R+2],a[R+3]),y.set(a[R+4],a[R+5]),T.copy(v).add(E).add(b).divideScalar(3);const N=m(T);x(A,R+0,v,N),x(_,R+2,E,N),x(y,R+4,b,N)}}function x(v,E,b,T){T<0&&v.x===1&&(a[E]=v.x-1),b.x===0&&b.z===0&&(a[E]=T/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new il(t.vertices,t.indices,t.radius,t.detail)}}const Rr=new I,Cr=new I,Ba=new I,Pr=new mn;class Hd extends tn{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),r=Math.cos(ss*e),a=t.getIndex(),o=t.getAttribute("position"),c=a?a.count:o.count,l=[0,0,0],d=["a","b","c"],u=new Array(3),h=new Map,f=[];for(let g=0;g<c;g+=3){a?(l[0]=a.getX(g),l[1]=a.getX(g+1),l[2]=a.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:x,b:m,c:p}=Pr;if(x.fromBufferAttribute(o,l[0]),m.fromBufferAttribute(o,l[1]),p.fromBufferAttribute(o,l[2]),Pr.getNormal(Ba),u[0]=`${Math.round(x.x*s)},${Math.round(x.y*s)},${Math.round(x.z*s)}`,u[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,u[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let v=0;v<3;v++){const E=(v+1)%3,b=u[v],T=u[E],A=Pr[d[v]],_=Pr[d[E]],y=`${b}_${T}`,L=`${T}_${b}`,R=h.get(L);R?(Ba.dot(R.normal)<=r&&(f.push(A.x,A.y,A.z),f.push(_.x,_.y,_.z)),h.set(L,null)):h.has(y)||h.set(y,{index0:l[v],index1:l[E],normal:Ba.clone()})}}for(const g of h.values())if(g){const{index0:x,index1:m}=g;Rr.fromBufferAttribute(o,x),Cr.fromBufferAttribute(o,m),f.push(Rr.x,Rr.y,Rr.z),f.push(Cr.x,Cr.y,Cr.z)}this.setAttribute("position",new Pe(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Vn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Nt("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);const d=n[s],h=n[s+1]-d,f=(a-d)/h;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new wt:new I);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new I,s=[],r=[],a=[],o=new I,c=new Qt;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new I)}r[0]=new I,a[0]=new I;let l=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),h=Math.abs(s[0].z);d<=l&&(l=d,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),h<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Yt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,g))}a[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Yt(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this.cacheArcLengths=null,this}}class Ih extends Vn{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new wt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=c-this.aX,f=l-this.aY;c=h*d-f*u+this.aX,l=h*u+f*d+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Vd extends Ih{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function sl(){let i=0,t=0,e=0,n=0;function s(r,a,o,c){i=r,t=o,e=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,d,u){let h=(a-r)/l-(o-r)/(l+d)+(o-a)/d,f=(o-a)/d-(c-a)/(d+u)+(c-o)/u;h*=d,f*=d,s(a,o,h,f)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const hc=new I,uc=new I,ka=new sl,za=new sl,Ha=new sl;class Gd extends Vn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new I){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,d;this.closed||o>0?l=s[(o-1)%r]:(uc.subVectors(s[0],s[1]).add(s[0]),l=uc);const u=s[o%r],h=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(hc.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=hc),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(h),f),m=Math.pow(h.distanceToSquared(d),f);x<1e-4&&(x=1),g<1e-4&&(g=x),m<1e-4&&(m=x),ka.initNonuniformCatmullRom(l.x,u.x,h.x,d.x,g,x,m),za.initNonuniformCatmullRom(l.y,u.y,h.y,d.y,g,x,m),Ha.initNonuniformCatmullRom(l.z,u.z,h.z,d.z,g,x,m)}else this.curveType==="catmullrom"&&(ka.initCatmullRom(l.x,u.x,h.x,d.x,this.tension),za.initCatmullRom(l.y,u.y,h.y,d.y,this.tension),Ha.initCatmullRom(l.z,u.z,h.z,d.z,this.tension));return n.set(ka.calc(c),za.calc(c),Ha.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new I().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function dc(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,c=i*o;return(2*e-2*n+r+a)*c+(-3*e+3*n-2*r-a)*o+r*i+e}function Wd(i,t){const e=1-i;return e*e*t}function Xd(i,t){return 2*(1-i)*i*t}function qd(i,t){return i*i*t}function Us(i,t,e,n){return Wd(i,t)+Xd(i,e)+qd(i,n)}function Yd(i,t){const e=1-i;return e*e*e*t}function Kd(i,t){const e=1-i;return 3*e*e*i*t}function Zd(i,t){return 3*(1-i)*i*i*t}function $d(i,t){return i*i*i*t}function Fs(i,t,e,n,s){return Yd(i,t)+Kd(i,e)+Zd(i,n)+$d(i,s)}class Jd extends Vn{constructor(t=new wt,e=new wt,n=new wt,s=new wt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new wt){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Fs(t,s.x,r.x,a.x,o.x),Fs(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Qd extends Vn{constructor(t=new I,e=new I,n=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new I){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Fs(t,s.x,r.x,a.x,o.x),Fs(t,s.y,r.y,a.y,o.y),Fs(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class jd extends Vn{constructor(t=new wt,e=new wt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new wt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new wt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Uh extends Vn{constructor(t=new I,e=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new I){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new I){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class tf extends Vn{constructor(t=new wt,e=new wt,n=new wt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new wt){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Us(t,s.x,r.x,a.x),Us(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ef extends Vn{constructor(t=new I,e=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new I){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Us(t,s.x,r.x,a.x),Us(t,s.y,r.y,a.y),Us(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class nf extends Vn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new wt){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],d=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(dc(o,c.x,l.x,d.x,u.x),dc(o,c.y,l.y,d.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new wt().fromArray(s))}return this}}var fc=Object.freeze({__proto__:null,ArcCurve:Vd,CatmullRomCurve3:Gd,CubicBezierCurve:Jd,CubicBezierCurve3:Qd,EllipseCurve:Ih,LineCurve:jd,LineCurve3:Uh,QuadraticBezierCurve:tf,QuadraticBezierCurve3:ef,SplineCurve:nf});class sf extends Vn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new fc[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){const d=c[l];n&&n.equals(d)||(e.push(d),n=d)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this.cacheLengths=null,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new fc[s.type]().fromJSON(s))}return this.cacheLengths=null,this}}class rl extends il{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new rl(t.radius,t.detail)}}class ra extends tn{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,d=c+1,u=t/o,h=e/c,f=[],g=[],x=[],m=[];for(let p=0;p<d;p++){const v=p*h-a;for(let E=0;E<l;E++){const b=E*u-r;g.push(b,-v,0),x.push(0,0,1),m.push(E/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let v=0;v<o;v++){const E=v+l*p,b=v+l*(p+1),T=v+1+l*(p+1),A=v+1+l*p;f.push(E,b,A),f.push(b,T,A)}this.setIndex(f),this.setAttribute("position",new Pe(g,3)),this.setAttribute("normal",new Pe(x,3)),this.setAttribute("uv",new Pe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ra(t.width,t.height,t.widthSegments,t.heightSegments)}}function hs(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];if(pc(s))s.isRenderTargetTexture?(Nt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(pc(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function je(i){const t={};for(let e=0;e<i.length;e++){const n=hs(i[e]);for(const s in n)t[s]=n[s]}return t}function pc(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function rf(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Fh(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ie.workingColorSpace}const af={clone:hs,merge:je};var of=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,lf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Li extends Di{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=of,this.fragmentShader=lf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=hs(t.uniforms),this.uniformsGroups=rf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const n in t.uniforms){const s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new Kt().setHex(s.value);break;case"v2":this.uniforms[n].value=new wt().fromArray(s.value);break;case"v3":this.uniforms[n].value=new I().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Me().fromArray(s.value);break;case"m3":this.uniforms[n].value=new qt().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Qt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class cf extends Li{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Oh extends Di{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Kt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Kt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fo,this.normalScale=new wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _i,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Vv extends Oh{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new wt(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Yt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new Kt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Kt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Kt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(t){this._diffuseRoughness>0!=t>0&&this.version++,this._diffuseRoughness=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}get iridescenceThicknessRange(){return is('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(t){is('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=t[0],this.iridescenceThicknessMaximum=t[1]}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.diffuseRoughness=t.diffuseRoughness,this.diffuseRoughnessMap=t.diffuseRoughnessMap,this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum,this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class hf extends Di{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ou,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class uf extends Di{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class df extends Qr{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}function hi(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Ps(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}function ff(i){function t(s,r){return i[s]-i[r]}const e=i.length,n=new Array(e);for(let s=0;s!==e;++s)n[s]=s;return n.sort(t),n}function mc(i,t,e){const n=i.length,s=new i.constructor(n);for(let r=0,a=0;a!==n;++r){const o=e[r]*t;for(let c=0;c!==t;++c)s[a++]=i[o+c]}return s}function pf(i,t,e,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(t.push(r.time),e.push(...a)),r=i[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(t.push(r.time),a.toArray(e,e.length)),r=i[s++];while(r!==void 0);else do a=r[n],a!==void 0&&(t.push(r.time),e.push(a)),r=i[s++];while(r!==void 0)}class Ys{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){const e=this.parameterPositions;let n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break t}a=e.length;break e}if(!(t>=r)){const o=e[1];t<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){const o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){const e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class mf extends Ys{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Rl,endingEnd:Rl}}intervalChanged_(t,e,n){const s=this.parameterPositions;let r=t-2,a=t+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Cl:r=t,o=2*e-n;break;case Pl:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Cl:a=t,c=2*n-e;break;case Pl:a=1,c=n+s[1]-s[0];break;default:a=t-1,c=e}const l=(n-e)*.5,d=this.valueSize;this._weightPrev=l/(e-o),this._weightNext=l/(c-n),this._offsetPrev=r*d,this._offsetNext=a*d}interpolate_(t,e,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,d=this._offsetPrev,u=this._offsetNext,h=this._weightPrev,f=this._weightNext,g=(n-e)/(s-e),x=g*g,m=x*g,p=-h*m+2*h*x-h*g,v=(1+h)*m+(-1.5-2*h)*x+(-.5+h)*g+1,E=(-1-f)*m+(1.5+f)*x+.5*g,b=f*m-f*x;for(let T=0;T!==o;++T)r[T]=p*a[d+T]+v*a[l+T]+E*a[c+T]+b*a[u+T];return r}}class gf extends Ys{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,d=(n-e)/(s-e),u=1-d;for(let h=0;h!==o;++h)r[h]=a[l+h]*u+a[c+h]*d;return r}}class _f extends Ys{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}}class vf extends Ys{interpolate_(t,e,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,d=this.inTangents,u=this.outTangents;if(!d||!u){const g=(n-e)/(s-e),x=1-g;for(let m=0;m!==o;++m)r[m]=a[l+m]*x+a[c+m]*g;return r}const h=o*2,f=t-1;for(let g=0;g!==o;++g){const x=a[l+g],m=a[c+g],p=f*h+g*2,v=u[p],E=u[p+1],b=t*h+g*2,T=d[b],A=d[b+1],_=Sf(n,e,v,T,s);r[g]=Bh(_,x,E,A,m)}return r}}function Bh(i,t,e,n,s){const r=1-i;return r*r*r*t+3*r*r*i*e+3*r*i*i*n+i*i*i*s}function xf(i,t,e,n,s){const r=1-i;return 3*r*r*(e-t)+6*r*i*(n-e)+3*i*i*(s-n)}function Sf(i,t,e,n,s){let r=(i-t)/(s-t);for(let a=0;a<8;a++){const o=Bh(r,t,e,n,s)-i;if(Math.abs(o)<1e-10)break;const c=xf(r,t,e,n,s);if(Math.abs(c)<1e-10)break;r=Math.max(0,Math.min(1,r-o/c))}return r}class An{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=hi(e,this.TimeBufferType),this.values=hi(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){const e=t.constructor;let n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:hi(t.times,Array),values:hi(t.values,Array)};const s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s),Ps(t.settings)&&(n.settings={inTangents:hi(t.settings.inTangents,Array),outTangents:hi(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new _f(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new gf(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new mf(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){const e=new vf(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Kr:e=this.InterpolantFactoryMethodDiscrete;break;case Uo:e=this.InterpolantFactoryMethodLinear;break;case fa:e=this.InterpolantFactoryMethodSmooth;break;case wl:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Nt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Kr;case this.InterpolantFactoryMethodLinear:return Uo;case this.InterpolantFactoryMethodSmooth:return fa;case this.InterpolantFactoryMethodBezier:return wl}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){const e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t;Ps(this.settings)&&(gc(this.settings.inTangents,t),gc(this.settings.outTangents,t))}return this}scale(t){if(t!==1){const e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t;Ps(this.settings)&&(_c(this.settings.inTangents,t),_c(this.settings.outTangents,t))}return this}trim(t,e){const n=this.times,s=n.length;let r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0;const e=this.getValueSize();e-Math.floor(e)!==0&&(Gt("KeyframeTrack: Invalid value size in track.",this),t=!1);const n=this.times,s=this.values,r=n.length;r===0&&(Gt("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){const c=n[o];if(typeof c=="number"&&isNaN(c)){Gt("KeyframeTrack: Time is not a valid number.",this,o,c),t=!1;break}if(a!==null&&a>c){Gt("KeyframeTrack: Out of order keys.",this,o,c,a),t=!1;break}a=c}if(s!==void 0&&qu(s))for(let o=0,c=s.length;o!==c;++o){const l=s[o];if(isNaN(l)){Gt("KeyframeTrack: Value is not a valid number.",this,o,l),t=!1;break}}return t}optimize(){const t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===fa,r=t.length-1;let a=1;for(let o=1;o<r;++o){let c=!1;const l=t[o],d=t[o+1];if(l!==d&&(o!==1||l!==t[0]))if(s)c=!0;else{const u=o*n,h=u-n,f=u+n;for(let g=0;g!==n;++g){const x=e[u+g];if(x!==e[h+g]||x!==e[f+g]){c=!0;break}}}if(c){if(o!==a){t[a]=t[o];const u=o*n,h=a*n;for(let f=0;f!==n;++f)e[h+f]=e[u+f]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)e[c+l]=e[o+l];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){const t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,Ps(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}}function gc(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]+=t}function _c(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]*=t}An.prototype.ValueTypeName="";An.prototype.TimeBufferType=Float32Array;An.prototype.ValueBufferType=Float32Array;An.prototype.DefaultInterpolation=Uo;class fs extends An{constructor(t,e,n){super(t,e,n)}}fs.prototype.ValueTypeName="bool";fs.prototype.ValueBufferType=Array;fs.prototype.DefaultInterpolation=Kr;fs.prototype.InterpolantFactoryMethodLinear=void 0;fs.prototype.InterpolantFactoryMethodSmooth=void 0;class kh extends An{constructor(t,e,n,s){super(t,e,n,s)}}kh.prototype.ValueTypeName="color";class al extends An{constructor(t,e,n,s){super(t,e,n,s)}}al.prototype.ValueTypeName="number";class Mf extends Ys{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-e)/(s-e);let l=t*o;for(let d=l+o;l!==d;l+=4)ni.slerpFlat(r,0,a,l-o,a,l,c);return r}}class ol extends An{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Mf(this.times,this.values,this.getValueSize(),t)}}ol.prototype.ValueTypeName="quaternion";ol.prototype.InterpolantFactoryMethodSmooth=void 0;class ps extends An{constructor(t,e,n){super(t,e,n)}}ps.prototype.ValueTypeName="string";ps.prototype.ValueBufferType=Array;ps.prototype.DefaultInterpolation=Kr;ps.prototype.InterpolantFactoryMethodLinear=void 0;ps.prototype.InterpolantFactoryMethodSmooth=void 0;class zh extends An{constructor(t,e,n,s){super(t,e,n,s)}}zh.prototype.ValueTypeName="vector";class Gv{constructor(t="",e=-1,n=[],s=Fu){this.name=t,this.tracks=n,this.duration=e,this.blendMode=s,this.uuid=Hn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(t){const e=[],n=t.tracks,s=1/(t.fps||1);for(let a=0,o=n.length;a!==o;++a)e.push(bf(n[a]).scale(s));const r=new this(t.name,t.duration,e,t.blendMode);return r.uuid=t.uuid,r.userData=JSON.parse(t.userData||"{}"),r}static toJSON(t){const e=[],n=t.tracks,s={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode,userData:JSON.stringify(t.userData)};for(let r=0,a=n.length;r!==a;++r)e.push(An.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(t,e,n,s){const r=e.length,a=[];for(let o=0;o<r;o++){let c=[],l=[];c.push((o+r-1)%r,o,(o+1)%r),l.push(0,1,0);const d=ff(c);c=mc(c,1,d),l=mc(l,1,d),!s&&c[0]===0&&(c.push(r),l.push(l[0])),a.push(new al(".morphTargetInfluences["+e[o].name+"]",c,l).scale(1/n))}return new this(t,-1,a)}static findByName(t,e){let n=t;if(!Array.isArray(t)){const s=t;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===e)return n[s];return null}static CreateClipsFromMorphTargetSequences(t,e,n){const s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,c=t.length;o<c;o++){const l=t[o],d=l.name.match(r);if(d&&d.length>1){const u=d[1];let h=s[u];h||(s[u]=h=[]),h.push(l)}}const a=[];for(const o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],e,n));return a}resetDuration(){const t=this.tracks;let e=0;for(let n=0,s=t.length;n!==s;++n){const r=this.tracks[n];e=Math.max(e,r.times[r.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){const t=[];for(let n=0;n<this.tracks.length;n++)t.push(this.tracks[n].clone());const e=new this.constructor(this.name,this.duration,t,this.blendMode);return e.userData=JSON.parse(JSON.stringify(this.userData)),e}toJSON(){return this.constructor.toJSON(this)}}function yf(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return al;case"vector":case"vector2":case"vector3":case"vector4":return zh;case"color":return kh;case"quaternion":return ol;case"bool":case"boolean":return fs;case"string":return ps}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function bf(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const t=yf(i.type);if(i.times===void 0){const n=[],s=[];pf(i.keys,n,s,"value"),i.times=n,i.values=s}let e;return t.parse!==void 0?e=t.parse(i):e=new t(i.name,i.times,i.values,i.interpolation),Ps(i.settings)&&(e.settings={inTangents:hi(i.settings.inTangents,Float32Array),outTangents:hi(i.settings.outTangents,Float32Array)}),e}const Jn={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(vc(i)||(this.files[i]=t))},get:function(i){if(this.enabled!==!1&&!vc(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function vc(i){try{const t=i.slice(i.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}class Ef{constructor(t,e,n){const s=this;let r=!1,a=0,o=0,c;const l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(d){o++,r===!1&&s.onStart!==void 0&&s.onStart(d,a,o),r=!0},this.itemEnd=function(d){a++,s.onProgress!==void 0&&s.onProgress(d,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(d){s.onError!==void 0&&s.onError(d)},this.resolveURL=function(d){return d=d.normalize("NFC"),c?c(d):d},this.setURLModifier=function(d){return c=d,this},this.addHandler=function(d,u){return l.push(d,u),this},this.removeHandler=function(d){const u=l.indexOf(d);return u!==-1&&l.splice(u,2),this},this.getHandler=function(d){for(let u=0,h=l.length;u<h;u+=2){const f=l[u],g=l[u+1];if(f.global&&(f.lastIndex=0),f.test(d))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const Tf=new Ef;class Ks{constructor(t){this.manager=t!==void 0?t:Tf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){const n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}setPriority(t){return this.priority=t,this}setCache(t){return this.cache=t,this}abort(){return this}}Ks.DEFAULT_MATERIAL_NAME="__DEFAULT";const Zn={};class Af extends Error{constructor(t,e){super(t),this.response=e}}class Wv extends Ks{constructor(t){super(t),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=Jn.get(`file:${t}`);if(r!==void 0){this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0);return}if(Zn[t]!==void 0){Zn[t].push({onLoad:e,onProgress:n,onError:s});return}Zn[t]=[],Zn[t].push({onLoad:e,onProgress:n,onError:s});const a=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,c=this.responseType;fetch(a).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&Nt("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const d=Zn[t],u=l.body.getReader(),h=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=h?parseInt(h):0,g=f!==0;let x=0;const m=new ReadableStream({start(p){v();function v(){u.read().then(({done:E,value:b})=>{if(E)p.close();else{x+=b.byteLength;const T=new ProgressEvent("progress",{lengthComputable:g,loaded:x,total:f});for(let A=0,_=d.length;A<_;A++){const y=d[A];y.onProgress&&y.onProgress(T)}p.enqueue(b),v()}},E=>{p.error(E)})}}});return new Response(m)}else throw new Af(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(d=>new DOMParser().parseFromString(d,o));case"json":return l.json();default:if(o==="")return l.text();{const u=/charset="?([^;"\s]*)"?/i.exec(o),h=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(h);return l.arrayBuffer().then(g=>f.decode(g))}}}).then(l=>{Jn.add(`file:${t}`,l);const d=Zn[t];delete Zn[t];for(let u=0,h=d.length;u<h;u++){const f=d[u];f.onLoad&&f.onLoad(l)}}).catch(l=>{const d=Zn[t];if(d===void 0)throw this.manager.itemError(t),l;delete Zn[t];for(let u=0,h=d.length;u<h;u++){const f=d[u];f.onError&&f.onError(l)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Ki=new WeakMap;class wf extends Ks{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,a=Jn.get(`image:${t}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0);else{let u=Ki.get(a);u===void 0&&(u=[],Ki.set(a,u)),u.push({onLoad:e,onError:s})}return a}const o=Vs("img");function c(){d(),e&&e(this);const u=Ki.get(this)||[];for(let h=0;h<u.length;h++){const f=u[h];f.onLoad&&f.onLoad(this)}Ki.delete(this),r.manager.itemEnd(t)}function l(u){d(),s&&s(u),Jn.remove(`image:${t}`);const h=Ki.get(this)||[];for(let f=0;f<h.length;f++){const g=h[f];g.onError&&g.onError(u)}Ki.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function d(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Jn.add(`image:${t}`,o),r.manager.itemStart(t),o.fetchPriority=this.priority,o.src=t,o}}class Xv extends Ks{constructor(t){super(t)}load(t,e,n,s){const r=new qe,a=new wf(this.manager);return a.setPriority(this.priority),a.setCache(this.cache),a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(t,function(o){r.image=o,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}}class aa extends Te{static registerNode(t){this.prototype._lightNode=t}constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Kt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class Rf extends aa{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Kt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const Va=new Qt,xc=new I,Sc=new I;class ll{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new wt(512,512),this.mapType=hn,this.map=null,this.mapPass=null,this.matrix=new Qt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Gs,this._frameExtents=new wt(1,1),this._viewportCount=1,this._viewports=[new Me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera;xc.setFromMatrixPosition(t.matrixWorld),e.position.copy(xc),Sc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Sc),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,s){Va.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(Va,t.coordinateSystem,t.reversedDepth);const r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,c=s?s.x/r.x:0,l=s?s.y/r.y:0;t.coordinateSystem===Hs||t.reversedDepth?e.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,.5,.5,0,0,0,1),e.multiply(Va)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.mapType=t.mapType,this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.mapType=this.mapType,t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Lr=new I,Dr=new ni,Cn=new I;class Hh extends Te{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Qt,this.projectionMatrix=new Qt,this.projectionMatrixInverse=new Qt,this.coordinateSystem=En,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Lr,Dr,Cn),Cn.x===1&&Cn.y===1&&Cn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Lr,Dr,Cn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(Lr,Dr,Cn),Cn.x===1&&Cn.y===1&&Cn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Lr,Dr,Cn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const ci=new I,Mc=new wt,yc=new wt;class ln extends Hh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ls*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ss*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ls*2*Math.atan(Math.tan(ss*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ci.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ci.x,ci.y).multiplyScalar(-t/ci.z),ci.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ci.x,ci.y).multiplyScalar(-t/ci.z)}getViewSize(t,e){return this.getViewBounds(t,Mc,yc),e.subVectors(yc,Mc)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ss*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class Cf extends ll{constructor(){super(new ln(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,n=ls*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=t.distance||e.far;(n!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this.aspect=t.aspect,this}toJSON(){const t=super.toJSON();return t.focus=this.focus,t.aspect=this.aspect,t}}class qv extends aa{constructor(t,e,n=0,s=Math.PI/3,r=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.target=new Te,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new Cf}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.map=t.map,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.angle=this.angle,e.object.decay=this.decay,e.object.penumbra=this.penumbra,e.object.target=this.target.uuid,this.map&&this.map.isTexture&&(e.object.map=this.map.toJSON(t).uuid),e.object.shadow=this.shadow.toJSON(),e}}class Pf extends ll{constructor(){super(new ln(90,1,.5,500)),this.isPointLightShadow=!0}}class Yv extends aa{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Pf}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}}class Vh extends Hh{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Lf extends ll{constructor(){super(new Vh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Df extends aa{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.target=new Te,this.shadow=new Lf}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}class Kv{static extractUrlBase(t){const e=t.lastIndexOf("/");return e===-1?"./":t.slice(0,e+1)}static resolveURL(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t)}}const Ga=new WeakMap;class Zv extends Ks{constructor(t){super(t),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Nt("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Nt("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(t){return this.options=t,this}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,a=Jn.get(`image-bitmap:${t}`);if(a!==void 0){if(r.manager.itemStart(t),a.then){a.then(l=>{Ga.has(a)===!0?(s&&s(Ga.get(a)),r.manager.itemError(t),r.manager.itemEnd(t)):(e&&e(l),r.manager.itemEnd(t))});return}setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0);return}const o={};o.credentials=this.withCredentials||this.crossOrigin!=="anonymous"?"include":"same-origin",o.headers=this.requestHeader,o.priority=this.priority,o.cache=this.cache,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const c=fetch(t,o).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(l){return Jn.add(`image-bitmap:${t}`,l),e&&e(l),r.manager.itemEnd(t),l}).catch(function(l){s&&s(l),Ga.set(c,l),Jn.remove(`image-bitmap:${t}`),r.manager.itemError(t),r.manager.itemEnd(t)});Jn.add(`image-bitmap:${t}`,c),r.manager.itemStart(t)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Zi=-90,$i=1;class Bo extends Te{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new ln(Zi,$i,t,e);s.layers=this.layers,this.add(s);const r=new ln(Zi,$i,t,e);r.layers=this.layers,this.add(r);const a=new ln(Zi,$i,t,e);a.layers=this.layers,this.add(a);const o=new ln(Zi,$i,t,e);o.layers=this.layers,this.add(o);const c=new ln(Zi,$i,t,e);c.layers=this.layers,this.add(c);const l=new ln(Zi,$i,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,c]=e;for(const l of e)this.remove(l);if(t===En)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Hs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,d]=this.children,u=t.getRenderTarget(),h=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),t.setRenderTarget(n,4,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),n.texture.mipmapsAutoUpdate=x,t.setRenderTarget(n,5,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,d),t.setRenderTarget(u,h,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Nf extends ln{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t,this.perCameraFrustumCulled=!1}}const cl="\\[\\]\\.:\\/",If=new RegExp("["+cl+"]","g"),hl="[^"+cl+"]",Uf="[^"+cl.replace("\\.","")+"]",Ff=/((?:WC+[\/:])*)/.source.replace("WC",hl),Of=/(WCOD+)?/.source.replace("WCOD",Uf),Bf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",hl),kf=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",hl),zf=new RegExp("^"+Ff+Of+Bf+kf+"$"),Hf=["material","materials","bones","map"];class Vf{constructor(t,e,n){const s=n||_e.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();const n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){const n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}}class _e{constructor(t,e,n){this.path=e,this.parsedPath=n||_e.parseTrackName(e),this.node=_e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new _e.Composite(t,e,n):new _e(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(If,"")}static parseTrackName(t){const e=zf.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);const n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=n.nodeName.substring(s+1);Hf.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){const n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===e||o.uuid===e)return o;const c=n(o.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node;const e=this.parsedPath,n=e.objectName,s=e.propertyName;let r=e.propertyIndex;if(t||(t=_e.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Nt("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){Gt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Gt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Gt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let d=0;d<t.length;d++)if(t[d].name===l){l=d;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Gt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Gt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Gt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){Gt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}const a=t[s];if(a===void 0){const l=e.nodeName;Gt("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Gt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Gt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}_e.Composite=Vf;_e.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};_e.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};_e.prototype.GetterByBindingType=[_e.prototype._getValue_direct,_e.prototype._getValue_array,_e.prototype._getValue_arrayElement,_e.prototype._getValue_toArray];_e.prototype.SetterByBindingTypeAndVersioning=[[_e.prototype._setValue_direct,_e.prototype._setValue_direct_setNeedsUpdate,_e.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[_e.prototype._setValue_array,_e.prototype._setValue_array_setNeedsUpdate,_e.prototype._setValue_array_setMatrixWorldNeedsUpdate],[_e.prototype._setValue_arrayElement,_e.prototype._setValue_arrayElement_setNeedsUpdate,_e.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[_e.prototype._setValue_fromArray,_e.prototype._setValue_fromArray_setNeedsUpdate,_e.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const bc=new Qt;class Gf{constructor(t,e,n=0,s=1/0){this.ray=new us(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new tl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):Gt("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return bc.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(bc),this}intersectObject(t,e=!0,n=[]){return ko(t,this,n,e),n.sort(Ec),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)ko(t[s],this,n,e);return n.sort(Ec),n}}function Ec(i,t){return i.distance-t.distance}function ko(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)ko(r[a],t,e,!0)}}class Tc{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Yt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Yt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Wf extends xi{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function Ac(i,t,e,n){const s=Xf(n);switch(e){case _h:return i*t;case qo:return i*t/s.components*s.byteLength;case Yo:return i*t/s.components*s.byteLength;case Pi:return i*t*2/s.components*s.byteLength;case Ko:return i*t*2/s.components*s.byteLength;case vh:return i*t*3/s.components*s.byteLength;case bn:return i*t*4/s.components*s.byteLength;case Zo:return i*t*4/s.components*s.byteLength;case kr:case zr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Hr:case Vr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ro:case oo:return Math.max(i,16)*Math.max(t,8)/4;case so:case ao:return Math.max(i,8)*Math.max(t,8)/2;case lo:case co:case uo:case fo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ho:case qr:case po:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case mo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case go:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case _o:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case vo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case xo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case So:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Mo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case yo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case bo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Eo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case To:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Ao:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case wo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Ro:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Co:case Po:case Lo:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Do:case No:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Yr:case Io:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Xf(i){switch(i){case hn:case fh:return{byteLength:1,components:1};case zs:case ph:case zn:return{byteLength:2,components:1};case Wo:case Xo:return{byteLength:2,components:4};case kn:case Go:case gn:return{byteLength:4,components:1};case mh:case gh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?Nt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Gh(){let i=null,t=!1,e=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),e(r,a)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function qf(i){const t=new WeakMap;function e(o,c){const l=o.array,d=o.usage,u=l.byteLength,h=i.createBuffer();i.bindBuffer(c,h),i.bufferData(c,l,d),o.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const d=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,d);else{u.sort((f,g)=>f.start-g.start);let h=0;for(let f=1;f<u.length;f++){const g=u[h],x=u[f];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++h,u[h]=x)}u.length=h+1;for(let f=0,g=u.length;f<g;f++){const x=u[f];i.bufferSubData(l,x.start*d.BYTES_PER_ELEMENT,d,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=t.get(o);(!d||d.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var Yf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Kf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Zf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,$f=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Jf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Qf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,jf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,tp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ep=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,np=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ip=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,sp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,rp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ap=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,op=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,lp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,cp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,hp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,up=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,dp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,fp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,pp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,mp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,gp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,_p=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,vp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,xp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Sp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Mp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,yp="gl_FragColor = linearToOutputTexel( gl_FragColor );",bp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ep=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Tp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Ap=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,wp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Rp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Cp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Pp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Lp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Dp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Np=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ip=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Up=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Fp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Op=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Bp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,kp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Hp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Vp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Gp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Wp=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Xp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,qp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Yp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Kp=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Zp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,$p=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Jp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,jp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,tm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,em=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,nm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,im=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,sm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,rm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,am=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,om=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,cm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,um=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,dm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,pm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,mm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,gm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,_m=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,vm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,xm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Sm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Mm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,ym=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,bm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Em=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Tm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Am=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,wm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Rm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Cm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Pm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Lm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Dm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Nm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Im=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Um=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Fm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Om=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Bm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,km=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,zm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Hm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Vm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Gm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Wm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Xm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const qm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ym=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Km=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zm=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$m=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,jm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,tg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,eg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,ng=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ig=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,rg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ag=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,og=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ug=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,fg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,pg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,_g=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Mg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,yg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,bg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Eg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Tg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Zt={alphahash_fragment:Yf,alphahash_pars_fragment:Kf,alphamap_fragment:Zf,alphamap_pars_fragment:$f,alphatest_fragment:Jf,alphatest_pars_fragment:Qf,aomap_fragment:jf,aomap_pars_fragment:tp,batching_pars_vertex:ep,batching_vertex:np,begin_vertex:ip,beginnormal_vertex:sp,bsdfs:rp,iridescence_fragment:ap,bumpmap_pars_fragment:op,clipping_planes_fragment:lp,clipping_planes_pars_fragment:cp,clipping_planes_pars_vertex:hp,clipping_planes_vertex:up,color_fragment:dp,color_pars_fragment:fp,color_pars_vertex:pp,color_vertex:mp,common:gp,defaultnormal_vertex:_p,displacementmap_pars_vertex:vp,displacementmap_vertex:xp,emissivemap_fragment:Sp,emissivemap_pars_fragment:Mp,colorspace_fragment:yp,colorspace_pars_fragment:bp,envmap_fragment:Ep,envmap_common_pars_fragment:Tp,envmap_pars_fragment:Ap,envmap_pars_vertex:wp,envmap_physical_pars_fragment:Bp,envmap_vertex:Rp,fog_vertex:Cp,fog_pars_vertex:Pp,fog_fragment:Lp,fog_pars_fragment:Dp,gradientmap_pars_fragment:Np,lightmap_pars_fragment:Ip,lights_lambert_fragment:Up,lights_lambert_pars_fragment:Fp,lights_pars_begin:Op,lights_toon_fragment:kp,lights_toon_pars_fragment:zp,lights_phong_fragment:Hp,lights_phong_pars_fragment:Vp,lights_physical_fragment:Gp,lights_physical_pars_fragment:Wp,lights_fragment_begin:Xp,lights_fragment_maps:qp,lights_fragment_end:Yp,lightprobes_pars_fragment:Kp,logdepthbuf_fragment:Zp,logdepthbuf_pars_fragment:$p,logdepthbuf_pars_vertex:Jp,logdepthbuf_vertex:Qp,map_fragment:jp,map_pars_fragment:tm,map_particle_fragment:em,map_particle_pars_fragment:nm,metalnessmap_fragment:im,metalnessmap_pars_fragment:sm,morphinstance_vertex:rm,morphcolor_vertex:am,morphnormal_vertex:om,morphtarget_pars_vertex:lm,morphtarget_vertex:cm,normal_fragment_begin:hm,normal_fragment_maps:um,normal_pars_fragment:dm,normal_pars_vertex:fm,normal_vertex:pm,normalmap_pars_fragment:mm,clearcoat_normal_fragment_begin:gm,clearcoat_normal_fragment_maps:_m,clearcoat_pars_fragment:vm,iridescence_pars_fragment:xm,opaque_fragment:Sm,packing:Mm,premultiplied_alpha_fragment:ym,project_vertex:bm,dithering_fragment:Em,dithering_pars_fragment:Tm,roughnessmap_fragment:Am,roughnessmap_pars_fragment:wm,shadowmap_pars_fragment:Rm,shadowmap_pars_vertex:Cm,shadowmap_vertex:Pm,shadowmask_pars_fragment:Lm,skinbase_vertex:Dm,skinning_pars_vertex:Nm,skinning_vertex:Im,skinnormal_vertex:Um,specularmap_fragment:Fm,specularmap_pars_fragment:Om,tonemapping_fragment:Bm,tonemapping_pars_fragment:km,transmission_fragment:zm,transmission_pars_fragment:Hm,uv_pars_fragment:Vm,uv_pars_vertex:Gm,uv_vertex:Wm,worldpos_vertex:Xm,background_vert:qm,background_frag:Ym,backgroundCube_vert:Km,backgroundCube_frag:Zm,cube_vert:$m,cube_frag:Jm,depth_vert:Qm,depth_frag:jm,distance_vert:tg,distance_frag:eg,equirect_vert:ng,equirect_frag:ig,linedashed_vert:sg,linedashed_frag:rg,meshbasic_vert:ag,meshbasic_frag:og,meshlambert_vert:lg,meshlambert_frag:cg,meshmatcap_vert:hg,meshmatcap_frag:ug,meshnormal_vert:dg,meshnormal_frag:fg,meshphong_vert:pg,meshphong_frag:mg,meshphysical_vert:gg,meshphysical_frag:_g,meshtoon_vert:vg,meshtoon_frag:xg,points_vert:Sg,points_frag:Mg,shadow_vert:yg,shadow_frag:bg,sprite_vert:Eg,sprite_frag:Tg},bt={common:{diffuse:{value:new Kt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qt}},envmap:{envMap:{value:null},envMapRotation:{value:new qt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qt},normalScale:{value:new wt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Kt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Kt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0},uvTransform:{value:new qt}},sprite:{diffuse:{value:new Kt(16777215)},opacity:{value:1},center:{value:new wt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}}},In={basic:{uniforms:je([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.fog]),vertexShader:Zt.meshbasic_vert,fragmentShader:Zt.meshbasic_frag},lambert:{uniforms:je([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,bt.lights,{emissive:{value:new Kt(0)},envMapIntensity:{value:1}}]),vertexShader:Zt.meshlambert_vert,fragmentShader:Zt.meshlambert_frag},phong:{uniforms:je([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,bt.lights,{emissive:{value:new Kt(0)},specular:{value:new Kt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Zt.meshphong_vert,fragmentShader:Zt.meshphong_frag},standard:{uniforms:je([bt.common,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.roughnessmap,bt.metalnessmap,bt.fog,bt.lights,{emissive:{value:new Kt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Zt.meshphysical_vert,fragmentShader:Zt.meshphysical_frag},toon:{uniforms:je([bt.common,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.gradientmap,bt.fog,bt.lights,{emissive:{value:new Kt(0)}}]),vertexShader:Zt.meshtoon_vert,fragmentShader:Zt.meshtoon_frag},matcap:{uniforms:je([bt.common,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,{matcap:{value:null}}]),vertexShader:Zt.meshmatcap_vert,fragmentShader:Zt.meshmatcap_frag},points:{uniforms:je([bt.points,bt.fog]),vertexShader:Zt.points_vert,fragmentShader:Zt.points_frag},dashed:{uniforms:je([bt.common,bt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Zt.linedashed_vert,fragmentShader:Zt.linedashed_frag},depth:{uniforms:je([bt.common,bt.displacementmap]),vertexShader:Zt.depth_vert,fragmentShader:Zt.depth_frag},normal:{uniforms:je([bt.common,bt.bumpmap,bt.normalmap,bt.displacementmap,{opacity:{value:1}}]),vertexShader:Zt.meshnormal_vert,fragmentShader:Zt.meshnormal_frag},sprite:{uniforms:je([bt.sprite,bt.fog]),vertexShader:Zt.sprite_vert,fragmentShader:Zt.sprite_frag},background:{uniforms:{uvTransform:{value:new qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Zt.background_vert,fragmentShader:Zt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qt}},vertexShader:Zt.backgroundCube_vert,fragmentShader:Zt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Zt.cube_vert,fragmentShader:Zt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Zt.equirect_vert,fragmentShader:Zt.equirect_frag},distance:{uniforms:je([bt.common,bt.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Zt.distance_vert,fragmentShader:Zt.distance_frag},shadow:{uniforms:je([bt.lights,bt.fog,{color:{value:new Kt(0)},opacity:{value:1}}]),vertexShader:Zt.shadow_vert,fragmentShader:Zt.shadow_frag}};In.physical={uniforms:je([In.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qt},clearcoatNormalScale:{value:new wt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qt},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new qt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qt},sheen:{value:0},sheenColor:{value:new Kt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qt},transmissionSamplerSize:{value:new wt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qt},attenuationDistance:{value:0},attenuationColor:{value:new Kt(0)},specularColor:{value:new Kt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qt},anisotropyVector:{value:new wt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qt}}]),vertexShader:Zt.meshphysical_vert,fragmentShader:Zt.meshphysical_frag};const Nr={r:0,b:0,g:0},Ag=new Qt,Wh=new qt;Wh.set(-1,0,0,0,1,0,0,0,1);function wg(i,t,e,n,s,r){const a=new Kt(0);let o=s===!0?0:1,c,l,d=null,u=0,h=null;function f(v){let E=v.isScene===!0?v.background:null;if(E&&E.isTexture){const b=v.backgroundBlurriness>0;E=t.get(E,b)}return E}function g(v){let E=!1;const b=f(v);b===null?m(a,o):b&&b.isColor&&(m(b,1),E=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?e.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||E)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(v,E){const b=f(E);b&&b.isCubeTexture?(l===void 0&&(l=new un(new ds(1,1,1),new Li({name:"BackgroundCubeMaterial",uniforms:hs(In.backgroundCube.uniforms),vertexShader:In.backgroundCube.vertexShader,fragmentShader:In.backgroundCube.fragmentShader,side:rn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(T,A,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=b,l.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Ag.makeRotationFromEuler(E.backgroundRotation)).transpose(),b.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Wh),l.material.toneMapped=ie.getTransfer(b.colorSpace)!==ge,(d!==b||u!==b.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,d=b,u=b.version,h=i.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null)):b&&b.isTexture&&(c===void 0&&(c=new un(new ra(2,2),new Li({name:"BackgroundMaterial",uniforms:hs(In.background.uniforms),vertexShader:In.background.vertexShader,fragmentShader:In.background.fragmentShader,side:Ci,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=b,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.toneMapped=ie.getTransfer(b.colorSpace)!==ge,b.matrixAutoUpdate===!0&&b.updateMatrix(),c.material.uniforms.uvTransform.value.copy(b.matrix),(d!==b||u!==b.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,d=b,u=b.version,h=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function m(v,E){v.getRGB(Nr,Fh(i)),e.buffers.color.setClear(Nr.r,Nr.g,Nr.b,E,r)}function p(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,E=1){a.set(v),o=E,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(v){o=v,m(a,o)},render:g,addToRenderList:x,dispose:p}}function Rg(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null);let r=s,a=!1;function o(N,U,W,P,k){let G=!1;const V=u(N,P,W,U);r!==V&&(r=V,l(r.object)),G=f(N,P,W,k),G&&g(N,P,W,k),k!==null&&t.update(k,i.ELEMENT_ARRAY_BUFFER),(G||a)&&(a=!1,b(N,U,W,P),k!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(k).buffer))}function c(){return i.createVertexArray()}function l(N){return i.bindVertexArray(N)}function d(N){return i.deleteVertexArray(N)}function u(N,U,W,P){const k=P.wireframe===!0;let G=n[U.id];G===void 0&&(G={},n[U.id]=G);const V=N.isInstancedMesh===!0?N.id:0;let st=G[V];st===void 0&&(st={},G[V]=st);let q=st[W.id];q===void 0&&(q={},st[W.id]=q);let j=q[k];return j===void 0&&(j=h(c()),q[k]=j),j}function h(N){const U=[],W=[],P=[];for(let k=0;k<e;k++)U[k]=0,W[k]=0,P[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:W,attributeDivisors:P,object:N,attributes:{},index:null}}function f(N,U,W,P){const k=r.attributes,G=U.attributes;let V=0;const st=W.getAttributes();for(const q in st)if(st[q].location>=0){const nt=k[q];let Rt=G[q];if(Rt===void 0&&(q==="instanceMatrix"&&N.instanceMatrix&&(Rt=N.instanceMatrix),q==="instanceColor"&&N.instanceColor&&(Rt=N.instanceColor)),nt===void 0||nt.attribute!==Rt||Rt&&nt.data!==Rt.data)return!0;V++}return r.attributesNum!==V||r.index!==P}function g(N,U,W,P){const k={},G=U.attributes;let V=0;const st=W.getAttributes();for(const q in st)if(st[q].location>=0){let nt=G[q];nt===void 0&&(q==="instanceMatrix"&&N.instanceMatrix&&(nt=N.instanceMatrix),q==="instanceColor"&&N.instanceColor&&(nt=N.instanceColor));const Rt={};Rt.attribute=nt,nt&&nt.data&&(Rt.data=nt.data),k[q]=Rt,V++}r.attributes=k,r.attributesNum=V,r.index=P}function x(){const N=r.newAttributes;for(let U=0,W=N.length;U<W;U++)N[U]=0}function m(N){p(N,0)}function p(N,U){const W=r.newAttributes,P=r.enabledAttributes,k=r.attributeDivisors;W[N]=1,P[N]===0&&(i.enableVertexAttribArray(N),P[N]=1),k[N]!==U&&(i.vertexAttribDivisor(N,U),k[N]=U)}function v(){const N=r.newAttributes,U=r.enabledAttributes;for(let W=0,P=U.length;W<P;W++)U[W]!==N[W]&&(i.disableVertexAttribArray(W),U[W]=0)}function E(N,U,W,P,k,G,V){V===!0?i.vertexAttribIPointer(N,U,W,k,G):i.vertexAttribPointer(N,U,W,P,k,G)}function b(N,U,W,P){x();const k=P.attributes,G=W.getAttributes(),V=U.defaultAttributeValues;for(const st in G){const q=G[st];if(q.location>=0){let j=k[st];if(j===void 0&&(st==="instanceMatrix"&&N.instanceMatrix&&(j=N.instanceMatrix),st==="instanceColor"&&N.instanceColor&&(j=N.instanceColor)),j!==void 0){const nt=j.normalized,Rt=j.itemSize,Vt=t.get(j);if(Vt===void 0)continue;const $=Vt.buffer,Mt=Vt.type,At=Vt.bytesPerElement,Ut=Mt===i.INT||Mt===i.UNSIGNED_INT||j.gpuType===Go;if(j.isInterleavedBufferAttribute){const yt=j.data,et=yt.isInterleavedBuffer===!0?yt.stride:yt.itemSize,de=j.offset;if(yt.isInstancedInterleavedBuffer||yt.isInstancedBufferAttribute){for(let It=0;It<q.locationSize;It++)p(q.location+It,yt.meshPerAttribute);N.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=yt.meshPerAttribute*yt.count)}else for(let It=0;It<q.locationSize;It++)m(q.location+It);i.bindBuffer(i.ARRAY_BUFFER,$);for(let It=0;It<q.locationSize;It++)E(q.location+It,Rt/q.locationSize,Mt,nt,et*At,(de+Rt/q.locationSize*It)*At,Ut)}else{if(j.isInstancedBufferAttribute){for(let yt=0;yt<q.locationSize;yt++)p(q.location+yt,j.meshPerAttribute);N.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let yt=0;yt<q.locationSize;yt++)m(q.location+yt);i.bindBuffer(i.ARRAY_BUFFER,$);for(let yt=0;yt<q.locationSize;yt++)E(q.location+yt,Rt/q.locationSize,Mt,nt,Rt*At,Rt/q.locationSize*yt*At,Ut)}}else if(V!==void 0){const nt=V[st];if(nt!==void 0)switch(nt.length){case 2:i.vertexAttrib2fv(q.location,nt);break;case 3:i.vertexAttrib3fv(q.location,nt);break;case 4:i.vertexAttrib4fv(q.location,nt);break;default:i.vertexAttrib1fv(q.location,nt)}}}}v()}function T(){L();for(const N in n){const U=n[N];for(const W in U){const P=U[W];for(const k in P){const G=P[k];for(const V in G)d(G[V].object),delete G[V];delete P[k]}}delete n[N]}}function A(N){if(n[N.id]===void 0)return;const U=n[N.id];for(const W in U){const P=U[W];for(const k in P){const G=P[k];for(const V in G)d(G[V].object),delete G[V];delete P[k]}}delete n[N.id]}function _(N){for(const U in n){const W=n[U];for(const P in W){const k=W[P];if(k[N.id]===void 0)continue;const G=k[N.id];for(const V in G)d(G[V].object),delete G[V];delete k[N.id]}}}function y(N){for(const U in n){const W=n[U],P=N.isInstancedMesh===!0?N.id:0,k=W[P];if(k!==void 0){for(const G in k){const V=k[G];for(const st in V)d(V[st].object),delete V[st];delete k[G]}delete W[P],Object.keys(W).length===0&&delete n[U]}}}function L(){R(),a=!0,r!==s&&(r=s,l(r.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:L,resetDefaultState:R,dispose:T,releaseStatesOfGeometry:A,releaseStatesOfObject:y,releaseStatesOfProgram:_,initAttributes:x,enableAttribute:m,disableUnusedAttributes:v}}function Cg(i,t,e){let n;function s(c){n=c}function r(c,l){i.drawArrays(n,c,l),e.update(l,n,1)}function a(c,l,d){d!==0&&(i.drawArraysInstanced(n,c,l,d),e.update(l,n,d))}function o(c,l,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,d);let h=0;for(let f=0;f<d;f++)h+=l[f];e.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Pg(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const _=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(_){return!(_!==bn&&n.convert(_)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(_){const y=_===zn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(_!==hn&&_!==gn&&!y&&n.convert(_)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function c(_){if(_==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const d=c(l);d!==l&&(Nt("WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),h=e.logarithmicDepthBuffer===!0&&u===!1;e.reversedDepthBuffer===!0&&u===!1&&Nt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),e.logarithmicDepthBuffer===!0&&u===!0&&Nt("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=i.getParameter(i.MAX_SAMPLES),A=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:v,maxVaryings:E,maxFragmentUniforms:b,maxSamples:T,samples:A}}function Lg(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new Nn,o=new qt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const f=u.length!==0||h||n!==0||s;return s=h,n=u.length,f},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,h){e=d(u,h,0)},this.setState=function(u,h,f){const g=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?d(null):l();else{const v=r?0:n,E=v*4;let b=p.clippingState||null;c.value=b,b=d(g,h,E,f);for(let T=0;T!==E;++T)b[T]=e[T];p.clippingState=b,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function d(u,h,f,g){const x=u!==null?u.length:0;let m=null;if(x!==0){if(m=c.value,g!==!0||m===null){const p=f+x*4,v=h.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<p)&&(m=new Float32Array(p));for(let E=0,b=f;E!==x;++E,b+=4)a.copy(u[E]).applyMatrix4(v,o),a.normal.toArray(m,b),m[b+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}class ul extends On{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Lh(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new ds(5,5,5),r=new Li({name:"CubemapFromEquirect",uniforms:hs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:rn,blending:ns});r.uniforms.tEquirect.value=e;const a=new un(s,r),o=e.minFilter;return e.minFilter===di&&(e.minFilter=sn),new Bo(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}const wc=256,Dg=3,Ng=20,Xh=256,qh=16,Ig=3,Ug=new I,Fg=new Kt;class ea{constructor(t){this._renderer=t,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Bo(1,10,null),this._boxMesh=new un(new ds(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=Ug}=r,c=this._renderer;this._setSize(a);const l=this._allocateTarget(),d=this._getSourceTarget(!0);e>0&&(d.texture.mipmapsAutoUpdate=!1);const u=c.autoClear,h=c.autoClearColor,f=c.autoClearDepth,g=c.autoClearStencil,x=t.background;c.autoClear=!0,c.autoClearColor=!0,c.autoClearDepth=!0,c.autoClearStencil=!0,x===null&&(t.background=c.getClearColor(Fg));const m=new Bo(n,s,d);return m.position.copy(o),m.update(c,t),c.autoClear=u,c.autoClearColor=h,c.autoClearDepth=f,c.autoClearStencil=g,t.background=x,e>0&&(d.texture.mipmapsAutoUpdate=!0,this._blur(l,e)),this._applyPMREM(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Pc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Cc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(t,e){return e>0?1-Math.sqrt(1-t/e):0}_setSize(t){this._cubeSize=Math.max(wc,Eh(t))}_fromTexture(t,e){t.mapping===as||t.mapping===ks?this._setSize(t.image.length===0?wc:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4);const n=e||this._allocateTarget();return this._textureToCubemap(t),this._applyPMREM(n),n}_allocateTarget(){const t=this._cubeSize,e=Rc(t,!1,!1),n=Math.log2(t)-Dg;for(let s=0;s<=n;s++)e.texture.mipmaps.push({width:t>>s,height:t>>s});return e.texture.name="PMREM",e.texture.isPMREMTexture=!0,e}_getSourceTarget(t=!1){const e=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==e||t&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=Rc(e,!0,t)),this._sourceTarget}_compileMaterial(t){this._boxMesh.material=t,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(t,e,n){const s=this._boxMesh,r=this._cubeCamera;s.material=n,r.renderTarget=t,r.activeMipmapLevel=e;const a=t.width>>e;t.viewport.set(0,0,a,a),r.update(this._renderer,s),t.viewport.set(0,0,t.width,t.height)}_textureToCubemap(t){let e;t.mapping===as||t.mapping===ks?(this._cubemapMaterial===null&&(this._cubemapMaterial=Pc()),e=this._cubemapMaterial,e.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Cc()),e=this._equirectMaterial),e.uniforms.envMap.value=t,this._renderCube(this._getSourceTarget(),0,e)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=Og(),this._integrationMaterial=Bg());const e=this._cubeSize,n=t.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(e/qh);for(let a=0;a<=n;a++){const o=ea.lodToRoughness(a,n);if(a>n-Ig)r.roughness.value=o,this._renderCube(t,a,this._integrationMaterial);else{const c=o>0?Math.log2(e)+.5*Math.log2(6/(Xh*Math.pow(o,4)))+.5:0;s.roughness.value=o,s.lodBias.value=c,this._renderCube(t,a,this._ggxMaterial)}}}_blur(t,e){this._blurMaterial===null&&(this._blurMaterial=kg());const n=this._blurMaterial,s=n.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(e,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(t,0,n),s.envMap.value=t.texture,this._renderCube(r,0,n)}}function Rc(i,t,e){return new ul(i,{minFilter:di,generateMipmaps:t,type:zn,colorSpace:Zr,depthBuffer:e})}function Zs(i,t,e){return new Li({name:i,uniforms:t,vertexShader:Zt.cube_vert,fragmentShader:e,side:rn,blending:ns,depthTest:!1,depthWrite:!1})}function Og(){return Zs("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Xh}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Bg(){return Zs("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:qh}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function kg(){return Zs("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Ng}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Cc(){return Zs("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Pc(){return Zs("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function zg(i){let t=new WeakMap,e=new WeakMap,n=null;function s(h,f=!1){return h==null?null:f?a(h):r(h)}function r(h){if(h&&h.isTexture){const f=h.mapping;if(f===ha||f===ua)if(t.has(h)){const g=t.get(h).texture;return o(g,h.mapping)}else{const g=h.image;if(g&&g.height>0){const x=new ul(g.height);return x.fromEquirectangularTexture(i,h),t.set(h,x),h.addEventListener("dispose",l),o(x.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture&&h.isPMREMTexture!==!0){const f=h.mapping,g=f===ha||f===ua,x=f===as||f===ks;if(g||x){let m=e.get(h);const p=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return n===null&&(n=new ea(i)),m=g?n.fromEquirectangular(h,m):n.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,e.set(h,m),m.texture;if(m!==void 0)return m.texture;{const v=h.image;return g&&v&&v.height>0||x&&v&&c(v)?(n===null&&(n=new ea(i)),m=g?n.fromEquirectangular(h):n.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,e.set(h,m),h.addEventListener("dispose",d),m.texture):null}}}return h}function o(h,f){return f===ha?h.mapping=as:f===ua&&(h.mapping=ks),h}function c(h){let f=0;const g=6;for(let x=0;x<g;x++)h[x]!==void 0&&f++;return f===g}function l(h){const f=h.target;f.removeEventListener("dispose",l);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function d(h){const f=h.target;f.removeEventListener("dispose",d);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function u(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:u}}function Hg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];const s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&is("WebGLRenderer: "+n+" extension not supported."),s}}}function Vg(i,t,e,n){const s={},r=new WeakMap,a=new FinalizationRegistry(g=>delete s[g]);function o(g){c(g.target)}function c(g){g.index!==null&&t.remove(g.index);for(const m in g.attributes)t.remove(g.attributes[m]);g.removeEventListener("dispose",o),delete s[g.id],a.unregister(g);const x=r.get(g);x&&(t.remove(x),r.delete(g)),n.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,e.memory.geometries--}function l(g,x){return s[x.id]!==void 0||(x.addEventListener("dispose",o),s[x.id]=new WeakRef(x),a.register(x,x.id,x),e.memory.geometries++),x}function d(g){const x=g.attributes;for(const m in x)t.update(x[m],i.ARRAY_BUFFER)}function u(g){const x=g.index,m=g.attributes.position;let p=0;if(m===void 0)return;const v=x!==null?x.array.length:m.array.length/3-1,E=m.count>=65535?Rh:wh,b=new E(Math.ceil(v/3)*6,1),T=b.array;if(x!==null){const _=x.array;p=x.version;for(let y=0,L=0;y<v;y+=3){const R=_[y+0],N=_[y+1],U=_[y+2];T[L++]=R,T[L++]=N,T[L++]=N,T[L++]=U,T[L++]=U,T[L++]=R}}else{p=m.version;for(let _=0,y=0;_<v;_+=3){const L=_+0,R=_+1,N=_+2;T[y++]=L,T[y++]=R,T[y++]=R,T[y++]=N,T[y++]=N,T[y++]=L}}b.version=p;const A=r.get(g);A&&t.remove(A),r.set(g,b)}function h(g){const x=r.get(g);if(x){const m=g.index;m!==null&&x.version<m.version&&u(g)}else u(g);return r.get(g)}function f(){for(const g in s){const x=s[g].deref();x!==void 0&&c(x)}}return{get:l,update:d,getWireframeAttribute:h,dispose:f}}function Gg(i,t,e){let n;function s(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function c(u,h){i.drawElements(n,h,r,u*a),e.update(h,n,1)}function l(u,h,f){f!==0&&(i.drawElementsInstanced(n,h,r,u*a,f),e.update(h,n,f))}function d(u,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,u,0,f);let x=0;for(let m=0;m<f;m++)x+=h[m];e.update(x,n,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d}function Wg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:Gt("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Xg(i,t,e){const n=new WeakMap,s=new Me;function r(a,o,c){const l=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let h=n.get(o);if(h===void 0||h.count!==u){let L=function(){_.dispose(),n.delete(o),o.removeEventListener("dispose",L)};h!==void 0&&h.texture.dispose();const f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let E=0;f===!0&&(E=1),g===!0&&(E=2),x===!0&&(E=3);let b=o.attributes.position.count*E,T=1;b>t.maxTextureSize&&(T=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);const A=new Float32Array(b*T*4*u),_=new Th(A,b,T,u);_.type=gn,_.needsUpdate=!0;const y=E*4;for(let R=0;R<u;R++){const N=m[R],U=p[R],W=v[R],P=b*T*4*R;for(let k=0;k<N.count;k++){const G=k*y;f===!0&&(s.fromBufferAttribute(N,k),A[P+G+0]=s.x,A[P+G+1]=s.y,A[P+G+2]=s.z,A[P+G+3]=0),g===!0&&(s.fromBufferAttribute(U,k),A[P+G+4]=s.x,A[P+G+5]=s.y,A[P+G+6]=s.z,A[P+G+7]=0),x===!0&&(s.fromBufferAttribute(W,k),A[P+G+8]=s.x,A[P+G+9]=s.y,A[P+G+10]=s.z,A[P+G+11]=W.itemSize===4?s.w:1)}}h={count:u,texture:_,size:new wt(b,T)},n.set(o,h),o.addEventListener("dispose",L)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let f=0;for(let x=0;x<l.length;x++)f+=l[x];const g=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function qg(i,t,e,n,s){let r=new WeakMap;function a(l){const d=s.render.frame,u=l.geometry,h=t.get(l,u);if(r.get(h)!==d&&(t.update(h),r.set(h,d)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==d&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,d))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==d&&(f.update(),r.set(f,d))}return h}function o(){r=new WeakMap}function c(l){const d=l.target;d.removeEventListener("dispose",c),n.releaseStatesOfObject(d),e.remove(d.instanceMatrix),d.instanceColor!==null&&e.remove(d.instanceColor)}return{update:a,dispose:o}}const Yg={[ah]:"LINEAR_TONE_MAPPING",[oh]:"REINHARD_TONE_MAPPING",[lh]:"CINEON_TONE_MAPPING",[Vo]:"ACES_FILMIC_TONE_MAPPING",[hh]:"AGX_TONE_MAPPING",[uh]:"NEUTRAL_TONE_MAPPING",[ch]:"CUSTOM_TONE_MAPPING"};function Kg(i,t,e,n,s,r){const a=new On(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,c=null,l=null;const d=new tn;d.setAttribute("position",new Pe([-1,3,0,-1,-1,0,3,-1,0],3)),d.setAttribute("uv",new Pe([0,2,0,0,2,0],2));const u=new cf({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new un(d,u),f=new Vh(-1,1,1,-1,0,1);let g=null,x=null,m=!1,p,v=null,E=[],b=!1;this.setSize=function(T,A){a.setSize(T,A),o!==null&&o.setSize(T,A),c!==null&&c.setSize(T,A);for(let _=0;_<E.length;_++){const y=E[_];y.setSize&&y.setSize(T,A)}},this.setEffects=function(T){E=T,b=E.length>0&&E[0].isRenderPass===!0;const A=a.width,_=a.height;E.length>0&&o===null&&(o=new On(A,_,{type:zn,depthBuffer:!1,stencilBuffer:!1}),c=new On(A,_,{type:zn,depthBuffer:!1,stencilBuffer:!1}));const y=s===!0&&E.some(L=>L.needsDepthTexture===!0);y!==(a.depthTexture!==null)&&(y===!0&&l===null&&(l=new cs(A,_),r===!0&&(l.format=fi,l.type=os)),a.dispose(),a.depthTexture=y?l:null,a.resolveDepthBuffer=y,a.storeMultisampledDepthBuffer=y);for(let L=0;L<E.length;L++){const R=E[L];R.setSize&&R.setSize(A,_),y&&R.needsDepthTexture===!0&&R.setDepthTexture&&R.setDepthTexture(l)}},this.begin=function(T,A){if(m||T.toneMapping===jn&&E.length===0)return!1;if(v=A,A!==null){const _=A.width,y=A.height;(a.width!==_||a.height!==y)&&this.setSize(_,y)}return b===!1&&T.setRenderTarget(a),p=T.toneMapping,T.toneMapping=jn,!0},this.hasRenderPass=function(){return b},this.end=function(T,A){T.toneMapping=p,m=!0;let _=a,y=o;for(let L=0;L<E.length;L++){const R=E[L];R.enabled!==!1&&(R.render(T,y,_,A),R.needsSwap!==!1&&(_=y,y=y===o?c:o))}if(g!==T.outputColorSpace||x!==T.toneMapping){g=T.outputColorSpace,x=T.toneMapping,u.defines={},ie.getTransfer(g)===ge&&(u.defines.SRGB_TRANSFER="");const L=Yg[x];L&&(u.defines[L]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=_.texture,T.setRenderTarget(v),T.render(h,f),v=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),c!==null&&c.dispose(),d.dispose(),u.dispose()}}const Yh=new qe,Kh=new cs(1,1),Zh=new Dh(1),$h=new Th,Jh=new gd,Qh=new Lh,Lc=[],Dc=[],Nc=new Float32Array(16),Ic=new Float32Array(9),Uc=new Float32Array(4);function ms(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Lc[s];if(r===void 0&&(r=new Float32Array(s),Lc[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Le(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function De(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function oa(i,t){let e=Dc[t];e===void 0&&(e=new Int32Array(t),Dc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Zg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function $g(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2fv(this.addr,t),De(e,t)}}function Jg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Le(e,t))return;i.uniform3fv(this.addr,t),De(e,t)}}function Qg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4fv(this.addr,t),De(e,t)}}function jg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),De(e,t)}else{if(Le(e,n))return;Uc.set(n),i.uniformMatrix2fv(this.addr,!1,Uc),De(e,n)}}function t0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),De(e,t)}else{if(Le(e,n))return;Ic.set(n),i.uniformMatrix3fv(this.addr,!1,Ic),De(e,n)}}function e0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),De(e,t)}else{if(Le(e,n))return;Nc.set(n),i.uniformMatrix4fv(this.addr,!1,Nc),De(e,n)}}function n0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function i0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2iv(this.addr,t),De(e,t)}}function s0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Le(e,t))return;i.uniform3iv(this.addr,t),De(e,t)}}function r0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4iv(this.addr,t),De(e,t)}}function a0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function o0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2uiv(this.addr,t),De(e,t)}}function l0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Le(e,t))return;i.uniform3uiv(this.addr,t),De(e,t)}}function c0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4uiv(this.addr,t),De(e,t)}}function la(i){return i.version===0&&(i.compareFunction=Mh,i.needsUpdate=!0),i}function h0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?r=la(Kh):r=Yh,e.setTexture2D(t||r,s)}function u0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Jh,s)}function d0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_CUBE_SHADOW?r=la(Zh):r=Qh,e.setTextureCube(t||r,s)}function f0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||$h,s)}function p0(i){switch(i){case 5126:return Zg;case 35664:return $g;case 35665:return Jg;case 35666:return Qg;case 35674:return jg;case 35675:return t0;case 35676:return e0;case 5124:case 35670:return n0;case 35667:case 35671:return i0;case 35668:case 35672:return s0;case 35669:case 35673:return r0;case 5125:return a0;case 36294:return o0;case 36295:return l0;case 36296:return c0;case 35678:case 36198:case 36298:case 36306:case 35682:return h0;case 35679:case 36299:case 36307:return u0;case 35680:case 36300:case 36308:case 36293:return d0;case 36289:case 36303:case 36311:case 36292:return f0}}function m0(i,t){i.uniform1fv(this.addr,t)}function g0(i,t){const e=ms(t,this.size,2);i.uniform2fv(this.addr,e)}function _0(i,t){const e=ms(t,this.size,3);i.uniform3fv(this.addr,e)}function v0(i,t){const e=ms(t,this.size,4);i.uniform4fv(this.addr,e)}function x0(i,t){const e=ms(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function S0(i,t){const e=ms(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function M0(i,t){const e=ms(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function y0(i,t){i.uniform1iv(this.addr,t)}function b0(i,t){i.uniform2iv(this.addr,t)}function E0(i,t){i.uniform3iv(this.addr,t)}function T0(i,t){i.uniform4iv(this.addr,t)}function A0(i,t){i.uniform1uiv(this.addr,t)}function w0(i,t){i.uniform2uiv(this.addr,t)}function R0(i,t){i.uniform3uiv(this.addr,t)}function C0(i,t){i.uniform4uiv(this.addr,t)}function P0(i,t,e){const n=this.cache,s=t.length,r=oa(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),De(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=la(Kh):a=Yh;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function L0(i,t,e){const n=this.cache,s=t.length,r=oa(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Jh,r[a])}function D0(i,t,e){const n=this.cache,s=t.length,r=oa(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),De(n,r));let a;this.type===i.SAMPLER_CUBE_SHADOW?a=la(Zh):a=Qh;for(let o=0;o!==s;++o)e.setTextureCube(t[o]||a,r[o])}function N0(i,t,e){const n=this.cache,s=t.length,r=oa(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||$h,r[a])}function I0(i){switch(i){case 5126:return m0;case 35664:return g0;case 35665:return _0;case 35666:return v0;case 35674:return x0;case 35675:return S0;case 35676:return M0;case 5124:case 35670:return y0;case 35667:case 35671:return b0;case 35668:case 35672:return E0;case 35669:case 35673:return T0;case 5125:return A0;case 36294:return w0;case 36295:return R0;case 36296:return C0;case 35678:case 36198:case 36298:case 36306:case 35682:return P0;case 35679:case 36299:case 36307:return L0;case 35680:case 36300:case 36308:case 36293:return D0;case 36289:case 36303:case 36311:case 36292:return N0}}class U0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=p0(e.type)}}class F0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=I0(e.type)}}class O0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const Wa=/(\w+)(\])?(\[|\.)?/g;function Fc(i,t){i.seq.push(t),i.map[t.id]=t}function B0(i,t,e){const n=i.name,s=n.length;for(Wa.lastIndex=0;;){const r=Wa.exec(n),a=Wa.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Fc(e,l===void 0?new U0(o,i,t):new F0(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new O0(o),Fc(e,u)),e=u}}}class Gr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=t.getActiveUniform(e,a),c=t.getUniformLocation(e,o.name);B0(o,c,this)}const s=[],r=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Oc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const k0=37297;let z0=0;function H0(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Bc=new qt;function V0(i){ie._getMatrix(Bc,ie.workingColorSpace,i);const t=`mat3( ${Bc.elements.map(e=>e.toFixed(4))} )`;switch(ie.getTransfer(i)){case $r:return[t,"LinearTransferOETF"];case ge:return[t,"sRGBTransferOETF"];default:return Nt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function kc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+H0(i.getShaderSource(t),o)}else return r}function G0(i,t){const e=V0(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( ${e[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const W0={[ah]:"Linear",[oh]:"Reinhard",[lh]:"Cineon",[Vo]:"ACESFilmic",[hh]:"AgX",[uh]:"Neutral",[ch]:"Custom"};function X0(i,t){const e=W0[t];return e===void 0?(Nt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ir=new I;function q0(){ie.getLuminanceCoefficients(Ir);const i=Ir.x.toFixed(4),t=Ir.y.toFixed(4),e=Ir.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Y0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ls).join(`
`)}function K0(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Z0(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Ls(i){return i!==""}function zc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function Hc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const $0=/^[ \t]*#include +<([\w\d./]+)>/gm;function zo(i){return i.replace($0,J0)}function J0(i,t){const e=Zt[t];if(e===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");return zo(e)}const Q0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Vc(i){return i.replace(Q0,j0)}function j0(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Gc(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const t_={[Br]:"SHADOWMAP_TYPE_PCF",[Cs]:"SHADOWMAP_TYPE_VSM"};function e_(i){return t_[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const n_={[ks]:"ENVMAP_MODE_REFRACTION"};function i_(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":n_[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const s_={[rh]:"ENVMAP_BLENDING_MULTIPLY",[Du]:"ENVMAP_BLENDING_MIX",[Nu]:"ENVMAP_BLENDING_ADD"};function r_(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":s_[i.combine]||"ENVMAP_BLENDING_NONE"}function a_(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=e_(e),l=e.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",d=i_(e),u=r_(e),h=Y0(e),f=K0(r),g=s.createProgram();let x,m,p=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(x=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f].filter(Ls).join(`
`),x.length>0&&(x+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f].filter(Ls).join(`
`),m.length>0&&(m+=`
`)):(x=[Gc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+e.diffuseRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ls).join(`
`),m=[Gc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+u:"",e.envMapPMREM?"#define ENVMAP_MAX_LOD "+e.envMapMaxLod+".0":"",e.envMapPMREM?"#define ENVMAP_SIZE "+e.envMapSize+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==jn?"#define TONE_MAPPING":"",e.toneMapping!==jn?Zt.tonemapping_pars_fragment:"",e.toneMapping!==jn?X0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Zt.colorspace_pars_fragment,G0("linearToOutputTexel",e.outputColorSpace),q0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ls).join(`
`)),a=zo(a),a=zc(a,e),a=Hc(a,e),o=zo(o),o=zc(o,e),o=Hc(o,e),a=Vc(a),o=Vc(o),e.isRawShaderMaterial!==!0&&(p=`#version 300 es
`,x=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,m=["#define varying in",e.glslVersion===Ll?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ll?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const v=p+x+a,E=p+m+o,b=Oc(s,s.VERTEX_SHADER,v),T=Oc(s,s.FRAGMENT_SHADER,E);s.attachShader(g,b),s.attachShader(g,T),e.index0AttributeName!==void 0?s.bindAttribLocation(g,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function A(R){if(i.debug.checkShaderErrors){const N=s.getProgramInfoLog(g)||"",U=s.getShaderInfoLog(b)||"",W=s.getShaderInfoLog(T)||"",P=N.trim(),k=U.trim(),G=W.trim();let V=!0,st=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,b,T);else{const q=kc(s,b,"vertex"),j=kc(s,T,"fragment");Gt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+P+`
`+q+`
`+j)}else P!==""?Nt("WebGLProgram: Program Info Log:",P):(k===""||G==="")&&(st=!1);st&&(R.diagnostics={runnable:V,programLog:P,vertexShader:{log:k,prefix:x},fragmentShader:{log:G,prefix:m}})}s.deleteShader(b),s.deleteShader(T),_=new Gr(s,g),y=Z0(s,g)}let _;this.getUniforms=function(){return _===void 0&&A(this),_};let y;this.getAttributes=function(){return y===void 0&&A(this),y};let L=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(g,k0)),L},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=z0++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=b,this.fragmentShader=T,this}let o_=0;class l_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){const s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new c_(t),e.set(t,n)),n}}class c_{constructor(t){this.id=o_++,this.code=t,this.usedTimes=0}}function h_(i){return i===Pi||i===qr||i===Yr}function u_(i,t,e,n,s,r){const a=new tl,o=new l_,c=new Set,l=[],d=new Map,u=n.logarithmicDepthBuffer,h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(_){return c.add(_),_===0?"uv":`uv${_}`}function g(_,y,L,R,N,U){const W=R.fog,P=N.geometry,k=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?R.environment:null,G=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,V=t.get(_.envMap||k,G),st=h[_.type];let q=n.precision;_.precision!==null&&(q=n.getMaxPrecision(_.precision),q!==_.precision&&Nt("WebGLProgram.getParameters:",_.precision,"not supported, using",q,"instead."));const j=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,nt=j!==void 0?j.length:0;let Rt=0;P.morphAttributes.position!==void 0&&(Rt=1),P.morphAttributes.normal!==void 0&&(Rt=2),P.morphAttributes.color!==void 0&&(Rt=3);let Vt,$,Mt,At;if(st){const St=In[st];Vt=St.vertexShader,$=St.fragmentShader}else{Vt=_.vertexShader,$=_.fragmentShader;const St=o.getVertexShaderStage(_),oe=o.getFragmentShaderStage(_);o.update(_,St,oe),Mt=St.id,At=oe.id}const Ut=i.getRenderTarget(),yt=i.state.buffers.depth.getReversed(),et=N.isInstancedMesh===!0,de=N.isBatchedMesh===!0,It=!!_.map,le=!!_.matcap,ce=!!V,Ft=ce&&V.isPMREMTexture===!0,$t=!!_.aoMap,re=!!_.lightMap,Ae=!!_.bumpMap&&_.wireframe===!1,jt=!!_.normalMap,ne=!!_.displacementMap,ve=!!_.emissiveMap,Fe=!!_.metalnessMap,Oe=!!_.roughnessMap,be=_.anisotropy>0,F=_.clearcoat>0,fe=_.diffuseRoughness>0,Bt=_.dispersion>0,te=_.retroreflectivity>0,ut=_.iridescence>0,ye=_.sheen>0,Dt=_.transmission>0,kt=be&&!!_.anisotropyMap,w=F&&!!_.clearcoatMap,M=F&&!!_.clearcoatNormalMap,H=F&&!!_.clearcoatRoughnessMap,rt=fe&&!!_.diffuseRoughnessMap,Q=ut&&!!_.iridescenceMap,ht=ut&&!!_.iridescenceThicknessMap,ft=ye&&!!_.sheenColorMap,Z=ye&&!!_.sheenRoughnessMap,Y=!!_.specularMap,pt=!!_.specularColorMap,D=!!_.specularIntensityMap,J=Dt&&!!_.transmissionMap,K=Dt&&!!_.thicknessMap,mt=!!_.gradientMap,ot=!!_.alphaMap,gt=_.alphaTest>0,Lt=!!_.alphaHash,Wt=!!_.extensions;let at=jn;_.toneMapped&&(Ut===null||Ut.isXRRenderTarget===!0)&&(at=i.toneMapping);const Ct=Ft?V.isCompressedCubeTexture?V.image[0].mipmaps:V.mipmaps:null,Xt={shaderID:st,shaderType:_.type,shaderName:_.name,vertexShader:Vt,fragmentShader:$,defines:_.defines,customVertexShaderID:Mt,customFragmentShaderID:At,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:q,batching:de,batchingColor:de&&N._colorsTexture!==null,instancing:et,instancingColor:et&&N.instanceColor!==null,instancingMorph:et&&N.morphTexture!==null,outputColorSpace:Ut===null?i.outputColorSpace:Ut.isXRRenderTarget===!0?Ut.texture.colorSpace:ie.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:It,matcap:le,envMap:ce,envMapMode:ce&&V.mapping,envMapPMREM:Ft,envMapMaxLod:Ft?Ct.length-1:null,envMapSize:Ft?Ct[0].width:null,aoMap:$t,lightMap:re,bumpMap:Ae,normalMap:jt,displacementMap:ne,emissiveMap:ve,normalMapObjectSpace:jt&&_.normalMapType===Bu,normalMapTangentSpace:jt&&_.normalMapType===Fo,packedNormalMap:jt&&_.normalMapType===Fo&&h_(_.normalMap.format),metalnessMap:Fe,roughnessMap:Oe,anisotropy:be,anisotropyMap:kt,clearcoat:F,clearcoatMap:w,clearcoatNormalMap:M,clearcoatRoughnessMap:H,diffuseRoughness:fe,diffuseRoughnessMap:rt,dispersion:Bt,retroreflection:te,iridescence:ut,iridescenceMap:Q,iridescenceThicknessMap:ht,sheen:ye,sheenColorMap:ft,sheenRoughnessMap:Z,specularMap:Y,specularColorMap:pt,specularIntensityMap:D,transmission:Dt,transmissionMap:J,thicknessMap:K,gradientMap:mt,opaque:_.transparent===!1&&_.blending===Ns&&_.alphaToCoverage===!1,alphaMap:ot,alphaTest:gt,alphaHash:Lt,combine:_.combine,mapUv:It&&f(_.map.channel),aoMapUv:$t&&f(_.aoMap.channel),lightMapUv:re&&f(_.lightMap.channel),bumpMapUv:Ae&&f(_.bumpMap.channel),normalMapUv:jt&&f(_.normalMap.channel),displacementMapUv:ne&&f(_.displacementMap.channel),emissiveMapUv:ve&&f(_.emissiveMap.channel),metalnessMapUv:Fe&&f(_.metalnessMap.channel),roughnessMapUv:Oe&&f(_.roughnessMap.channel),anisotropyMapUv:kt&&f(_.anisotropyMap.channel),clearcoatMapUv:w&&f(_.clearcoatMap.channel),clearcoatNormalMapUv:M&&f(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:H&&f(_.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:rt&&f(_.diffuseRoughnessMap.channel),iridescenceMapUv:Q&&f(_.iridescenceMap.channel),iridescenceThicknessMapUv:ht&&f(_.iridescenceThicknessMap.channel),sheenColorMapUv:ft&&f(_.sheenColorMap.channel),sheenRoughnessMapUv:Z&&f(_.sheenRoughnessMap.channel),specularMapUv:Y&&f(_.specularMap.channel),specularColorMapUv:pt&&f(_.specularColorMap.channel),specularIntensityMapUv:D&&f(_.specularIntensityMap.channel),transmissionMapUv:J&&f(_.transmissionMap.channel),thicknessMapUv:K&&f(_.thicknessMap.channel),alphaMapUv:ot&&f(_.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(jt||be),vertexNormals:!!P.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!P.attributes.uv&&(It||ot),fog:!!W,useFog:_.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||P.attributes.normal===void 0&&jt===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:yt,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:P.attributes.position!==void 0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:nt,morphTextureStride:Rt,numSunLights:y.sun.length,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numSunLightShadows:y.sunShadowMap.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numLightProbeGrids:U.filter(St=>St.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:at,decodeVideoTexture:It&&_.map.isVideoTexture===!0&&ie.getTransfer(_.map.colorSpace)===ge,decodeVideoTextureEmissive:ve&&_.emissiveMap.isVideoTexture===!0&&ie.getTransfer(_.emissiveMap.colorSpace)===ge,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===cn,flipSided:_.side===rn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Wt&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Wt&&_.extensions.multiDraw===!0||de)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Xt.vertexUv1s=c.has(1),Xt.vertexUv2s=c.has(2),Xt.vertexUv3s=c.has(3),c.clear(),Xt}function x(_){const y=[];if(_.shaderID?y.push(_.shaderID):(y.push(_.customVertexShaderID),y.push(_.customFragmentShaderID)),_.defines!==void 0)for(const L in _.defines)y.push(L),y.push(_.defines[L]);return _.isRawShaderMaterial===!1&&(m(y,_),p(y,_),y.push(i.outputColorSpace)),y.push(_.customProgramCacheKey),y.join()}function m(_,y){_.push(y.precision),_.push(y.outputColorSpace),_.push(y.envMapMode),_.push(y.envMapPMREM),_.push(y.envMapMaxLod),_.push(y.envMapSize),_.push(y.mapUv),_.push(y.alphaMapUv),_.push(y.lightMapUv),_.push(y.aoMapUv),_.push(y.bumpMapUv),_.push(y.normalMapUv),_.push(y.displacementMapUv),_.push(y.emissiveMapUv),_.push(y.metalnessMapUv),_.push(y.roughnessMapUv),_.push(y.anisotropyMapUv),_.push(y.clearcoatMapUv),_.push(y.clearcoatNormalMapUv),_.push(y.clearcoatRoughnessMapUv),_.push(y.diffuseRoughnessMapUv),_.push(y.iridescenceMapUv),_.push(y.iridescenceThicknessMapUv),_.push(y.sheenColorMapUv),_.push(y.sheenRoughnessMapUv),_.push(y.specularMapUv),_.push(y.specularColorMapUv),_.push(y.specularIntensityMapUv),_.push(y.transmissionMapUv),_.push(y.thicknessMapUv),_.push(y.combine),_.push(y.fogExp2),_.push(y.sizeAttenuation),_.push(y.morphTargetsCount),_.push(y.numSunLights),_.push(y.numDirLights),_.push(y.numPointLights),_.push(y.numSpotLights),_.push(y.numSpotLightMaps),_.push(y.numHemiLights),_.push(y.numRectAreaLights),_.push(y.numSunLightShadows),_.push(y.numDirLightShadows),_.push(y.numPointLightShadows),_.push(y.numSpotLightShadows),_.push(y.numSpotLightShadowsWithMaps),_.push(y.numLightProbes),_.push(y.numLightProbeGrids),_.push(y.shadowMapType),_.push(y.toneMapping),_.push(y.numClippingPlanes),_.push(y.numClipIntersection),_.push(y.depthPacking)}function p(_,y){a.disableAll(),y.instancing&&a.enable(0),y.instancingColor&&a.enable(1),y.instancingMorph&&a.enable(2),y.matcap&&a.enable(3),y.envMap&&a.enable(4),y.normalMapObjectSpace&&a.enable(5),y.normalMapTangentSpace&&a.enable(6),y.clearcoat&&a.enable(7),y.iridescence&&a.enable(8),y.alphaTest&&a.enable(9),y.vertexColors&&a.enable(10),y.vertexAlphas&&a.enable(11),y.vertexUv1s&&a.enable(12),y.vertexUv2s&&a.enable(13),y.vertexUv3s&&a.enable(14),y.vertexTangents&&a.enable(15),y.anisotropy&&a.enable(16),y.alphaHash&&a.enable(17),y.batching&&a.enable(18),y.dispersion&&a.enable(19),y.retroreflection&&a.enable(24),y.diffuseRoughness&&a.enable(25),y.batchingColor&&a.enable(20),y.gradientMap&&a.enable(21),y.packedNormalMap&&a.enable(22),y.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),y.numLightProbeGrids>0&&a.enable(22),y.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function v(_){const y=h[_.type];let L;if(y){const R=In[y];L=af.clone(R.uniforms)}else L=_.uniforms;return L}function E(_,y){let L=d.get(y);return L!==void 0?++L.usedTimes:(L=new a_(i,y,_,s),l.push(L),d.set(y,L)),L}function b(_){if(--_.usedTimes===0){const y=l.indexOf(_);l[y]=l[l.length-1],l.pop(),d.delete(_.cacheKey),_.destroy()}}function T(_){o.remove(_)}function A(){o.dispose()}return{getParameters:g,getProgramCacheKey:x,getUniforms:v,acquireProgram:E,releaseProgram:b,releaseShaderCache:T,programs:l,dispose:A}}function d_(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function f_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function Wc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Xc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function o(h,f,g,x,m,p){let v=i[t];return v===void 0?(v={id:h.id,object:h,geometry:f,material:g,materialVariant:a(h),groupOrder:x,renderOrder:h.renderOrder,z:m,group:p},i[t]=v):(v.id=h.id,v.object=h,v.geometry=f,v.material=g,v.materialVariant=a(h),v.groupOrder=x,v.renderOrder=h.renderOrder,v.z=m,v.group=p),t++,v}function c(h,f,g,x,m,p,v){v.reversedDepth===!0&&(m=-m);const E=o(h,f,g,x,m,p);g.transmission>0?n.push(E):g.transparent===!0?s.push(E):e.push(E)}function l(h,f,g,x,m,p){const v=o(h,f,g,x,m,p);g.transmission>0?n.unshift(v):g.transparent===!0?s.unshift(v):e.unshift(v)}function d(h,f){e.length>1&&e.sort(h||f_),n.length>1&&n.sort(f||Wc),s.length>1&&s.sort(f||Wc)}function u(){for(let h=t,f=i.length;h<f;h++){const g=i[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:c,unshift:l,finish:u,sort:d}}function p_(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new Xc,i.set(n,[a])):s>=r.length?(a=new Xc,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function m_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new I,color:new Kt};break;case"SpotLight":e={position:new I,direction:new I,color:new Kt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new Kt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new Kt,groundColor:new Kt};break;case"RectAreaLight":e={color:new Kt,position:new I,halfWidth:new I,halfHeight:new I};break}return i[t.id]=e,e}}}function g_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new wt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new wt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new wt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let __=0;function v_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function x_(i){const t=new m_,e=g_(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new I);const s=new I,r=new Qt,a=new Qt;function o(l){let d=0,u=0,h=0;for(let U=0;U<9;U++)n.probe[U].set(0,0,0);let f=0,g=0,x=0,m=0,p=0,v=0,E=0,b=0,T=0,A=0,_=0,y=0,L=0,R=0;l.sort(v_);for(let U=0,W=l.length;U<W;U++){const P=l[U],k=P.color,G=P.intensity,V=P.distance;let st=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Pi?st=P.shadow.map.texture:st=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)d+=k.r*G,u+=k.g*G,h+=k.b*G;else if(P.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(P.sh.coefficients[q],G);R++}else if(P.isSunLight){const q=t.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const j=P.shadow,nt=e.get(P);nt.shadowIntensity=j.intensity,nt.shadowBias=j.bias,nt.shadowNormalBias=j.normalBias,nt.shadowRadius=j.radius,nt.shadowMapSize.copy(j.mapSize).multiply(j.getFrameExtents()),n.sunShadow[g]=nt,n.sunShadowMap[g]=st;const Rt=j.getViewportCount();for(let Vt=0;Vt<Rt;Vt++)n.sunShadowMatrix[x+Vt]=j.getMatrix(Vt),n.sunShadowCascade[x+Vt]=j._cascadeData[Vt];x+=Rt,g++}n.sun[f]=q,f++}else if(P.isDirectionalLight){const q=t.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const j=P.shadow,nt=e.get(P);nt.shadowIntensity=j.intensity,nt.shadowBias=j.bias,nt.shadowNormalBias=j.normalBias,nt.shadowRadius=j.radius,nt.shadowMapSize=j.mapSize,n.directionalShadow[m]=nt,n.directionalShadowMap[m]=st,n.directionalShadowMatrix[m]=P.shadow.matrix,T++}n.directional[m]=q,m++}else if(P.isSpotLight){const q=t.get(P);q.position.setFromMatrixPosition(P.matrixWorld),q.color.copy(k).multiplyScalar(G),q.distance=V,q.coneCos=Math.cos(P.angle),q.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),q.decay=P.decay,n.spot[v]=q;const j=P.shadow;if(P.map&&(n.spotLightMap[y]=P.map,y++,j.updateMatrices(P),P.castShadow&&L++),n.spotLightMatrix[v]=j.matrix,P.castShadow){const nt=e.get(P);nt.shadowIntensity=j.intensity,nt.shadowBias=j.bias,nt.shadowNormalBias=j.normalBias,nt.shadowRadius=j.radius,nt.shadowMapSize=j.mapSize,n.spotShadow[v]=nt,n.spotShadowMap[v]=st,_++}v++}else if(P.isRectAreaLight){const q=t.get(P);q.color.copy(k).multiplyScalar(G),q.halfWidth.set(P.width*.5,0,0),q.halfHeight.set(0,P.height*.5,0),n.rectArea[E]=q,E++}else if(P.isPointLight){const q=t.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),q.distance=P.distance,q.decay=P.decay,P.castShadow){const j=P.shadow,nt=e.get(P);nt.shadowIntensity=j.intensity,nt.shadowBias=j.bias,nt.shadowNormalBias=j.normalBias,nt.shadowRadius=j.radius,nt.shadowMapSize=j.mapSize,nt.shadowCameraNear=j.camera.near,nt.shadowCameraFar=j.camera.far,n.pointShadow[p]=nt,n.pointShadowMap[p]=st,n.pointShadowMatrix[p]=P.shadow.matrix,A++}n.point[p]=q,p++}else if(P.isHemisphereLight){const q=t.get(P);q.skyColor.copy(P.color).multiplyScalar(G),q.groundColor.copy(P.groundColor).multiplyScalar(G),n.hemi[b]=q,b++}}E>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=bt.LTC_FLOAT_1,n.rectAreaLTC2=bt.LTC_FLOAT_2):(n.rectAreaLTC1=bt.LTC_HALF_1,n.rectAreaLTC2=bt.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=u,n.ambient[2]=h;const N=n.hash;(N.sunLength!==f||N.directionalLength!==m||N.pointLength!==p||N.spotLength!==v||N.rectAreaLength!==E||N.hemiLength!==b||N.numSunShadows!==g||N.numDirectionalShadows!==T||N.numPointShadows!==A||N.numSpotShadows!==_||N.numSpotMaps!==y||N.numLightProbes!==R)&&(n.sun.length=f,n.directional.length=m,n.spot.length=v,n.rectArea.length=E,n.point.length=p,n.hemi.length=b,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=x,n.sunShadowCascade.length=x,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.directionalShadowMatrix.length=T,n.pointShadow.length=A,n.pointShadowMap.length=A,n.pointShadowMatrix.length=A,n.spotShadow.length=_,n.spotShadowMap.length=_,n.spotLightMatrix.length=_+y-L,n.spotLightMap.length=y,n.numSpotLightShadowsWithMaps=L,n.numLightProbes=R,N.sunLength=f,N.directionalLength=m,N.pointLength=p,N.spotLength=v,N.rectAreaLength=E,N.hemiLength=b,N.numSunShadows=g,N.numDirectionalShadows=T,N.numPointShadows=A,N.numSpotShadows=_,N.numSpotMaps=y,N.numLightProbes=R,n.version=__++)}function c(l,d){let u=0,h=0,f=0,g=0,x=0,m=0;const p=d.matrixWorldInverse;for(let v=0,E=l.length;v<E;v++){const b=l[v];if(b.isSunLight){const T=n.sun[u];T.direction.setFromMatrixPosition(b.matrixWorld),T.direction.transformDirection(p),u++}else if(b.isDirectionalLight){const T=n.directional[h];T.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(p),h++}else if(b.isSpotLight){const T=n.spot[g];T.position.setFromMatrixPosition(b.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(p),g++}else if(b.isRectAreaLight){const T=n.rectArea[x];T.position.setFromMatrixPosition(b.matrixWorld),T.position.applyMatrix4(p),a.identity(),r.copy(b.matrixWorld),r.premultiply(p),a.extractRotation(r),T.halfWidth.set(b.width*.5,0,0),T.halfHeight.set(0,b.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),x++}else if(b.isPointLight){const T=n.point[f];T.position.setFromMatrixPosition(b.matrixWorld),T.position.applyMatrix4(p),f++}else if(b.isHemisphereLight){const T=n.hemi[m];T.direction.setFromMatrixPosition(b.matrixWorld),T.direction.transformDirection(p),m++}}}return{setup:o,setupView:c,state:n}}function qc(i){const t=new x_(i),e=[],n=[],s=[];function r(u){d.camera=u,e.length=0,n.length=0,s.length=0}function a(u){u.isLightProbeGrid?s.push(u):e.push(u)}function o(u){n.push(u)}function c(){t.setup(e),s.sort((u,h)=>u.priority-h.priority||u.id-h.id)}function l(u){t.setupView(e,u)}const d={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:l,pushLight:a,pushShadow:o}}function S_(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new qc(i),t.set(s,[o])):r>=a.length?(o=new qc(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const M_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,y_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,b_=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],E_=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],Yc=new Qt,ws=new I,Xa=new I;function T_(i,t,e){let n=new Gs;const s=new wt,r=new wt,a=new Me,o=new hf,c=new uf,l={},d=e.maxTextureSize,u={[Ci]:rn,[rn]:Ci,[cn]:cn},h=new Li({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new wt},radius:{value:4}},vertexShader:M_,fragmentShader:y_}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const g=new tn;g.setAttribute("position",new ei(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new un(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Br;let p=this.type;this.render=function(A,_,y){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;this.type===fu&&(Nt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Br);const L=i.getRenderTarget(),R=i.getActiveCubeFace(),N=i.getActiveMipmapLevel(),U=i.state;U.setBlending(ns),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const W=p!==this.type;W&&_.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(k=>k.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,k=A.length;P<k;P++){const G=A[P],V=G.shadow;if(V===void 0){Nt("WebGLShadowMap:",G,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const st=V.getFrameExtents();s.multiply(st),r.copy(V.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/st.x),s.x=r.x*st.x,V.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/st.y),s.y=r.y*st.y,V.mapSize.y=r.y));const q=i.state.buffers.depth.getReversed();if(V.camera._reversedDepth=q,V.map===null||W===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===Cs){if(G.isPointLight){Nt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new On(s.x,s.y,{format:Pi,type:zn,minFilter:sn,magFilter:sn,generateMipmaps:!1}),V.map.texture.name=G.name+".shadowMap",V.map.depthTexture=new cs(s.x,s.y,gn),V.map.depthTexture.name=G.name+".shadowMapDepth",V.map.depthTexture.format=gi,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=ke,V.map.depthTexture.magFilter=ke}else G.isPointLight?(V.map=new ul(s.x),V.map.depthTexture=new Dh(s.x,kn)):(V.map=new On(s.x,s.y),V.map.depthTexture=new cs(s.x,s.y,kn)),V.map.depthTexture.name=G.name+".shadowMap",V.map.depthTexture.format=gi,this.type===Br?(V.map.depthTexture.compareFunction=q?Sh:xh,V.map.depthTexture.minFilter=sn,V.map.depthTexture.magFilter=sn):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=ke,V.map.depthTexture.magFilter=ke);V.camera.updateProjectionMatrix()}V.map.isWebGLCubeRenderTarget!==!0&&(V.map.width!==s.x||V.map.height!==s.y)&&V.map.setSize(s.x,s.y);const j=V.map.isWebGLCubeRenderTarget?6:V.getViewportCount();G.isPointLight!==!0&&V.updateMatrices(G,y);const nt=(V.camera.layers.mask&4294967294)!==0?V.camera.layers:y.layers;for(let Rt=0;Rt<j;Rt++){const Vt=V.getCamera(Rt);if(G.isPointLight){const $=V.camera,Mt=V.matrix,At=G.distance||$.far;At!==$.far&&($.far=At,$.updateProjectionMatrix()),ws.setFromMatrixPosition(G.matrixWorld),$.position.copy(ws),Xa.copy($.position),Xa.add(b_[Rt]),$.up.copy(E_[Rt]),$.lookAt(Xa),$.updateMatrixWorld(),Mt.makeTranslation(-ws.x,-ws.y,-ws.z),Yc.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),V._frustum.setFromProjectionMatrix(Yc,$.coordinateSystem,$.reversedDepth)}if(V.map.isWebGLCubeRenderTarget)i.setRenderTarget(V.map,Rt),i.clear();else{Rt===0&&(i.setRenderTarget(V.map),i.clear());const $=V.getViewport(Rt);a.set(r.x*$.x,r.y*$.y,r.x*$.z,r.y*$.w),U.viewport(a)}n=V.getFrustum(Rt),b(_,y,Vt,G,nt,this.type)}V.isPointLightShadow!==!0&&this.type===Cs&&v(V,y),V.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(L,R,N)};function v(A,_){const y=t.update(x);h.defines.VSM_SAMPLES!==A.blurSamples&&(h.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null?A.mapPass=new On(s.x,s.y,{format:Pi,type:zn}):(A.mapPass.width!==A.map.width||A.mapPass.height!==A.map.height)&&A.mapPass.setSize(A.map.width,A.map.height),h.uniforms.shadow_pass.value=A.map.depthTexture,h.uniforms.resolution.value.set(A.map.width,A.map.height),h.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(_,null,y,h,x,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value.set(A.map.width,A.map.height),f.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(_,null,y,f,x,null)}function E(A,_,y,L){let R=null;const N=y.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(N!==void 0)R=N;else if(R=y.isPointLight===!0?c:o,i.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0||_.alphaToCoverage===!0){const U=R.uuid,W=_.uuid;let P=l[U];P===void 0&&(P={},l[U]=P);let k=P[W];k===void 0&&(k=R.clone(),P[W]=k,_.addEventListener("dispose",T)),R=k}if(R.visible=_.visible,R.wireframe=_.wireframe,L===Cs?R.side=_.shadowSide!==null?_.shadowSide:_.side:R.side=_.shadowSide!==null?_.shadowSide:u[_.side],R.alphaMap=_.alphaMap,R.alphaTest=_.alphaToCoverage===!0?.5:_.alphaTest,R.map=_.map,R.clipShadows=_.clipShadows,R.clippingPlanes=_.clippingPlanes,R.clipIntersection=_.clipIntersection,R.displacementMap=_.displacementMap,R.displacementScale=_.displacementScale,R.displacementBias=_.displacementBias,R.wireframeLinewidth=_.wireframeLinewidth,R.linewidth=_.linewidth,y.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const U=i.properties.get(R);U.light=y}return R}function b(A,_,y,L,R,N){if(A.visible===!1)return;if(A.layers.test(R)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&N===Cs)&&(!A.frustumCulled||A.intersectsFrustum(n))){A.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,A.matrixWorld);const P=t.update(A),k=A.material;if(Array.isArray(k)){const G=P.groups;for(let V=0,st=G.length;V<st;V++){const q=G[V],j=k[q.materialIndex];if(j&&j.visible){const nt=E(A,j,L,N);A.onBeforeShadow(i,A,_,y,P,nt,q),i.renderBufferDirect(y,null,P,nt,A,q),A.onAfterShadow(i,A,_,y,P,nt,q)}}}else if(k.visible){const G=E(A,k,L,N);A.onBeforeShadow(i,A,_,y,P,G,null),i.renderBufferDirect(y,null,P,G,A,null),A.onAfterShadow(i,A,_,y,P,G,null)}}const W=A.children;for(let P=0,k=W.length;P<k;P++)b(W[P],_,y,L,R,N)}function T(A){A.target.removeEventListener("dispose",T);for(const y in l){const L=l[y],R=A.target.uuid;R in L&&(L[R].dispose(),delete L[R])}}}function A_(i,t){function e(){let D=!1;const J=new Me;let K=null;const mt=new Me(0,0,0,0);return{setMask:function(ot){K!==ot&&!D&&(i.colorMask(ot,ot,ot,ot),K=ot)},setLocked:function(ot){D=ot},setClear:function(ot,gt,Lt,Wt,at){at===!0&&(ot*=Wt,gt*=Wt,Lt*=Wt),J.set(ot,gt,Lt,Wt),mt.equals(J)===!1&&(i.clearColor(ot,gt,Lt,Wt),mt.copy(J))},reset:function(){D=!1,K=null,mt.set(-1,0,0,0)}}}function n(){let D=!1,J=!1,K=null,mt=null,ot=null;return{setReversed:function(gt){if(J!==gt){const Lt=t.get("EXT_clip_control");gt?Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.ZERO_TO_ONE_EXT):Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.NEGATIVE_ONE_TO_ONE_EXT),J=gt;const Wt=ot;ot=null,this.setClear(Wt)}},getReversed:function(){return J},setTest:function(gt){gt?yt(i.DEPTH_TEST):et(i.DEPTH_TEST)},setMask:function(gt){K!==gt&&!D&&(i.depthMask(gt),K=gt)},setFunc:function(gt){if(J&&(gt=Zu[gt]),mt!==gt){switch(gt){case Za:i.depthFunc(i.NEVER);break;case $a:i.depthFunc(i.ALWAYS);break;case Ja:i.depthFunc(i.LESS);break;case Bs:i.depthFunc(i.LEQUAL);break;case Qa:i.depthFunc(i.EQUAL);break;case ja:i.depthFunc(i.GEQUAL);break;case to:i.depthFunc(i.GREATER);break;case eo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}mt=gt}},setLocked:function(gt){D=gt},setClear:function(gt){ot!==gt&&(ot=gt,J&&(gt=1-gt),i.clearDepth(gt))},reset:function(){D=!1,K=null,mt=null,ot=null,J=!1}}}function s(){let D=!1,J=null,K=null,mt=null,ot=null,gt=null,Lt=null,Wt=null,at=null;return{setTest:function(Ct){D||(Ct?yt(i.STENCIL_TEST):et(i.STENCIL_TEST))},setMask:function(Ct){J!==Ct&&!D&&(i.stencilMask(Ct),J=Ct)},setFunc:function(Ct,Xt,St){(K!==Ct||mt!==Xt||ot!==St)&&(i.stencilFunc(Ct,Xt,St),K=Ct,mt=Xt,ot=St)},setOp:function(Ct,Xt,St){(gt!==Ct||Lt!==Xt||Wt!==St)&&(i.stencilOp(Ct,Xt,St),gt=Ct,Lt=Xt,Wt=St)},setLocked:function(Ct){D=Ct},setClear:function(Ct){at!==Ct&&(i.clearStencil(Ct),at=Ct)},reset:function(){D=!1,J=null,K=null,mt=null,ot=null,gt=null,Lt=null,Wt=null,at=null}}}const r=new e,a=new n,o=new s;let c={};const l=new WeakMap;let d={},u={},h={},f=new WeakMap,g=[],x=null,m=!1,p=null,v=null,E=null,b=null,T=null,A=null,_=null,y=new Kt(0,0,0),L=0,R=!1,N=null,U=null,W=null,P=null,k=null;const G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,st=0;const q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(st=parseFloat(/^WebGL (\d)/.exec(q)[1]),V=st>=1):q.indexOf("OpenGL ES")!==-1&&(st=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),V=st>=2);let j=null,nt={};const Rt=i.getParameter(i.SCISSOR_BOX),Vt=i.getParameter(i.VIEWPORT),$=new Me().fromArray(Rt),Mt=new Me().fromArray(Vt);function At(D,J,K,mt){const ot=new Uint8Array(4),gt=i.createTexture();i.bindTexture(D,gt),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Lt=0;Lt<K;Lt++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(J,0,i.RGBA,1,1,mt,0,i.RGBA,i.UNSIGNED_BYTE,ot):i.texImage2D(J+Lt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ot);return gt}const Ut={};Ut[i.TEXTURE_2D]=At(i.TEXTURE_2D,i.TEXTURE_2D,1),Ut[i.TEXTURE_CUBE_MAP]=At(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ut[i.TEXTURE_2D_ARRAY]=At(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ut[i.TEXTURE_3D]=At(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),yt(i.DEPTH_TEST),a.setFunc(Bs),Ae(!1),jt(yl),yt(i.CULL_FACE),$t(ns);function yt(D){d[D]!==!0&&(i.enable(D),d[D]=!0)}function et(D){d[D]!==!1&&(i.disable(D),d[D]=!1)}function de(D,J){return h[D]!==J?(i.bindFramebuffer(D,J),h[D]=J,D===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=J),D===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=J),!0):!1}function It(D,J){let K=g,mt=!1;if(D){K=f.get(J),K===void 0&&(K=[],f.set(J,K));const ot=D.textures;if(K.length!==ot.length||K[0]!==i.COLOR_ATTACHMENT0){for(let gt=0,Lt=ot.length;gt<Lt;gt++)K[gt]=i.COLOR_ATTACHMENT0+gt;K.length=ot.length,mt=!0}}else K[0]!==i.BACK&&(K[0]=i.BACK,mt=!0);mt&&i.drawBuffers(K)}function le(D){return x!==D?(i.useProgram(D),x=D,!0):!1}const ce={[Qi]:i.FUNC_ADD,[mu]:i.FUNC_SUBTRACT,[gu]:i.FUNC_REVERSE_SUBTRACT};ce[_u]=i.MIN,ce[vu]=i.MAX;const Ft={[xu]:i.ZERO,[Su]:i.ONE,[Mu]:i.SRC_COLOR,[ih]:i.SRC_ALPHA,[wu]:i.SRC_ALPHA_SATURATE,[Tu]:i.DST_COLOR,[bu]:i.DST_ALPHA,[yu]:i.ONE_MINUS_SRC_COLOR,[sh]:i.ONE_MINUS_SRC_ALPHA,[Au]:i.ONE_MINUS_DST_COLOR,[Eu]:i.ONE_MINUS_DST_ALPHA,[Ru]:i.CONSTANT_COLOR,[Cu]:i.ONE_MINUS_CONSTANT_COLOR,[Pu]:i.CONSTANT_ALPHA,[Lu]:i.ONE_MINUS_CONSTANT_ALPHA};function $t(D,J,K,mt,ot,gt,Lt,Wt,at,Ct){if(D===ns){m===!0&&(et(i.BLEND),m=!1);return}if(m===!1&&(yt(i.BLEND),m=!0),D!==pu){if(D!==p||Ct!==R){if((v!==Qi||T!==Qi)&&(i.blendEquation(i.FUNC_ADD),v=Qi,T=Qi),Ct)switch(D){case Ns:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case bl:i.blendFunc(i.ONE,i.ONE);break;case El:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Tl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Gt("WebGLState: Invalid blending: ",D);break}else switch(D){case Ns:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case bl:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case El:Gt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Tl:Gt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Gt("WebGLState: Invalid blending: ",D);break}E=null,b=null,A=null,_=null,y.set(0,0,0),L=0,p=D,R=Ct}return}ot=ot||J,gt=gt||K,Lt=Lt||mt,(J!==v||ot!==T)&&(i.blendEquationSeparate(ce[J],ce[ot]),v=J,T=ot),(K!==E||mt!==b||gt!==A||Lt!==_)&&(i.blendFuncSeparate(Ft[K],Ft[mt],Ft[gt],Ft[Lt]),E=K,b=mt,A=gt,_=Lt),(Wt.equals(y)===!1||at!==L)&&(i.blendColor(Wt.r,Wt.g,Wt.b,at),y.copy(Wt),L=at),p=D,R=!1}function re(D,J){D.side===cn?et(i.CULL_FACE):yt(i.CULL_FACE);let K=D.side===rn;J&&(K=!K),Ae(K),D.blending===Ns&&D.transparent===!1?$t(ns):$t(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);const mt=D.stencilWrite;o.setTest(mt),mt&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),ve(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?yt(i.SAMPLE_ALPHA_TO_COVERAGE):et(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ae(D){N!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),N=D)}function jt(D){D!==uu?(yt(i.CULL_FACE),D!==U&&(D===yl?i.cullFace(i.BACK):D===du?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):et(i.CULL_FACE),U=D}function ne(D){D!==W&&(V&&i.lineWidth(D),W=D)}function ve(D,J,K){D?(yt(i.POLYGON_OFFSET_FILL),(P!==J||k!==K)&&(P=J,k=K,a.getReversed()&&(J=-J,K=-K),i.polygonOffset(J,K))):et(i.POLYGON_OFFSET_FILL)}function Fe(D){D?yt(i.SCISSOR_TEST):et(i.SCISSOR_TEST)}function Oe(D){D===void 0&&(D=i.TEXTURE0+G-1),j!==D&&(i.activeTexture(D),j=D)}function be(D,J,K){K===void 0&&(j===null?K=i.TEXTURE0+G-1:K=j);let mt=nt[K];mt===void 0&&(mt={type:void 0,texture:void 0},nt[K]=mt),(mt.type!==D||mt.texture!==J)&&(j!==K&&(i.activeTexture(K),j=K),i.bindTexture(D,J||Ut[D]),mt.type=D,mt.texture=J)}function F(){const D=nt[j];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function fe(){try{i.compressedTexImage2D(...arguments)}catch(D){Gt("WebGLState:",D)}}function Bt(){try{i.compressedTexImage3D(...arguments)}catch(D){Gt("WebGLState:",D)}}function te(){try{i.texSubImage2D(...arguments)}catch(D){Gt("WebGLState:",D)}}function ut(){try{i.texSubImage3D(...arguments)}catch(D){Gt("WebGLState:",D)}}function ye(){try{i.compressedTexSubImage2D(...arguments)}catch(D){Gt("WebGLState:",D)}}function Dt(){try{i.compressedTexSubImage3D(...arguments)}catch(D){Gt("WebGLState:",D)}}function kt(){try{i.texStorage2D(...arguments)}catch(D){Gt("WebGLState:",D)}}function w(){try{i.texStorage3D(...arguments)}catch(D){Gt("WebGLState:",D)}}function M(){try{i.texImage2D(...arguments)}catch(D){Gt("WebGLState:",D)}}function H(){try{i.texImage3D(...arguments)}catch(D){Gt("WebGLState:",D)}}function rt(D){return u[D]!==void 0?u[D]:i.getParameter(D)}function Q(D,J){u[D]!==J&&(i.pixelStorei(D,J),u[D]=J)}function ht(D){$.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),$.copy(D))}function ft(D){Mt.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),Mt.copy(D))}function Z(D,J){let K=l.get(J);K===void 0&&(K=new WeakMap,l.set(J,K));let mt=K.get(D);mt===void 0&&(mt=i.getUniformBlockIndex(J,D.name),i.uniformBlockBinding(J,mt,mt),K.set(D,mt))}function Y(D,J,K){const ot=l.get(J).get(D);c[ot]!==K&&(i.bindBufferBase(i.UNIFORM_BUFFER,ot,K),c[ot]=K)}function pt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),d={},u={},j=null,nt={},h={},c={},f=new WeakMap,g=[],x=null,m=!1,p=null,v=null,E=null,b=null,T=null,A=null,_=null,y=new Kt(0,0,0),L=0,R=!1,N=null,U=null,W=null,P=null,k=null,$.set(0,0,i.canvas.width,i.canvas.height),Mt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:yt,disable:et,bindFramebuffer:de,drawBuffers:It,useProgram:le,setBlending:$t,setMaterial:re,setFlipSided:Ae,setCullFace:jt,setLineWidth:ne,setPolygonOffset:ve,setScissorTest:Fe,activeTexture:Oe,bindTexture:be,unbindTexture:F,compressedTexImage2D:fe,compressedTexImage3D:Bt,texImage2D:M,texImage3D:H,pixelStorei:Q,getParameter:rt,updateUBOMapping:Z,uniformBlockBinding:Y,texStorage2D:kt,texStorage3D:w,texSubImage2D:te,texSubImage3D:ut,compressedTexSubImage2D:ye,compressedTexSubImage3D:Dt,scissor:ht,viewport:ft,reset:pt}}function w_(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new wt,d=new WeakMap,u=new Set;let h;const f=new WeakMap,g=new Set,x=new FinalizationRegistry(w=>g.delete(w));let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(w,M){return m?new OffscreenCanvas(w,M):Vs("canvas")}function v(w,M,H){let rt=1;const Q=kt(w);if((Q.width>H||Q.height>H)&&(rt=H/Math.max(Q.width,Q.height)),rt<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const ht=Math.floor(rt*Q.width),ft=Math.floor(rt*Q.height);h===void 0&&(h=p(ht,ft));const Z=M?p(ht,ft):h;return Z.width=ht,Z.height=ft,Z.getContext("2d").drawImage(w,0,0,ht,ft),Nt("WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+ht+"x"+ft+")."),Z}else return"data"in w&&Nt("WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),w;return w}function E(w){return w.generateMipmaps}function b(w){i.generateMipmap(w)}function T(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function A(w,M,H,rt,Q,ht=!1){if(w!==null){if(i[w]!==void 0)return i[w];Nt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let ft;rt&&(ft=t.get("EXT_texture_norm16"),ft||Nt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=M;if(M===i.RED&&(H===i.FLOAT&&(Z=i.R32F),H===i.HALF_FLOAT&&(Z=i.R16F),H===i.UNSIGNED_BYTE&&(Z=i.R8),H===i.UNSIGNED_SHORT&&ft&&(Z=ft.R16_EXT),H===i.SHORT&&ft&&(Z=ft.R16_SNORM_EXT)),M===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(Z=i.R8UI),H===i.UNSIGNED_SHORT&&(Z=i.R16UI),H===i.UNSIGNED_INT&&(Z=i.R32UI),H===i.BYTE&&(Z=i.R8I),H===i.SHORT&&(Z=i.R16I),H===i.INT&&(Z=i.R32I)),M===i.RG&&(H===i.FLOAT&&(Z=i.RG32F),H===i.HALF_FLOAT&&(Z=i.RG16F),H===i.UNSIGNED_BYTE&&(Z=i.RG8),H===i.UNSIGNED_SHORT&&ft&&(Z=ft.RG16_EXT),H===i.SHORT&&ft&&(Z=ft.RG16_SNORM_EXT)),M===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(Z=i.RG8UI),H===i.UNSIGNED_SHORT&&(Z=i.RG16UI),H===i.UNSIGNED_INT&&(Z=i.RG32UI),H===i.BYTE&&(Z=i.RG8I),H===i.SHORT&&(Z=i.RG16I),H===i.INT&&(Z=i.RG32I)),M===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),H===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),H===i.UNSIGNED_INT&&(Z=i.RGB32UI),H===i.BYTE&&(Z=i.RGB8I),H===i.SHORT&&(Z=i.RGB16I),H===i.INT&&(Z=i.RGB32I)),M===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),H===i.UNSIGNED_INT&&(Z=i.RGBA32UI),H===i.BYTE&&(Z=i.RGBA8I),H===i.SHORT&&(Z=i.RGBA16I),H===i.INT&&(Z=i.RGBA32I)),M===i.RGB&&(H===i.UNSIGNED_SHORT&&ft&&(Z=ft.RGB16_EXT),H===i.SHORT&&ft&&(Z=ft.RGB16_SNORM_EXT),H===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&(Z=i.R11F_G11F_B10F)),M===i.RGBA){const Y=ht?$r:ie.getTransfer(Q);H===i.FLOAT&&(Z=i.RGBA32F),H===i.HALF_FLOAT&&(Z=i.RGBA16F),H===i.UNSIGNED_BYTE&&(Z=Y===ge?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT&&ft&&(Z=ft.RGBA16_EXT),H===i.SHORT&&ft&&(Z=ft.RGBA16_SNORM_EXT),H===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function _(w,M){let H;return w?M===null||M===kn||M===os?H=i.DEPTH24_STENCIL8:M===gn?H=i.DEPTH32F_STENCIL8:M===zs&&(H=i.DEPTH24_STENCIL8,Nt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===kn||M===os?H=i.DEPTH_COMPONENT24:M===gn?H=i.DEPTH_COMPONENT32F:M===zs&&(H=i.DEPTH_COMPONENT16),H}function y(w,M){return E(w)===!0||w.isFramebufferTexture&&w.minFilter!==ke&&w.minFilter!==sn?Math.log2(Math.max(M.width,M.height))+1:w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?M.mipmaps.length:1}function L(w){const M=new WeakRef(w);n.get(w).__ref=M,g.add(M),x.register(w,M,M)}function R(w){const M=n.get(w).__ref;M!==void 0&&(g.delete(M),x.unregister(M))}function N(w){W(w.target)}function U(w){P(w.target)}function W(w){w.removeEventListener("dispose",N),R(w),G(w),w.isVideoTexture&&d.delete(w),w.isHTMLTexture&&u.delete(w)}function P(w){w.removeEventListener("dispose",U),R(w),st(w)}function k(){for(const w of g){const M=w.deref();M!==void 0&&(M.isRenderTarget===!0?P(M):W(M))}g.clear(),u.clear()}function G(w){const M=n.get(w);if(M.__webglInit===void 0)return;const H=w.source,rt=f.get(H);if(rt){const Q=rt[M.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&V(w),Object.keys(rt).length===0&&f.delete(H)}n.remove(w)}function V(w){const M=n.get(w);i.deleteTexture(M.__webglTexture);const H=w.source,rt=f.get(H);delete rt[M.__cacheKey],a.memory.textures--}function st(w){const M=n.get(w);M.__depthDisposeCallback&&M.__depthDisposeCallback();const H=w.depthTexture;if(H&&H.renderTarget===w&&W(H),w.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(M.__webglFramebuffer[Q]))for(let ht=0;ht<M.__webglFramebuffer[Q].length;ht++)i.deleteFramebuffer(M.__webglFramebuffer[Q][ht]);else i.deleteFramebuffer(M.__webglFramebuffer[Q]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[Q])}else{if(Array.isArray(M.__webglFramebuffer))for(let Q=0;Q<M.__webglFramebuffer.length;Q++)i.deleteFramebuffer(M.__webglFramebuffer[Q]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let Q=0;Q<M.__webglColorRenderbuffer.length;Q++)M.__webglColorRenderbuffer[Q]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[Q]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const rt=w.textures;for(let Q=0,ht=rt.length;Q<ht;Q++){const ft=n.get(rt[Q]);ft.__webglTexture&&(i.deleteTexture(ft.__webglTexture),a.memory.textures--),n.remove(rt[Q])}n.remove(w)}let q=0;function j(){q=0}function nt(){return q}function Rt(w){q=w}function Vt(){const w=q;return w>=s.maxTextures&&Nt("WebGLTextures: Trying to use "+(w+1)+" texture units while this GPU supports only "+s.maxTextures),q+=1,w}function $(w){const M=[];return M.push(w.wrapS),M.push(w.wrapT),M.push(w.wrapR||0),M.push(w.magFilter),M.push(w.minFilter),M.push(w.anisotropy),M.push(w.internalFormat),M.push(w.format),M.push(w.type),M.push(w.generateMipmaps),M.push(w.mipmapsAutoUpdate),M.push(w.premultiplyAlpha),M.push(w.flipY),M.push(w.unpackAlignment),M.push(w.colorSpace),M.join()}function Mt(w,M){const H=n.get(w);if(w.isVideoTexture&&ye(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&H.__version!==w.version){const rt=w.image;if(rt===null)Nt("WebGLRenderer: Texture marked for update but no image data found.");else if(rt.complete===!1)Nt("WebGLRenderer: Texture marked for update but image is incomplete");else{re(H,w,M);return}}else w.isExternalTexture&&(H.__webglTexture=w.sourceTexture?w.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+M)}function At(w,M){const H=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&H.__version!==w.version){re(H,w,M);return}else w.isExternalTexture&&(H.__webglTexture=w.sourceTexture?w.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+M)}function Ut(w,M){const H=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&H.__version!==w.version){re(H,w,M);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+M)}function yt(w,M){const H=n.get(w);if(w.version>0&&H.__version!==w.version){Ae(H,w,M);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+M)}const et={[no]:i.REPEAT,[$n]:i.CLAMP_TO_EDGE,[io]:i.MIRRORED_REPEAT},de={[ke]:i.NEAREST,[Uu]:i.NEAREST_MIPMAP_NEAREST,[sr]:i.NEAREST_MIPMAP_LINEAR,[sn]:i.LINEAR,[da]:i.LINEAR_MIPMAP_NEAREST,[di]:i.LINEAR_MIPMAP_LINEAR},It={[zu]:i.NEVER,[Mh]:i.ALWAYS,[Hu]:i.LESS,[xh]:i.LEQUAL,[Vu]:i.EQUAL,[Sh]:i.GEQUAL,[Gu]:i.GREATER,[Wu]:i.NOTEQUAL};function le(w,M){if(M.type===gn&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===sn||M.magFilter===da||M.magFilter===sr||M.magFilter===di||M.minFilter===sn||M.minFilter===da||M.minFilter===sr||M.minFilter===di)&&Nt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,et[M.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,et[M.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,et[M.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,de[M.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,de[M.minFilter]),M.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,It[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===ke||M.minFilter!==sr&&M.minFilter!==di||M.type===gn&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(w,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function ce(w,M){let H=!1;w.__webglInit===void 0&&(w.__webglInit=!0,M.addEventListener("dispose",N),L(M));const rt=M.source;let Q=f.get(rt);Q===void 0&&(Q={},f.set(rt,Q));const ht=$(M);if(ht!==w.__cacheKey){Q[ht]===void 0&&(Q[ht]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,H=!0),Q[ht].usedTimes++;const ft=Q[w.__cacheKey];ft!==void 0&&(Q[w.__cacheKey].usedTimes--,ft.usedTimes===0&&V(M)),w.__cacheKey=ht,w.__webglTexture=Q[ht].texture}return H}function Ft(w,M,H){return Math.floor(Math.floor(w/H)/M)}function $t(w,M,H,rt){const ht=w.updateRanges;if(ht.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,M.width,M.height,H,rt,M.data);else{ht.sort((D,J)=>D.start-J.start);let ft=0;for(let D=1;D<ht.length;D++){const J=ht[ft],K=ht[D],mt=J.start+J.count,ot=Ft(K.start,M.width,4),gt=Ft(J.start,M.width,4);K.start<=mt+1&&ot===gt&&Ft(K.start+K.count-1,M.width,4)===ot?J.count=Math.max(J.count,K.start+K.count-J.start):(++ft,ht[ft]=K)}ht.length=ft+1;const Z=e.getParameter(i.UNPACK_ROW_LENGTH),Y=e.getParameter(i.UNPACK_SKIP_PIXELS),pt=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,M.width);for(let D=0,J=ht.length;D<J;D++){const K=ht[D],mt=Math.floor(K.start/4),ot=Math.ceil(K.count/4),gt=mt%M.width,Lt=Math.floor(mt/M.width),Wt=ot,at=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,gt),e.pixelStorei(i.UNPACK_SKIP_ROWS,Lt),e.texSubImage2D(i.TEXTURE_2D,0,gt,Lt,Wt,at,H,rt,M.data)}w.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,Z),e.pixelStorei(i.UNPACK_SKIP_PIXELS,Y),e.pixelStorei(i.UNPACK_SKIP_ROWS,pt)}}function re(w,M,H){let rt=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(rt=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(rt=i.TEXTURE_3D);const Q=ce(w,M),ht=M.source;e.bindTexture(rt,w.__webglTexture,i.TEXTURE0+H);const ft=n.get(ht);if(ht.version!==ft.__version||Q===!0){if(e.activeTexture(i.TEXTURE0+H),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){const at=ie.getPrimaries(ie.workingColorSpace),Ct=M.colorSpace===ui?null:ie.getPrimaries(M.colorSpace),Xt=M.colorSpace===ui||at===Ct?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xt)}e.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment);let Y=v(M.image,!1,s.maxTextureSize);Y=Dt(M,Y);const pt=r.convert(M.format,M.colorSpace),D=r.convert(M.type);let J=A(M.internalFormat,pt,D,M.normalized,M.colorSpace,M.isVideoTexture);le(rt,M);let K;const mt=M.mipmaps,ot=M.isVideoTexture!==!0,gt=ft.__version===void 0||Q===!0,Lt=ht.dataReady,Wt=y(M,Y);if(M.isDepthTexture)J=_(M.format===fi,M.type),gt&&(ot?e.texStorage2D(i.TEXTURE_2D,1,J,Y.width,Y.height):e.texImage2D(i.TEXTURE_2D,0,J,Y.width,Y.height,0,pt,D,null));else if(M.isDataTexture)if(mt.length>0){ot&&gt&&e.texStorage2D(i.TEXTURE_2D,Wt,J,mt[0].width,mt[0].height);for(let at=0,Ct=mt.length;at<Ct;at++)K=mt[at],ot?Lt&&e.texSubImage2D(i.TEXTURE_2D,at,0,0,K.width,K.height,pt,D,K.data):e.texImage2D(i.TEXTURE_2D,at,J,K.width,K.height,0,pt,D,K.data);M.generateMipmaps=!1}else ot?(gt&&e.texStorage2D(i.TEXTURE_2D,Wt,J,Y.width,Y.height),Lt&&$t(M,Y,pt,D)):e.texImage2D(i.TEXTURE_2D,0,J,Y.width,Y.height,0,pt,D,Y.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){ot&&gt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Wt,J,mt[0].width,mt[0].height,Y.depth);for(let at=0,Ct=mt.length;at<Ct;at++)if(K=mt[at],M.format!==bn)if(pt!==null)if(ot){if(Lt)if(M.layerUpdates.size>0){const Xt=Ac(K.width,K.height,M.format,M.type);for(const St of M.layerUpdates){const oe=K.data.subarray(St*Xt/K.data.BYTES_PER_ELEMENT,(St+1)*Xt/K.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,at,0,0,St,K.width,K.height,1,pt,oe)}}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,at,0,0,0,K.width,K.height,Y.depth,pt,K.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,at,J,K.width,K.height,Y.depth,0,K.data,0,0);else Nt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ot?Lt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,at,0,0,0,K.width,K.height,Y.depth,pt,D,K.data):e.texImage3D(i.TEXTURE_2D_ARRAY,at,J,K.width,K.height,Y.depth,0,pt,D,K.data);M.layerUpdates.size>0&&M.clearLayerUpdates()}else{ot&&gt&&e.texStorage2D(i.TEXTURE_2D,Wt,J,mt[0].width,mt[0].height);for(let at=0,Ct=mt.length;at<Ct;at++)K=mt[at],M.format!==bn?pt!==null?ot?Lt&&e.compressedTexSubImage2D(i.TEXTURE_2D,at,0,0,K.width,K.height,pt,K.data):e.compressedTexImage2D(i.TEXTURE_2D,at,J,K.width,K.height,0,K.data):Nt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ot?Lt&&e.texSubImage2D(i.TEXTURE_2D,at,0,0,K.width,K.height,pt,D,K.data):e.texImage2D(i.TEXTURE_2D,at,J,K.width,K.height,0,pt,D,K.data)}else if(M.isDataArrayTexture)if(ot){if(gt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Wt,J,Y.width,Y.height,Y.depth),Lt)if(M.layerUpdates.size>0){const at=Ac(Y.width,Y.height,M.format,M.type);for(const Ct of M.layerUpdates){const Xt=Y.data.subarray(Ct*at/Y.data.BYTES_PER_ELEMENT,(Ct+1)*at/Y.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Ct,Y.width,Y.height,1,pt,D,Xt)}M.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Y.width,Y.height,Y.depth,pt,D,Y.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,J,Y.width,Y.height,Y.depth,0,pt,D,Y.data);else if(M.isData3DTexture)ot?(gt&&e.texStorage3D(i.TEXTURE_3D,Wt,J,Y.width,Y.height,Y.depth),Lt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Y.width,Y.height,Y.depth,pt,D,Y.data)):e.texImage3D(i.TEXTURE_3D,0,J,Y.width,Y.height,Y.depth,0,pt,D,Y.data);else if(M.isFramebufferTexture){if(gt)if(ot)e.texStorage2D(i.TEXTURE_2D,Wt,J,Y.width,Y.height);else{let at=Y.width,Ct=Y.height;for(let Xt=0;Xt<Wt;Xt++)e.texImage2D(i.TEXTURE_2D,Xt,J,at,Ct,0,pt,D,null),at>>=1,Ct>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in i){const at=i.canvas;if(at.hasAttribute("layoutsubtree")||at.setAttribute("layoutsubtree","true"),Y.parentNode!==at){at.appendChild(Y),u.add(M),at.onpaint=Ct=>{const Xt=Ct.changedElements;for(const St of u)Xt.includes(St.image)&&(St.needsUpdate=!0)},at.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,Y);else{const Xt=i.RGBA,St=i.RGBA,oe=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Xt,St,oe,Y)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(mt.length>0){if(ot&&gt){const at=kt(mt[0]);e.texStorage2D(i.TEXTURE_2D,Wt,J,at.width,at.height)}for(let at=0,Ct=mt.length;at<Ct;at++)K=mt[at],ot?Lt&&e.texSubImage2D(i.TEXTURE_2D,at,0,0,pt,D,K):e.texImage2D(i.TEXTURE_2D,at,J,pt,D,K);M.generateMipmaps=!1}else if(ot){if(gt){const at=kt(Y);e.texStorage2D(i.TEXTURE_2D,Wt,J,at.width,at.height)}Lt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,pt,D,Y)}else e.texImage2D(i.TEXTURE_2D,0,J,pt,D,Y);E(M)&&M.mipmapsAutoUpdate===!0&&b(rt),ft.__version=ht.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function Ae(w,M,H){if(M.image.length!==6)return;const rt=ce(w,M),Q=M.source;e.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+H);const ht=n.get(Q);if(Q.version!==ht.__version||rt===!0){e.activeTexture(i.TEXTURE0+H);const ft=ie.getPrimaries(ie.workingColorSpace),Z=M.colorSpace===ui?null:ie.getPrimaries(M.colorSpace),Y=M.colorSpace===ui||ft===Z?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Y);const pt=M.isCompressedTexture||M.image[0].isCompressedTexture,D=M.image[0]&&M.image[0].isDataTexture,J=[];for(let St=0;St<6;St++)!pt&&!D?J[St]=v(M.image[St],!0,s.maxCubemapSize):J[St]=D?M.image[St].image:M.image[St],J[St]=Dt(M,J[St]);const K=J[0],mt=r.convert(M.format,M.colorSpace),ot=r.convert(M.type);let gt=A(M.internalFormat,mt,ot,M.normalized,M.colorSpace);const Lt=M.isVideoTexture!==!0,Wt=ht.__version===void 0||rt===!0,at=Q.dataReady;let Ct=y(M,K);le(i.TEXTURE_CUBE_MAP,M);let Xt;if(M.isDepthTexture){if(gt=_(M.format===fi,M.type),Wt)if(Lt)e.texStorage2D(i.TEXTURE_CUBE_MAP,1,gt,K.width,K.height);else for(let St=0;St<6;St++)e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+St,0,gt,K.width,K.height,0,mt,ot,null)}else if(pt){Lt&&Wt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Ct,gt,K.width,K.height);for(let St=0;St<6;St++){Xt=J[St].mipmaps;for(let oe=0;oe<Xt.length;oe++){const pe=Xt[oe];M.format!==bn?mt!==null?Lt?at&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+St,oe,0,0,pe.width,pe.height,mt,pe.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+St,oe,gt,pe.width,pe.height,0,pe.data):Nt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Lt?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+St,oe,0,0,pe.width,pe.height,mt,ot,pe.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+St,oe,gt,pe.width,pe.height,0,mt,ot,pe.data)}}}else{if(Xt=M.mipmaps,Lt&&Wt){Xt.length>0&&Ct++;const St=kt(J[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Ct,gt,St.width,St.height)}for(let St=0;St<6;St++)if(D){Lt?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+St,0,0,0,J[St].width,J[St].height,mt,ot,J[St].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+St,0,gt,J[St].width,J[St].height,0,mt,ot,J[St].data);for(let oe=0;oe<Xt.length;oe++){const _n=Xt[oe].image[St].image;Lt?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+St,oe+1,0,0,_n.width,_n.height,mt,ot,_n.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+St,oe+1,gt,_n.width,_n.height,0,mt,ot,_n.data)}}else{Lt?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+St,0,0,0,mt,ot,J[St]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+St,0,gt,mt,ot,J[St]);for(let oe=0;oe<Xt.length;oe++){const pe=Xt[oe];Lt?at&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+St,oe+1,0,0,mt,ot,pe.image[St]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+St,oe+1,gt,mt,ot,pe.image[St])}}}E(M)&&M.mipmapsAutoUpdate===!0&&b(i.TEXTURE_CUBE_MAP),ht.__version=Q.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function jt(w,M,H,rt,Q,ht){const ft=r.convert(H.format,H.colorSpace),Z=r.convert(H.type),Y=A(H.internalFormat,ft,Z,H.normalized,H.colorSpace),pt=n.get(M),D=n.get(H);if(D.__renderTarget=M,!pt.__hasExternalTextures){const J=Math.max(1,M.width>>ht),K=Math.max(1,M.height>>ht);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?e.texImage3D(Q,ht,Y,J,K,M.depth,0,ft,Z,null):e.texImage2D(Q,ht,Y,J,K,0,ft,Z,null)}e.bindFramebuffer(i.FRAMEBUFFER,w),ut(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,rt,Q,D.__webglTexture,0,te(M)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,rt,Q,D.__webglTexture,ht),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ne(w,M,H){if(i.bindRenderbuffer(i.RENDERBUFFER,w),M.depthBuffer){const rt=M.depthTexture,Q=rt&&rt.isDepthTexture?rt.type:null,ht=_(M.stencilBuffer,Q),ft=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;ut(M)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,te(M),ht,M.width,M.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,te(M),ht,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,ht,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ft,i.RENDERBUFFER,w)}else{const rt=M.textures;for(let Q=0;Q<rt.length;Q++){const ht=rt[Q],ft=r.convert(ht.format,ht.colorSpace),Z=r.convert(ht.type),Y=A(ht.internalFormat,ft,Z,ht.normalized,ht.colorSpace);ut(M)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,te(M),Y,M.width,M.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,te(M),Y,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,Y,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ve(w,M,H){const rt=M.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,w),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const Q=n.get(M.depthTexture);Q.__renderTarget=M;const ht=rt?M.depthTexture.image[0]:M.depthTexture.image;(!Q.__webglTexture||ht.width!==M.width||ht.height!==M.height)&&(ht.width=M.width,ht.height=M.height,M.depthTexture.needsUpdate=!0),rt?yt(M.depthTexture,0):Mt(M.depthTexture,0);const ft=Q.__webglTexture,Z=te(M),Y=rt?i.TEXTURE_CUBE_MAP_POSITIVE_X+H:i.TEXTURE_2D,pt=M.depthTexture.format===fi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(M.depthTexture.format===gi)ut(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,pt,Y,ft,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,pt,Y,ft,0);else if(M.depthTexture.format===fi)ut(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,pt,Y,ft,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,pt,Y,ft,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Fe(w){const M=n.get(w),H=w.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==w.depthTexture){const rt=w.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),rt){const Q=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,rt.removeEventListener("dispose",Q)};rt.addEventListener("dispose",Q),M.__depthDisposeCallback=Q}M.__boundDepthTexture=rt}if(w.depthTexture&&!M.__autoAllocateDepthBuffer)if(H)for(let rt=0;rt<6;rt++)ve(M.__webglFramebuffer[rt],w,rt);else w.texture.mipmaps.length>0?ve(M.__webglFramebuffer[0],w,0):ve(M.__webglFramebuffer,w,0);else if(H){M.__webglDepthbuffer=[];for(let rt=0;rt<6;rt++)if(e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[rt]),M.__webglDepthbuffer[rt]===void 0)M.__webglDepthbuffer[rt]=i.createRenderbuffer(),ne(M.__webglDepthbuffer[rt],w,!1);else{const Q=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ht=M.__webglDepthbuffer[rt];i.bindRenderbuffer(i.RENDERBUFFER,ht),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,ht)}}else if(w.texture.mipmaps.length>0?e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),ne(M.__webglDepthbuffer,w,!1);else{const Q=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ht=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ht),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,ht)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Oe(w,M,H){const rt=n.get(w);M!==void 0&&jt(rt.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&Fe(w)}function be(w){const M=w.texture,H=n.get(w),rt=n.get(M);w.addEventListener("dispose",U),L(w);const Q=w.textures,ht=w.isWebGLCubeRenderTarget===!0,ft=Q.length>1;if(ft||(rt.__webglTexture===void 0&&(rt.__webglTexture=i.createTexture()),rt.__version=M.version,a.memory.textures++),ht){H.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(M.mipmaps.length>0){H.__webglFramebuffer[Z]=[];for(let Y=0;Y<M.mipmaps.length;Y++)H.__webglFramebuffer[Z][Y]=i.createFramebuffer()}else H.__webglFramebuffer[Z]=i.createFramebuffer()}else{if(M.mipmaps.length>0){H.__webglFramebuffer=[];for(let Z=0;Z<M.mipmaps.length;Z++)H.__webglFramebuffer[Z]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(ft)for(let Z=0,Y=Q.length;Z<Y;Z++){const pt=n.get(Q[Z]);pt.__webglTexture===void 0&&(pt.__webglTexture=i.createTexture(),a.memory.textures++)}if(w.samples>0&&ut(w)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let Z=0;Z<Q.length;Z++){const Y=Q[Z];H.__webglColorRenderbuffer[Z]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[Z]);const pt=r.convert(Y.format,Y.colorSpace),D=r.convert(Y.type),J=A(Y.internalFormat,pt,D,Y.normalized,Y.colorSpace,w.isXRRenderTarget===!0),K=te(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,K,J,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Z,i.RENDERBUFFER,H.__webglColorRenderbuffer[Z])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),ne(H.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ht){e.bindTexture(i.TEXTURE_CUBE_MAP,rt.__webglTexture),le(i.TEXTURE_CUBE_MAP,M);for(let Z=0;Z<6;Z++)if(M.mipmaps.length>0)for(let Y=0;Y<M.mipmaps.length;Y++)jt(H.__webglFramebuffer[Z][Y],w,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Y);else jt(H.__webglFramebuffer[Z],w,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);E(M)?b(i.TEXTURE_CUBE_MAP):M.mipmaps.length>0&&i.texParameteri(i.TEXTURE_CUBE_MAP,i.TEXTURE_MAX_LEVEL,M.mipmaps.length-1),e.unbindTexture()}else if(ft){for(let Z=0,Y=Q.length;Z<Y;Z++){const pt=Q[Z],D=n.get(pt);let J=i.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(J=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(J,D.__webglTexture),le(J,pt),jt(H.__webglFramebuffer,w,pt,i.COLOR_ATTACHMENT0+Z,J,0),E(pt)&&b(J)}e.unbindTexture()}else{let Z=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(Z=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Z,rt.__webglTexture),le(Z,M),M.mipmaps.length>0)for(let Y=0;Y<M.mipmaps.length;Y++)jt(H.__webglFramebuffer[Y],w,M,i.COLOR_ATTACHMENT0,Z,Y);else jt(H.__webglFramebuffer,w,M,i.COLOR_ATTACHMENT0,Z,0);E(M)?b(Z):M.mipmaps.length>0&&i.texParameteri(Z,i.TEXTURE_MAX_LEVEL,M.mipmaps.length-1),e.unbindTexture()}w.depthBuffer&&Fe(w)}function F(w){const M=w.textures;for(let H=0,rt=M.length;H<rt;H++){const Q=M[H];if(E(Q)&&Q.mipmapsAutoUpdate===!0){const ht=T(w),ft=n.get(Q).__webglTexture;e.bindTexture(ht,ft),b(ht),e.unbindTexture()}}}const fe=[];function Bt(w){if(w.samples>0){if(ut(w)===!1){const M=w.textures,H=w.width,rt=w.height;let Q=i.COLOR_BUFFER_BIT;const ht=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ft=n.get(w),Z=M.length>1;if(Z)for(let pt=0;pt<M.length;pt++)e.bindFramebuffer(i.FRAMEBUFFER,ft.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,ft.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+pt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,ft.__webglMultisampledFramebuffer),w.texture.mipmaps.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ft.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ft.__webglFramebuffer);for(let pt=0;pt<M.length;pt++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),Z){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ft.__webglColorRenderbuffer[pt]);const D=n.get(M[pt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,D,0)}i.blitFramebuffer(0,0,H,rt,0,0,H,rt,Q,i.NEAREST),c===!0&&(fe.length=0,fe.push(i.COLOR_ATTACHMENT0+pt),w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&fe.push(ht),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,fe))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Z)for(let pt=0;pt<M.length;pt++){e.bindFramebuffer(i.FRAMEBUFFER,ft.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pt,i.RENDERBUFFER,ft.__webglColorRenderbuffer[pt]);const D=n.get(M[pt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,ft.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+pt,i.TEXTURE_2D,D,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ft.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&c){const M=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function te(w){return Math.min(s.maxSamples,w.samples)}function ut(w){const M=n.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function ye(w){const M=a.render.frame;d.get(w)!==M&&(d.set(w,M),w.update())}function Dt(w,M){const H=w.colorSpace,rt=w.format,Q=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||H!==Zr&&H!==ui&&(ie.getTransfer(H)===ge?(rt!==bn||Q!==hn)&&Nt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Gt("WebGLTextures: Unsupported texture color space:",H)),M}function kt(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(l.width=w.naturalWidth||w.width,l.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(l.width=w.displayWidth,l.height=w.displayHeight):(l.width=w.width,l.height=w.height),l}this.allocateTextureUnit=Vt,this.resetTextureUnits=j,this.getTextureUnits=nt,this.setTextureUnits=Rt,this.setTexture2D=Mt,this.setTexture2DArray=At,this.setTexture3D=Ut,this.setTextureCube=yt,this.rebindTextures=Oe,this.setupRenderTarget=be,this.updateRenderTargetMipmap=F,this.updateMultisampleRenderTarget=Bt,this.setupDepthRenderbuffer=Fe,this.setupFrameBufferTexture=jt,this.useMultisampledRTT=ut,this.dispose=k}function R_(i,t){function e(n,s=ui){let r;const a=ie.getTransfer(s);if(n===hn)return i.UNSIGNED_BYTE;if(n===Wo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Xo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===mh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===gh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===fh)return i.BYTE;if(n===ph)return i.SHORT;if(n===zs)return i.UNSIGNED_SHORT;if(n===Go)return i.INT;if(n===kn)return i.UNSIGNED_INT;if(n===gn)return i.FLOAT;if(n===zn)return i.HALF_FLOAT;if(n===_h)return i.ALPHA;if(n===vh)return i.RGB;if(n===bn)return i.RGBA;if(n===gi)return i.DEPTH_COMPONENT;if(n===fi)return i.DEPTH_STENCIL;if(n===qo)return i.RED;if(n===Yo)return i.RED_INTEGER;if(n===Pi)return i.RG;if(n===Ko)return i.RG_INTEGER;if(n===Zo)return i.RGBA_INTEGER;if(n===kr||n===zr||n===Hr||n===Vr)if(a===ge)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===kr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===zr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===kr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===zr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Vr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===so||n===ro||n===ao||n===oo)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===so)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ro)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ao)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===oo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===lo||n===co||n===ho||n===uo||n===fo||n===qr||n===po)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===lo||n===co)return a===ge?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ho)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===uo)return r.COMPRESSED_R11_EAC;if(n===fo)return r.COMPRESSED_SIGNED_R11_EAC;if(n===qr)return r.COMPRESSED_RG11_EAC;if(n===po)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===mo||n===go||n===_o||n===vo||n===xo||n===So||n===Mo||n===yo||n===bo||n===Eo||n===To||n===Ao||n===wo||n===Ro)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===mo)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===go)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===_o)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===vo)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===xo)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===So)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Mo)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===yo)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===bo)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Eo)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===To)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ao)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===wo)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ro)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Co||n===Po||n===Lo)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Co)return a===ge?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Po)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Lo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Do||n===No||n===Yr||n===Io)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Do)return r.COMPRESSED_RED_RGTC1_EXT;if(n===No)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Yr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Io)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===os?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const C_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,P_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class L_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Nh(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Li({vertexShader:C_,fragmentShader:P_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new un(new ra(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class D_ extends xi{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,d=null,u=null,h=null,f=null,g=null;const x=typeof XRWebGLBinding<"u",m=new L_,p={},v=e.getContextAttributes();let E=null,b=null;const T=[],A=[],_=new wt;let y=null,L=null;const R=new ln;R.viewport=new Me;const N=new ln;N.viewport=new Me;const U=[R,N],W=new Nf;let P=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let Mt=T[$];return Mt===void 0&&(Mt=new Sa,T[$]=Mt),Mt.getTargetRaySpace()},this.getControllerGrip=function($){let Mt=T[$];return Mt===void 0&&(Mt=new Sa,T[$]=Mt),Mt.getGripSpace()},this.getHand=function($){let Mt=T[$];return Mt===void 0&&(Mt=new Sa,T[$]=Mt),Mt.getHandSpace()};function G($){const Mt=A.indexOf($.inputSource);if(Mt===-1)return;const At=T[Mt];At!==void 0&&(At.update($.inputSource,$.frame,l||a),At.dispatchEvent({type:$.type,data:$.inputSource}))}function V(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",V),s.removeEventListener("inputsourceschange",st);for(let $=0;$<T.length;$++){const Mt=A[$];Mt!==null&&(A[$]=null,T[$].disconnect(Mt))}P=null,k=null,m.reset();for(const $ in p)delete p[$];if(t.setRenderTarget(E),f=null,h=null,u=null,s=null,b=null,Vt.stop(),n.isPresenting=!1,t.setPixelRatio(y),t.setSize(_.width,_.height,!1),L!==null){const $=L.camera;$.fov=L.fov,$.zoom=L.zoom,$.updateProjectionMatrix(),L=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&Nt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&Nt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function($){l=$},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(E=t.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",V),s.addEventListener("inputsourceschange",st),v.xrCompatible!==!0&&await e.makeXRCompatible(),y=t.getPixelRatio(),t.getSize(_),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let At=null,Ut=null,yt=null;v.depth&&(yt=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,At=v.stencil?fi:gi,Ut=v.stencil?os:kn);const et={colorFormat:e.RGBA8,depthFormat:yt,scaleFactor:r};u=this.getBinding(),h=u.createProjectionLayer(et),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),b=new On(h.textureWidth,h.textureHeight,{format:bn,type:hn,depthTexture:new cs(h.textureWidth,h.textureHeight,Ut,void 0,void 0,void 0,void 0,void 0,void 0,At),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{const At={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,At),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new On(f.framebufferWidth,f.framebufferHeight,{format:bn,type:hn,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),Vt.setContext(s),Vt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function st($){for(let Mt=0;Mt<$.removed.length;Mt++){const At=$.removed[Mt],Ut=A.indexOf(At);Ut>=0&&(A[Ut]=null,T[Ut].disconnect(At))}for(let Mt=0;Mt<$.added.length;Mt++){const At=$.added[Mt];let Ut=A.indexOf(At);if(Ut===-1){for(let et=0;et<T.length;et++)if(et>=A.length){A.push(At),Ut=et;break}else if(A[et]===null){A[et]=At,Ut=et;break}if(Ut===-1)break}const yt=T[Ut];yt&&yt.connect(At)}}function q($,Mt){Mt===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(Mt.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let Mt=$.near,At=$.far;m.texture!==null&&(m.depthNear>0&&(Mt=m.depthNear),m.depthFar>0&&(At=m.depthFar)),W.near=N.near=R.near=Mt,W.far=N.far=R.far=At,(P!==W.near||k!==W.far)&&(s.updateRenderState({depthNear:W.near,depthFar:W.far}),P=W.near,k=W.far),W.layers.mask=$.layers.mask|6,R.layers.mask=W.layers.mask&-5,N.layers.mask=W.layers.mask&-3;const Ut=$.parent,yt=W.cameras;q(W,Ut);for(let et=0;et<yt.length;et++)q(yt[et],Ut);W.projectionMatrix.copy(R.projectionMatrix),W.projectionMatrixInverse.copy(R.projectionMatrixInverse),L===null&&$.isPerspectiveCamera&&(L={camera:$,fov:$.fov,zoom:$.zoom}),j($,W,Ut)};function j($,Mt,At){At===null?$.matrix.copy(Mt.matrixWorld):($.matrix.copy(At.matrixWorld),$.matrix.invert(),$.matrix.multiply(Mt.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(Mt.projectionMatrix),$.projectionMatrixInverse.copy(Mt.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=ls*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return W},this.getFoveation=function(){if(!(h===null&&f===null))return c},this.setFoveation=function($){c=$,h!==null&&(h.fixedFoveation=$),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=$)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(W)},this.getCameraTexture=function($){return p[$]};let nt=null;function Rt($,Mt){if(d=Mt.getViewerPose(l||a),g=Mt,d!==null){const At=d.views;f!==null&&(t.setRenderTargetFramebuffer(b,f.framebuffer),t.setRenderTarget(b));let Ut=!1;At.length!==W.cameras.length&&(W.cameras.length=0,Ut=!0);for(let It=0;It<At.length;It++){const le=At[It];let ce=null;if(f!==null)ce=f.getViewport(le);else{const $t=u.getViewSubImage(h,le);ce=$t.viewport,It===0&&(t.setRenderTargetTextures(b,$t.colorTexture,$t.depthStencilTexture),t.setRenderTarget(b))}let Ft=U[It];Ft===void 0&&(Ft=new ln,Ft.layers.enable(It),Ft.viewport=new Me,U[It]=Ft),Ft.matrix.fromArray(le.transform.matrix),Ft.matrix.decompose(Ft.position,Ft.quaternion,Ft.scale),Ft.projectionMatrix.fromArray(le.projectionMatrix),Ft.projectionMatrixInverse.copy(Ft.projectionMatrix).invert(),Ft.viewport.set(ce.x,ce.y,ce.width,ce.height),It===0&&(W.matrix.copy(Ft.matrix),W.matrix.decompose(W.position,W.quaternion,W.scale)),Ut===!0&&W.cameras.push(Ft)}const yt=s.enabledFeatures;if(yt&&yt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=n.getBinding();const It=u.getDepthInformation(At[0]);It&&It.isValid&&It.texture&&m.init(It,s.renderState)}if(yt&&yt.includes("camera-access")&&x){t.state.unbindTexture(),u=n.getBinding();for(let It=0;It<At.length;It++){const le=At[It].camera;if(le){let ce=p[le];ce||(ce=new Nh,p[le]=ce);const Ft=u.getCameraImage(le);ce.sourceTexture=Ft}}}}for(let At=0;At<T.length;At++){const Ut=A[At],yt=T[At];Ut!==null&&yt!==void 0&&yt.update(Ut,Mt,l||a)}nt&&nt($,Mt),Mt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Mt}),g=null}const Vt=new Gh;Vt.setAnimationLoop(Rt),this.setAnimationLoop=function($){nt=$},this.dispose=function(){}}}const N_=new Qt,jh=new qt;jh.set(-1,0,0,0,1,0,0,0,1);function I_(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Fh(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,v,E,b){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),d(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),h(m,p),p.isMeshPhysicalMaterial&&f(m,p,b)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),x(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,v,E):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===rn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===rn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const v=t.get(p),E=v.envMap,b=v.envMapRotation;E&&(m.envMap.value=E,m.envMapRotation.value.setFromMatrix4(N_.makeRotationFromEuler(b)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(jh),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,v,E){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*v,m.scale.value=E*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function d(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,v){m.ior.value=p.ior,p.diffuseRoughness>0&&(m.diffuseRoughness.value=p.diffuseRoughness,p.diffuseRoughnessMap&&(m.diffuseRoughnessMap.value=p.diffuseRoughnessMap,e(p.diffuseRoughnessMap,m.diffuseRoughnessMapTransform))),p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===rn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessMinimum,m.iridescenceThicknessMaximum.value=p.iridescenceThicknessMaximum,p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){const v=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function U_(i,t,e,n){let s={},r={};function a(v,E){const b=E.program;n.uniformBlockBinding(v,b,s[v.id])}function o(v,E){let b=s[v.id];b===void 0&&(g(v),b=c(v),s[v.id]=b,v.addEventListener("dispose",m));const T=E.program;n.updateUBOMapping(v,T);const A=t.render.frame;r[v.id]!==A&&(l(v),r[v.id]=A)}function c(v){const E=i.createBuffer(),b=v.__size,T=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,b,T),i.bindBuffer(i.UNIFORM_BUFFER,null),E}function l(v){const E=s[v.id],b=v.uniforms,T=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let A=0,_=b.length;A<_;A++){const y=b[A];if(Array.isArray(y))for(let L=0,R=y.length;L<R;L++)d(y[L],A,L,T);else d(y,A,0,T)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(v,E,b,T){if(h(v,E,b,T)===!0){const A=v.__offset,_=v.value;if(Array.isArray(_)){let y=0;for(let L=0;L<_.length;L++){const R=_[L],N=x(R,!0);u(R,v.__data,y),y+=N.storage/Float32Array.BYTES_PER_ELEMENT}}else u(_,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,A,v.__data)}}function u(v,E,b){typeof v=="number"||typeof v=="boolean"?E[b]=v:v.isMatrix3?(E[b]=v.elements[0],E[b+1]=v.elements[1],E[b+2]=v.elements[2],E[b+3]=0,E[b+4]=v.elements[3],E[b+5]=v.elements[4],E[b+6]=v.elements[5],E[b+7]=0,E[b+8]=v.elements[6],E[b+9]=v.elements[7],E[b+10]=v.elements[8],E[b+11]=0):ArrayBuffer.isView(v)?E.set(v.subarray(0,E.length-b),b):v.toArray(E,b)}function h(v,E,b,T){const A=v.value,_=E+"_"+b;if(Array.isArray(A)){T[_]===void 0&&(T[_]=[]);const y=T[_];let L=!1;for(let R=0;R<A.length;R++)f(A[R],y,R)===!0&&(L=!0);return L}return f(A,T,_)}function f(v,E,b){if(E[b]===void 0)return typeof v=="number"||typeof v=="boolean"?E[b]=v:ArrayBuffer.isView(v)?E[b]=v.slice():E[b]=v.clone(),!0;{const T=E[b];if(typeof v=="number"||typeof v=="boolean"){if(T!==v)return E[b]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(T.equals(v)===!1)return T.copy(v),!0}}return!1}function g(v){const E=v.uniforms;let b=0;const T=16;for(let _=0,y=E.length;_<y;_++){const L=Array.isArray(E[_])?E[_]:[E[_]];for(let R=0,N=L.length;R<N;R++){const U=L[R],W=Array.isArray(U.value)?U.value:[U.value],P=Array.isArray(E[_])||Array.isArray(U.value);let k=b;for(let V=0,st=W.length;V<st;V++){const q=W[V],j=x(q,P),nt=b%T,Rt=nt%j.boundary,Vt=nt+Rt;b+=Rt,Vt!==0&&T-Vt<j.storage&&(b+=T-Vt),V===0&&(k=b),b+=j.storage}const G=U.type==="int"?Int32Array:U.type==="uint"?Uint32Array:Float32Array;U.__data=new G((b-k)/Float32Array.BYTES_PER_ELEMENT),U.__offset=k}}const A=b%T;return A>0&&(b+=T-A),v.__size=b,v.__cache={},this}function x(v,E){const b={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(b.boundary=4,b.storage=4):v.isVector2?(b.boundary=8,b.storage=8):v.isVector3||v.isColor?(b.boundary=16,b.storage=12):v.isVector4?(b.boundary=16,b.storage=16):v.isMatrix3?(b.boundary=16,b.storage=48):v.isMatrix4?(b.boundary=16,b.storage=64):v.isTexture?Nt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(b.boundary=16,b.storage=v.byteLength):Nt("WebGLRenderer: Unsupported uniform value type.",v),E===!0&&(b.boundary=16,b.storage=Math.ceil(b.storage/16)*16),b}function m(v){const E=v.target;E.removeEventListener("dispose",m),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function p(){for(const v in s)i.deleteBuffer(s[v]);s={},r={}}return{bind:a,update:o,dispose:p}}const F_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Pn=null;function O_(){return Pn===null&&(Pn=new el(F_,16,16,Pi,zn),Pn.name="DFG_LUT",Pn.minFilter=sn,Pn.magFilter=sn,Pn.wrapS=$n,Pn.wrapT=$n,Pn.generateMipmaps=!1,Pn.needsUpdate=!0),Pn}class B_{constructor(t={}){const{canvas:e=Yu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:h=!1,outputBufferType:f=hn}=t;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const x=f,m=new Set([Zo,Ko,Yo]),p=new Set([hn,kn,zs,os,Wo,Xo]),v=new Uint32Array(4),E=new Int32Array(4),b={textures:[],min:[],max:[],resolution:[]};let T=null,A=null;const _=[],y=[];let L=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=jn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let N=!1,U=null,W=null,P=null,k=null;this._outputColorSpace=fn;let G=0,V=0,st=null,q=-1,j=null;const nt=new Me,Rt=new Me;let Vt=null;const $=new Kt(0);let Mt=0,At=e.width,Ut=e.height,yt=1,et=null,de=null;const It=new Me(0,0,At,Ut),le=new Me(0,0,At,Ut);let ce=!1;const Ft=new Gs,$t=new nl;let re=!1,Ae=!1;const jt=new Qt,ne=new I,ve=new Me,Fe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Oe=!1;function be(){return st===null?yt:1}let F=n;function fe(S,C){return e.getContext(S,C)}let Bt,te,ut,ye,Dt,kt,w,M,H,rt,Q,ht,ft,Z,Y,pt,D,J,K,mt,ot,gt,Lt;try{const S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine","three.js r187"),e.addEventListener("webglcontextlost",Ct,!1),e.addEventListener("webglcontextrestored",Xt,!1),e.addEventListener("webglcontextcreationerror",St,!1),F===null){const C="webgl2";if(F=fe(C,S),F===null)throw fe(C)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Wt()}catch(S){throw e.removeEventListener("webglcontextlost",Ct,!1),e.removeEventListener("webglcontextrestored",Xt,!1),e.removeEventListener("webglcontextcreationerror",St,!1),Gt("WebGLRenderer: "+S.message),S}function Wt(){Bt=new Hg(F),Bt.init(),ot=new R_(F,Bt),te=new Pg(F,Bt,t,ot),ut=new A_(F,Bt),te.reversedDepthBuffer&&h&&ut.buffers.depth.setReversed(!0),W=F.createFramebuffer(),P=F.createFramebuffer(),k=F.createFramebuffer(),ye=new Wg(F),Dt=new d_,kt=new w_(F,Bt,ut,Dt,te,ot,ye),w=new zg(R),M=new qf(F),gt=new Rg(F,M),H=new Vg(F,M,ye,gt),rt=new qg(F,H,M,gt,ye),J=new Xg(F,te,kt),Y=new Lg(Dt),Q=new u_(R,w,Bt,te,gt,Y),ht=new I_(R,Dt),ft=new p_,Z=new S_(Bt),D=new wg(R,w,ut,rt,g,c),pt=new T_(R,rt,te),Lt=new U_(F,ye,te,ut),K=new Cg(F,Bt,ye),mt=new Gg(F,Bt,ye),ye.programs=Q.programs,R.capabilities=te,R.extensions=Bt,R.properties=Dt,R.renderLists=ft,R.shadowMap=pt,R.state=ut,R.info=ye}x!==hn&&(L=new Kg(x,e.width,e.height,o,s,r));const at=new D_(R,F);this.xr=at,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const S=Bt.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Bt.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return yt},this.setPixelRatio=function(S){S!==void 0&&(yt=S,this.setSize(At,Ut,!1))},this.getSize=function(S){return S.set(At,Ut)},this.setSize=function(S,C,z=!0){if(at.isPresenting){Nt("WebGLRenderer: Can't change size while VR device is presenting.");return}At=S,Ut=C,e.width=Math.floor(S*yt),e.height=Math.floor(C*yt),z===!0&&(e.style.width=S+"px",e.style.height=C+"px"),L!==null&&L.setSize(e.width,e.height),this.setViewport(0,0,S,C)},this.getDrawingBufferSize=function(S){return S.set(At*yt,Ut*yt).floor()},this.setDrawingBufferSize=function(S,C,z){At=S,Ut=C,yt=z,e.width=Math.floor(S*z),e.height=Math.floor(C*z),this.setViewport(0,0,S,C)},this.setEffects=function(S){if(x===hn){Gt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let C=0;C<S.length;C++)if(S[C].isOutputPass===!0){Nt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}L.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(nt)},this.getViewport=function(S){return S.copy(It)},this.setViewport=function(S,C,z,O){S.isVector4?It.set(S.x,S.y,S.z,S.w):It.set(S,C,z,O),ut.viewport(nt.copy(It).multiplyScalar(be()).round())},this.getScissor=function(S){return S.copy(le)},this.setScissor=function(S,C,z,O){S.isVector4?le.set(S.x,S.y,S.z,S.w):le.set(S,C,z,O),ut.scissor(Rt.copy(le).multiplyScalar(be()).round())},this.getScissorTest=function(){return ce},this.setScissorTest=function(S){ut.setScissorTest(ce=S)},this.setOpaqueSort=function(S){et=S},this.setTransparentSort=function(S){de=S},this.getClearColor=function(S){return S.copy(D.getClearColor())},this.setClearColor=function(){D.setClearColor(...arguments)},this.getClearAlpha=function(){return D.getClearAlpha()},this.setClearAlpha=function(){D.setClearAlpha(...arguments)},this.clear=function(S=!0,C=!0,z=!0){let O=0;if(S){let B=!1;if(st!==null){const it=st.texture.format;B=m.has(it)}if(B){const it=st.texture.type,_t=p.has(it),lt=D.getClearColor(),dt=D.getClearAlpha(),Et=lt.r,Ht=lt.g,Jt=lt.b;_t?(v[0]=Et,v[1]=Ht,v[2]=Jt,v[3]=dt,F.clearBufferuiv(F.COLOR,0,v)):(E[0]=Et,E[1]=Ht,E[2]=Jt,E[3]=dt,F.clearBufferiv(F.COLOR,0,E))}else O|=F.COLOR_BUFFER_BIT}C&&(O|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),z&&(O|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O!==0&&F.clear(O)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),U=S},this.dispose=function(){e.removeEventListener("webglcontextlost",Ct,!1),e.removeEventListener("webglcontextrestored",Xt,!1),e.removeEventListener("webglcontextcreationerror",St,!1),D.dispose(),ft.dispose(),Z.dispose(),kt.dispose(),Dt.dispose(),w.dispose(),rt.dispose(),H.dispose(),gt.dispose(),Lt.dispose(),Q.dispose(),at.dispose(),at.removeEventListener("sessionstart",tr),at.removeEventListener("sessionend",_s),wn.stop()};function Ct(S){S.preventDefault(),Jr("WebGLRenderer: Context Lost."),N=!0}function Xt(){Jr("WebGLRenderer: Context Restored."),N=!1;const S=ye.autoReset,C=pt.enabled,z=pt.autoUpdate,O=pt.needsUpdate,B=pt.type;Wt(),ye.autoReset=S,pt.enabled=C,pt.autoUpdate=z,pt.needsUpdate=O,pt.type=B}function St(S){Gt("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function oe(S){const C=S.target;C.removeEventListener("dispose",oe),pe(C)}function pe(S){_n(S),Dt.remove(S)}function _n(S){const C=Dt.get(S).programs;C!==void 0&&(C.forEach(function(z){Q.releaseProgram(z)}),S.isShaderMaterial&&Q.releaseShaderCache(S))}this.renderBufferDirect=function(S,C,z,O,B,it){C===null&&(C=Fe);const _t=B.isMesh&&B.matrixWorld.determinantAffine()<0,lt=X(S,C,z,O,B);ut.setMaterial(O,_t);let dt=z.index,Et=1;if(O.wireframe===!0){if(dt=H.getWireframeAttribute(z),dt===void 0)return;Et=2}const Ht=z.drawRange,Jt=z.attributes.position;let Tt=Ht.start*Et,ee=(Ht.start+Ht.count)*Et;it!==null&&(Tt=Math.max(Tt,it.start*Et),ee=Math.min(ee,(it.start+it.count)*Et)),dt!==null?(Tt=Math.max(Tt,0),ee=Math.min(ee,dt.count)):Jt!=null&&(Tt=Math.max(Tt,0),ee=Math.min(ee,Jt.count));const we=ee-Tt;if(we<0||we===1/0)return;gt.setup(B,O,lt,z,dt);let Se,xe=K;if(dt!==null&&(Se=M.get(dt),xe=mt,xe.setIndex(Se)),B.isMesh)O.wireframe===!0?(ut.setLineWidth(O.wireframeLinewidth*be()),xe.setMode(F.LINES)):xe.setMode(F.TRIANGLES);else if(B.isLine){let He=O.linewidth;He===void 0&&(He=1),ut.setLineWidth(He*be()),B.isLineSegments?xe.setMode(F.LINES):B.isLineLoop?xe.setMode(F.LINE_LOOP):xe.setMode(F.LINE_STRIP)}else B.isPoints?xe.setMode(F.POINTS):B.isSprite&&xe.setMode(F.TRIANGLES);if(B.isBatchedMesh)if(Bt.get("WEBGL_multi_draw"))xe.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const He=B._multiDrawStarts,Pt=B._multiDrawCounts,Ye=B._multiDrawCount,he=dt?M.get(dt).bytesPerElement:1,yi=Dt.get(O).currentProgram.getUniforms();for(let Ve=0;Ve<Ye;Ve++)yi.setValue(F,"_gl_DrawID",Ve),xe.render(He[Ve]/he,Pt[Ve])}else if(B.isInstancedMesh)xe.renderInstances(Tt,we,B.count);else if(z.isInstancedBufferGeometry){const He=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,Pt=Math.min(z.instanceCount,He);xe.renderInstances(Tt,we,Pt)}else xe.render(Tt,we)};function Qs(S,C,z,O){U!==null&&S.isNodeMaterial&&U.setObject(O,S),re===!0&&Y.setState(S,z,!1),S.transparent===!0&&S.side===cn&&S.forceSinglePass===!1?(S.side=rn,S.needsUpdate=!0,Rn(S,C,O),S.side=Ci,S.needsUpdate=!0,Rn(S,C,O),S.side=cn):Rn(S,C,O)}this.compile=function(S,C,z=null){z===null&&(z=S),U!==null&&U.renderStart(S,C,z),A=Z.get(z),A.init(C),y.push(A),z.traverseVisible(function(B){B.isLight&&B.layers.test(C.layers)&&(A.pushLight(B),B.castShadow&&A.pushShadow(B))}),S!==z&&S.traverseVisible(function(B){B.isLight&&B.layers.test(C.layers)&&(A.pushLight(B),B.castShadow&&A.pushShadow(B))}),A.setupLights(),U!==null&&U.updateLights(A.state.lightsArray),Ae=this.localClippingEnabled,re=Y.init(this.clippingPlanes,Ae),re===!0&&Y.setGlobalState(this.clippingPlanes,C),U!==null&&pt.render(A.state.shadowsArray,z,C);const O=new Set;return S.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const it=B.material;if(it)if(Array.isArray(it))for(let _t=0;_t<it.length;_t++){const lt=it[_t];Qs(lt,z,C,B),O.add(lt)}else Qs(it,z,C,B),O.add(it)}),A=y.pop(),U!==null&&U.renderEnd(),O},this.compileAsync=function(S,C,z=null){const O=this.compile(S,C,z);return new Promise(B=>{function it(){if(O.forEach(function(_t){const dt=Dt.get(_t).currentProgram;(dt===void 0||dt.isReady())&&O.delete(_t)}),O.size===0){B(S);return}setTimeout(it,10)}Bt.get("KHR_parallel_shader_compile")!==null?it():setTimeout(it,10)})};let gs=null;function js(S){gs&&gs(S)}function tr(){wn.stop()}function _s(){wn.start()}const wn=new Gh;wn.setAnimationLoop(js),typeof self<"u"&&wn.setContext(self),this.setAnimationLoop=function(S){gs=S,at.setAnimationLoop(S),S===null?wn.stop():wn.start()},at.addEventListener("sessionstart",tr),at.addEventListener("sessionend",_s),this.render=function(S,C){if(C!==void 0&&C.isCamera!==!0){Gt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;U!==null&&U.renderStart(S,C);const z=at.enabled===!0&&at.isPresenting===!0,O=L!==null&&(st===null||z)&&L.begin(R,st);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),C.parent===null&&C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),at.enabled===!0&&at.isPresenting===!0&&(L===null||L.isCompositing()===!1)&&(at.cameraAutoUpdate===!0&&at.updateCamera(C),C=at.getCamera()),S.isScene===!0&&S.onBeforeRender(R,S,C,st),A=Z.get(S,y.length),A.init(C),A.state.textureUnits=kt.getTextureUnits(),y.push(A),jt.multiplyMatrices(C.projectionMatrix,C.matrixWorldInverse),C.isArrayCamera?$t.setFromArrayCamera(C):Ft.setFromProjectionMatrix(jt,En,C.reversedDepth),Ae=this.localClippingEnabled,re=Y.init(this.clippingPlanes,Ae),T=ft.get(S,_.length),T.init(),_.push(T),this.info.render.frame++,at.enabled===!0&&at.isPresenting===!0){const _t=R.xr.getDepthSensingMesh();_t!==null&&Ni(_t,C,-1/0,R.sortObjects)}Ni(S,C,0,R.sortObjects),T.finish(),U!==null&&U.updateLights(A.state.lightsArray),R.sortObjects===!0&&T.sort(et,de),Oe=at.enabled===!1||at.isPresenting===!1||at.hasDepthSensing()===!1,Oe&&D.addToRenderList(T,S),this.info.autoReset===!0&&this.info.reset(),re===!0&&Y.beginShadows();const B=A.state.shadowsArray;if(pt.render(B,S,C),re===!0&&Y.endShadows(),(O&&L.hasRenderPass())===!1){const _t=T.opaque,lt=T.transmissive;if(A.setupLights(),C.isArrayCamera){const dt=C.cameras;if(lt.length>0)for(let Et=0,Ht=dt.length;Et<Ht;Et++){const Jt=dt[Et];Si(_t,lt,S,Jt)}Oe&&D.render(S);for(let Et=0,Ht=dt.length;Et<Ht;Et++){const Jt=dt[Et];Ii(T,S,Jt,Jt.viewport)}}else lt.length>0&&Si(_t,lt,S,C),Oe&&D.render(S),Ii(T,S,C)}st!==null&&V===0&&(kt.updateMultisampleRenderTarget(st),kt.updateRenderTargetMipmap(st)),O&&L.end(R),S.isScene===!0&&S.onAfterRender(R,S,C),gt.resetDefaultState(),q=-1,j=null,y.pop(),y.length>0?(A=y[y.length-1],kt.setTextureUnits(A.state.textureUnits),re===!0&&Y.setGlobalState(R.clippingPlanes,A.state.camera)):A=null,_.pop(),_.length>0?T=_[_.length-1]:T=null,U!==null&&U.renderEnd()};function Ni(S,C,z,O){if(S.visible===!1)return;if(S.layers.test(C.layers)){if(S.isGroup)z=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(C);else if(S.isLight)A.pushLight(S),S.castShadow&&A.pushShadow(S);else if(S.isSprite){const _t=C.isArrayCamera?$t:Ft;if(!S.frustumCulled||S.intersectsFrustum(_t)){O&&ve.setFromMatrixPosition(S.matrixWorld).applyMatrix4(jt);const lt=rt.update(S),dt=S.material;dt.visible&&T.push(S,lt,dt,z,ve.z,null,C)}}else if(S.isMesh||S.isLine||S.isPoints){const _t=C.isArrayCamera?$t:Ft;if(!S.frustumCulled||S.intersectsFrustum(_t)){const lt=rt.update(S),dt=S.material;if(O&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),ve.copy(S.boundingSphere.center)):(lt.boundingSphere===null&&lt.computeBoundingSphere(),ve.copy(lt.boundingSphere.center)),ve.applyMatrix4(S.matrixWorld).applyMatrix4(jt)),Array.isArray(dt)){const Et=lt.groups;for(let Ht=0,Jt=Et.length;Ht<Jt;Ht++){const Tt=Et[Ht],ee=dt[Tt.materialIndex];ee&&ee.visible&&T.push(S,lt,ee,z,ve.z,Tt,C)}}else dt.visible&&T.push(S,lt,dt,z,ve.z,null,C)}}}const it=S.children;for(let _t=0,lt=it.length;_t<lt;_t++)Ni(it[_t],C,z,O)}function Ii(S,C,z,O){const{opaque:B,transmissive:it,transparent:_t}=S;A.setupLightsView(z),re===!0&&Y.setGlobalState(R.clippingPlanes,z),O&&ut.viewport(nt.copy(O)),B.length>0&&Mi(B,C,z),it.length>0&&Mi(it,C,z),_t.length>0&&Mi(_t,C,z),ut.buffers.depth.setTest(!0),ut.buffers.depth.setMask(!0),ut.buffers.color.setMask(!0),ut.setPolygonOffset(!1)}function Si(S,C,z,O){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;if(A.state.transmissionRenderTarget[O.id]===void 0){const Tt=Bt.has("EXT_color_buffer_half_float")||Bt.has("EXT_color_buffer_float");A.state.transmissionRenderTarget[O.id]=new On(1,1,{generateMipmaps:!0,type:Tt?zn:hn,minFilter:di,samples:Math.max(4,te.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ie.workingColorSpace})}const it=A.state.transmissionRenderTarget[O.id],_t=O.viewport||nt;it.setSize(_t.z*R.transmissionResolutionScale,_t.w*R.transmissionResolutionScale);const lt=R.getRenderTarget(),dt=R.getActiveCubeFace(),Et=R.getActiveMipmapLevel();R.setRenderTarget(it),R.getClearColor($),Mt=R.getClearAlpha(),Mt<1&&R.setClearColor(16777215,.5),R.clear(),Oe&&D.render(z);const Ht=R.toneMapping;R.toneMapping=jn;const Jt=O.viewport;if(O.viewport!==void 0&&(O.viewport=void 0),A.setupLightsView(O),re===!0&&Y.setGlobalState(R.clippingPlanes,O),Mi(S,z,O),kt.updateMultisampleRenderTarget(it),kt.updateRenderTargetMipmap(it),Bt.has("WEBGL_multisampled_render_to_texture")===!1){let Tt=!1;for(let ee=0,we=C.length;ee<we;ee++){const Se=C[ee],{object:xe,geometry:He,material:Pt,group:Ye}=Se;if(Pt.side===cn&&xe.layers.test(O.layers)){const he=Pt.side;Pt.side=rn,Pt.needsUpdate=!0,Ui(xe,z,O,He,Pt,Ye),Pt.side=he,Pt.needsUpdate=!0,Tt=!0}}Tt===!0&&(kt.updateMultisampleRenderTarget(it),kt.updateRenderTargetMipmap(it))}R.setRenderTarget(lt,dt,Et),R.setClearColor($,Mt),Jt!==void 0&&(O.viewport=Jt),R.toneMapping=Ht}function Mi(S,C,z){const O=C.isScene===!0?C.overrideMaterial:null;for(let B=0,it=S.length;B<it;B++){const _t=S[B],{object:lt,geometry:dt,group:Et}=_t;let Ht=_t.material;Ht.allowOverride===!0&&O!==null&&(Ht=O),lt.layers.test(z.layers)&&Ui(lt,C,z,dt,Ht,Et)}}function Ui(S,C,z,O,B,it){U!==null&&B.isNodeMaterial&&U.setObject(S,B),S.onBeforeRender(R,C,z,O,B,it),S.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),B.onBeforeRender(R,C,z,O,S,it),B.transparent===!0&&B.side===cn&&B.forceSinglePass===!1?(B.side=rn,B.needsUpdate=!0,R.renderBufferDirect(z,C,O,B,S,it),B.side=Ci,B.needsUpdate=!0,R.renderBufferDirect(z,C,O,B,S,it),B.side=cn):R.renderBufferDirect(z,C,O,B,S,it),S.onAfterRender(R,C,z,O,B,it)}function vs(S){let C=0;for(const z of S)z.texture!==null&&C++;return C}function Rn(S,C,z){C.isScene!==!0&&(C=Fe);const O=Dt.get(S),B=A.state.lights,it=A.state.shadowsArray,_t=B.state.version,lt=Q.getParameters(S,B.state,it,C,z,A.state.lightProbeGridArray),dt=Q.getProgramCacheKey(lt);let Et=O.programs;O.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?C.environment:null,O.fog=C.fog;const Ht=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;O.envMap=w.get(S.envMap||O.environment,Ht),O.envMapRotation=O.environment!==null&&S.envMap===null?C.environmentRotation:S.envMapRotation,Et===void 0&&(S.addEventListener("dispose",oe),Et=new Map,O.programs=Et,O.programVariants=new Map);let Jt=Et.get(dt);if(Jt!==void 0){if(O.currentProgram===Jt&&O.lightsStateVersion===_t)return Fi(S,lt),Jt}else lt.uniforms=Q.getUniforms(S),U!==null&&S.isNodeMaterial&&U.build(S,z,lt),S.onBeforeCompile(lt,R),Jt=Q.acquireProgram(lt,dt),Et.set(dt,Jt),O.uniforms=lt.uniforms;const Tt=O.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Tt.clippingPlanes=Y.uniform),Fi(S,lt),O.needsLights=vt(S),O.lightsStateVersion=_t,O.needsLights&&(Tt.ambientLightColor.value=B.state.ambient,Tt.lightProbe.value=B.state.probe,Tt.sunLights.value=B.state.sun,Tt.sunLightShadows.value=B.state.sunShadow,Tt.directionalLights.value=B.state.directional,Tt.directionalLightShadows.value=B.state.directionalShadow,Tt.spotLights.value=B.state.spot,Tt.spotLightShadows.value=B.state.spotShadow,Tt.rectAreaLights.value=B.state.rectArea,Tt.ltc_1.value=B.state.rectAreaLTC1,Tt.ltc_2.value=B.state.rectAreaLTC2,Tt.pointLights.value=B.state.point,Tt.pointLightShadows.value=B.state.pointShadow,Tt.hemisphereLights.value=B.state.hemi,Tt.sunShadowMatrix.value=B.state.sunShadowMatrix,Tt.sunShadowCascade.value=B.state.sunShadowCascade,Tt.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Tt.spotLightMatrix.value=B.state.spotLightMatrix,Tt.spotLightMap.value=B.state.spotLightMap,Tt.pointShadowMatrix.value=B.state.pointShadowMatrix),O.numLightProbeGrids=vs(A.state.lightProbeGridArray),O.currentProgram=Jt,O.uniformsList=null,Jt}function er(S,C,z,O,B){const it=Dt.get(S),_t=it.currentProgram.id+","+O+","+B;let lt=it.programVariants.get(_t);return lt===void 0?(lt=Rn(S,C,z),it.programVariants.set(_t,lt)):(it.currentProgram=lt,it.uniformsList=null,it.outputColorSpace=O,it.toneMapping=B),lt}function nr(S){if(S.uniformsList===null){const C=S.currentProgram.getUniforms();S.uniformsList=Gr.seqWithValue(C.seq,S.uniforms)}return S.uniformsList}function Fi(S,C){const z=Dt.get(S);z.outputColorSpace=C.outputColorSpace,z.batching=C.batching,z.batchingColor=C.batchingColor,z.instancing=C.instancing,z.instancingColor=C.instancingColor,z.instancingMorph=C.instancingMorph,z.skinning=C.skinning,z.morphTargets=C.morphTargets,z.morphNormals=C.morphNormals,z.morphColors=C.morphColors,z.morphTargetsCount=C.morphTargetsCount,z.numClippingPlanes=C.numClippingPlanes,z.numIntersection=C.numClipIntersection,z.vertexAlphas=C.vertexAlphas,z.vertexTangents=C.vertexTangents,z.toneMapping=C.toneMapping}function X(S,C,z,O,B){C.isScene!==!0&&(C=Fe),kt.resetTextureUnits();const it=C.fog,_t=O.isMeshStandardMaterial||O.isMeshLambertMaterial||O.isMeshPhongMaterial?C.environment:null,lt=st===null?R.outputColorSpace:st.isXRRenderTarget===!0?st.texture.colorSpace:ie.workingColorSpace,dt=O.isMeshStandardMaterial||O.isMeshLambertMaterial&&!O.envMap||O.isMeshPhongMaterial&&!O.envMap,Et=w.get(O.envMap||_t,dt),Ht=O.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Jt=!!z.attributes.tangent&&(!!O.normalMap||O.anisotropy>0),Tt=!!z.morphAttributes.position,ee=!!z.morphAttributes.normal,we=!!z.morphAttributes.color;let Se=jn;O.toneMapped&&(st===null||st.isXRRenderTarget===!0)&&(Se=R.toneMapping);const xe=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,He=xe!==void 0?xe.length:0,Pt=Dt.get(O),Ye=A.state.lights;if(re===!0&&(Ae===!0||S!==j)){const Ee=S===j&&O.id===q;Y.setState(O,S,Ee)}let he=!1,yi=!1;O.version===Pt.__version?Pt.needsLights&&Pt.lightsStateVersion!==Ye.state.version||B.isBatchedMesh&&Pt.batching===!1||!B.isBatchedMesh&&Pt.batching===!0||B.isBatchedMesh&&Pt.batchingColor===!0&&B._colorsTexture===null||B.isBatchedMesh&&Pt.batchingColor===!1&&B._colorsTexture!==null||B.isInstancedMesh&&Pt.instancing===!1||!B.isInstancedMesh&&Pt.instancing===!0||B.isSkinnedMesh&&Pt.skinning===!1||!B.isSkinnedMesh&&Pt.skinning===!0||B.isInstancedMesh&&Pt.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Pt.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Pt.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Pt.instancingMorph===!1&&B.morphTexture!==null||Pt.envMap!==Et||O.fog===!0&&Pt.fog!==it||Pt.numClippingPlanes!==void 0&&(Pt.numClippingPlanes!==Y.numPlanes||Pt.numIntersection!==Y.numIntersection)||Pt.vertexAlphas!==Ht||Pt.vertexTangents!==Jt||Pt.morphTargets!==Tt||Pt.morphNormals!==ee||Pt.morphColors!==we||Pt.morphTargetsCount!==He||Pt.numLightProbeGrids!==vs(A.state.lightProbeGridArray)?he=!0:(Pt.outputColorSpace!==lt||Pt.toneMapping!==Se)&&(yi=!0):(he=!0,Pt.__version=O.version);let Ve=Pt.currentProgram;(he===!0||yi===!0)&&(Ve=yi===!0?er(O,C,B,lt,Se):Rn(O,C,B),U&&O.isNodeMaterial&&U.onUpdateProgram(O,Ve,Pt));let ir=!1,si=!1,bi=!1;const ae=Ve.getUniforms(),Be=Pt.uniforms;if(ut.useProgram(Ve.program)&&(ir=!0,si=!0,bi=!0),O.id!==q&&(q=O.id,si=!0),ir||j!==S){ut.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),ae.setValue(F,"projectionMatrix",S.projectionMatrix),ae.setValue(F,"viewMatrix",S.matrixWorldInverse);const Ne=ae.map.cameraPosition;Ne!==void 0&&Ne.setValue(F,ne.setFromMatrixPosition(S.matrixWorld)),te.logarithmicDepthBuffer&&ae.setValue(F,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(O.isMeshPhongMaterial||O.isMeshToonMaterial||O.isMeshLambertMaterial||O.isMeshBasicMaterial||O.isMeshStandardMaterial||O.isShaderMaterial)&&ae.setValue(F,"isOrthographic",S.isOrthographicCamera===!0),j!==S&&(j=S,si=!0,bi=!0)}if(Pt.needsLights&&(Ye.state.sunShadowMap.length>0&&ae.setValue(F,"sunShadowMap",Ye.state.sunShadowMap,kt),Ye.state.directionalShadowMap.length>0&&ae.setValue(F,"directionalShadowMap",Ye.state.directionalShadowMap,kt),Ye.state.spotShadowMap.length>0&&ae.setValue(F,"spotShadowMap",Ye.state.spotShadowMap,kt),Ye.state.pointShadowMap.length>0&&ae.setValue(F,"pointShadowMap",Ye.state.pointShadowMap,kt)),B.isSkinnedMesh){ae.setOptional(F,B,"bindMatrix"),ae.setOptional(F,B,"bindMatrixInverse");const Ee=B.skeleton;Ee&&(Ee.boneTexture===null&&Ee.computeBoneTexture(),ae.setValue(F,"boneTexture",Ee.boneTexture,kt))}B.isBatchedMesh&&(ae.setOptional(F,B,"batchingTexture"),ae.setValue(F,"batchingTexture",B._matricesTexture,kt),ae.setOptional(F,B,"batchingIdTexture"),ae.setValue(F,"batchingIdTexture",B._indirectTexture,kt),ae.setOptional(F,B,"batchingColorTexture"),B._colorsTexture!==null&&ae.setValue(F,"batchingColorTexture",B._colorsTexture,kt));const vn=z.morphAttributes;if((vn.position!==void 0||vn.normal!==void 0||vn.color!==void 0)&&J.update(B,z,Ve),(si||Pt.receiveShadow!==B.receiveShadow)&&(Pt.receiveShadow=B.receiveShadow,ae.setValue(F,"receiveShadow",B.receiveShadow)),(O.isMeshStandardMaterial||O.isMeshLambertMaterial||O.isMeshPhongMaterial)&&O.envMap===null&&C.environment!==null&&(Be.envMapIntensity.value=C.environmentIntensity),Be.dfgLUT!==void 0&&(Be.dfgLUT.value=O_()),si){if(ae.setValue(F,"toneMappingExposure",R.toneMappingExposure),Pt.needsLights&&ct(Be,bi),it&&O.fog===!0&&ht.refreshFogUniforms(Be,it),ht.refreshMaterialUniforms(Be,O,yt,Ut,A.state.transmissionRenderTarget[S.id]),Pt.needsLights&&Pt.numLightProbeGrids>0){const Ee=b;let Ne=0;for(const Gn of A.state.lightProbeGridArray)Gn.texture!==null&&(Ee.textures[Ne]=Gn.texture,Ee.min[Ne]=Gn.boundingBox.min,Ee.max[Ne]=Gn.boundingBox.max,Ee.resolution[Ne]=Gn.resolution,Ne++);for(const Gn in Ee)Ee[Gn].length=Ne;Be.probesSH.value=Ee.textures,Be.probesMin.value=Ee.min,Be.probesMax.value=Ee.max,Be.probesResolution.value=Ee.resolution}Gr.upload(F,nr(Pt),Be,kt)}if(O.isShaderMaterial&&O.uniformsNeedUpdate===!0&&(Gr.upload(F,nr(Pt),Be,kt),O.uniformsNeedUpdate=!1),O.isSpriteMaterial&&ae.setValue(F,"center",B.center),ae.setValue(F,"modelViewMatrix",B.modelViewMatrix),ae.setValue(F,"normalMatrix",B.normalMatrix),ae.setValue(F,"modelMatrix",B.matrixWorld),O.uniformsGroups!==void 0){const Ee=O.uniformsGroups;for(let Ne=0,Gn=Ee.length;Ne<Gn;Ne++){const Sl=Ee[Ne];Lt.update(Sl,Ve),Lt.bind(Sl,Ve)}}return Ve}function ct(S,C){S.ambientLightColor.needsUpdate=C,S.lightProbe.needsUpdate=C,S.sunLights.needsUpdate=C,S.sunLightShadows.needsUpdate=C,S.directionalLights.needsUpdate=C,S.directionalLightShadows.needsUpdate=C,S.pointLights.needsUpdate=C,S.pointLightShadows.needsUpdate=C,S.spotLights.needsUpdate=C,S.spotLightShadows.needsUpdate=C,S.rectAreaLights.needsUpdate=C,S.hemisphereLights.needsUpdate=C}function vt(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return G},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return st},this.setRenderTargetTextures=function(S,C,z){const O=Dt.get(S);O.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,O.__autoAllocateDepthBuffer===!1&&(O.__useRenderToTexture=!1),Dt.get(S.texture).__webglTexture=C,Dt.get(S.depthTexture).__webglTexture=O.__autoAllocateDepthBuffer?void 0:z,O.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,C){const z=Dt.get(S);z.__webglFramebuffer=C,z.__useDefaultFramebuffer=C===void 0},this.setRenderTarget=function(S,C=0,z=0){st=S,G=C,V=z;let O=null,B=!1,it=!1;if(S){const lt=Dt.get(S);if(lt.__useDefaultFramebuffer!==void 0){ut.bindFramebuffer(F.FRAMEBUFFER,lt.__webglFramebuffer),nt.copy(S.viewport),Rt.copy(S.scissor),Vt=S.scissorTest,ut.viewport(nt),ut.scissor(Rt),ut.setScissorTest(Vt),q=-1;return}else if(lt.__webglFramebuffer===void 0)kt.setupRenderTarget(S);else if(lt.__hasExternalTextures)kt.rebindTextures(S,Dt.get(S.texture).__webglTexture,Dt.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const Ht=S.depthTexture;if(lt.__boundDepthTexture!==Ht){if(Ht!==null&&Dt.has(Ht)&&(S.width!==Ht.image.width||S.height!==Ht.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");kt.setupDepthRenderbuffer(S)}}const dt=S.texture;(dt.isData3DTexture||dt.isDataArrayTexture||dt.isCompressedArrayTexture)&&(it=!0);const Et=Dt.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Et[C])?O=Et[C][z]:O=Et[C],B=!0):S.samples>0&&kt.useMultisampledRTT(S)===!1?O=Dt.get(S).__webglMultisampledFramebuffer:Array.isArray(Et)?O=Et[z]:O=Et,nt.copy(S.viewport),Rt.copy(S.scissor),Vt=S.scissorTest}else nt.copy(It).multiplyScalar(yt).floor(),Rt.copy(le).multiplyScalar(yt).floor(),Vt=ce;if(z!==0&&(O=W),ut.bindFramebuffer(F.FRAMEBUFFER,O)&&ut.drawBuffers(S,O),ut.viewport(nt),ut.scissor(Rt),ut.setScissorTest(Vt),B){const lt=Dt.get(S.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+C,lt.__webglTexture,z)}else if(it){const lt=C;for(let dt=0;dt<S.textures.length;dt++){const Et=Dt.get(S.textures[dt]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+dt,Et.__webglTexture,z,lt)}}else if(S!==null&&z!==0){const lt=Dt.get(S.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,lt.__webglTexture,z)}q=-1};function zt(S){const C=Dt.get(S);return(C.__readFormat!==S.format||C.__readType!==S.type)&&(C.__readFormat=S.format,C.__readType=S.type,C.__formatReadable=te.textureFormatReadable(S.format),C.__typeReadable=te.textureTypeReadable(S.type)),C}this.readRenderTargetPixels=function(S,C,z,O,B,it,_t,lt=0){if(!(S&&S.isWebGLRenderTarget)){Gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let dt=Dt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&_t!==void 0&&(dt=dt[_t],Array.isArray(dt)&&(dt=dt[0])),dt){ut.bindFramebuffer(F.FRAMEBUFFER,dt);try{const Et=S.textures[lt],Ht=Et.format,Jt=Et.type;S.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+lt);const Tt=zt(Et);if(Tt.__formatReadable===!1){Gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Tt.__typeReadable===!1){Gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}C>=0&&C<=S.width-O&&z>=0&&z<=S.height-B&&F.readPixels(C,z,O,B,ot.convert(Ht),ot.convert(Jt),it)}finally{const Et=st!==null?Dt.get(st).__webglFramebuffer:null;ut.bindFramebuffer(F.FRAMEBUFFER,Et)}}},this.readRenderTargetPixelsAsync=async function(S,C,z,O,B,it,_t,lt=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let dt=Dt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&_t!==void 0&&(dt=dt[_t],Array.isArray(dt)&&(dt=dt[0])),dt)if(C>=0&&C<=S.width-O&&z>=0&&z<=S.height-B){ut.bindFramebuffer(F.FRAMEBUFFER,dt);const Et=S.textures[lt],Ht=Et.format,Jt=Et.type;S.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+lt);const Tt=zt(Et);if(Tt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Tt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ee=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,ee),F.bufferData(F.PIXEL_PACK_BUFFER,it.byteLength,F.STREAM_READ),F.readPixels(C,z,O,B,ot.convert(Ht),ot.convert(Jt),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);const we=st!==null?Dt.get(st).__webglFramebuffer:null;ut.bindFramebuffer(F.FRAMEBUFFER,we);const Se=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Ku(F,Se,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,ee),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,it),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(ee),F.deleteSync(Se),it}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,C=null,z=0){const O=Math.pow(2,-z),B=Math.floor(S.image.width*O),it=Math.floor(S.image.height*O),_t=C!==null?C.x:0,lt=C!==null?C.y:0;kt.setTexture2D(S,0),F.copyTexSubImage2D(F.TEXTURE_2D,z,0,0,_t,lt,B,it),ut.unbindTexture()},this.copyTextureToTexture=function(S,C,z=null,O=null,B=0,it=0){let _t,lt,dt,Et,Ht,Jt,Tt,ee,we;const Se=S.isCompressedTexture?S.mipmaps[it]:S.image;if(z!==null)_t=z.max.x-z.min.x,lt=z.max.y-z.min.y,dt=z.isBox3?z.max.z-z.min.z:1,Et=z.min.x,Ht=z.min.y,Jt=z.isBox3?z.min.z:0;else{const ae=Math.pow(2,-B);_t=Math.floor(Se.width*ae),lt=Math.floor(Se.height*ae),S.isDataArrayTexture?dt=Se.depth:S.isData3DTexture?dt=Math.floor(Se.depth*ae):dt=1,Et=0,Ht=0,Jt=0}O!==null?(Tt=O.x,ee=O.y,we=O.z):(Tt=0,ee=0,we=0);const xe=ot.convert(C.format),He=ot.convert(C.type);let Pt;C.isData3DTexture?(kt.setTexture3D(C,0),Pt=F.TEXTURE_3D):C.isDataArrayTexture||C.isCompressedArrayTexture?(kt.setTexture2DArray(C,0),Pt=F.TEXTURE_2D_ARRAY):(kt.setTexture2D(C,0),Pt=F.TEXTURE_2D),ut.activeTexture(F.TEXTURE0),ut.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,C.flipY),ut.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),ut.pixelStorei(F.UNPACK_ALIGNMENT,C.unpackAlignment);const Ye=ut.getParameter(F.UNPACK_ROW_LENGTH),he=ut.getParameter(F.UNPACK_IMAGE_HEIGHT),yi=ut.getParameter(F.UNPACK_SKIP_PIXELS),Ve=ut.getParameter(F.UNPACK_SKIP_ROWS),ir=ut.getParameter(F.UNPACK_SKIP_IMAGES);ut.pixelStorei(F.UNPACK_ROW_LENGTH,Se.width),ut.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Se.height),ut.pixelStorei(F.UNPACK_SKIP_PIXELS,Et),ut.pixelStorei(F.UNPACK_SKIP_ROWS,Ht),ut.pixelStorei(F.UNPACK_SKIP_IMAGES,Jt);const si=S.isDataArrayTexture||S.isData3DTexture,bi=C.isDataArrayTexture||C.isData3DTexture;if(S.isDepthTexture){const ae=Dt.get(S),Be=Dt.get(C),vn=Dt.get(ae.__renderTarget),Ee=Dt.get(Be.__renderTarget);ut.bindFramebuffer(F.READ_FRAMEBUFFER,vn.__webglFramebuffer),ut.bindFramebuffer(F.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let Ne=0;Ne<dt;Ne++)si&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Dt.get(S).__webglTexture,B,Jt+Ne),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Dt.get(C).__webglTexture,it,we+Ne)),F.blitFramebuffer(Et,Ht,Et+_t,Ht+lt,Tt,ee,Tt+_t,ee+lt,F.DEPTH_BUFFER_BIT,F.NEAREST);ut.bindFramebuffer(F.READ_FRAMEBUFFER,null),ut.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(B!==0||S.isRenderTargetTexture||Dt.has(S)){const ae=Dt.get(S),Be=Dt.get(C);ut.bindFramebuffer(F.READ_FRAMEBUFFER,P),ut.bindFramebuffer(F.DRAW_FRAMEBUFFER,k);for(let vn=0;vn<dt;vn++)si?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,ae.__webglTexture,B,Jt+vn):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,ae.__webglTexture,B),bi?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Be.__webglTexture,it,we+vn):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Be.__webglTexture,it),B!==0?F.blitFramebuffer(Et,Ht,Et+_t,Ht+lt,Tt,ee,Tt+_t,ee+lt,F.COLOR_BUFFER_BIT,F.NEAREST):bi?F.copyTexSubImage3D(Pt,it,Tt,ee,we+vn,Et,Ht,_t,lt):F.copyTexSubImage2D(Pt,it,Tt,ee,Et,Ht,_t,lt);ut.bindFramebuffer(F.READ_FRAMEBUFFER,null),ut.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else bi?S.isDataTexture||S.isData3DTexture?F.texSubImage3D(Pt,it,Tt,ee,we,_t,lt,dt,xe,He,Se.data):C.isCompressedArrayTexture?F.compressedTexSubImage3D(Pt,it,Tt,ee,we,_t,lt,dt,xe,Se.data):F.texSubImage3D(Pt,it,Tt,ee,we,_t,lt,dt,xe,He,Se):S.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,it,Tt,ee,_t,lt,xe,He,Se.data):S.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,it,Tt,ee,Se.width,Se.height,xe,Se.data):F.texSubImage2D(F.TEXTURE_2D,it,Tt,ee,_t,lt,xe,He,Se);ut.pixelStorei(F.UNPACK_ROW_LENGTH,Ye),ut.pixelStorei(F.UNPACK_IMAGE_HEIGHT,he),ut.pixelStorei(F.UNPACK_SKIP_PIXELS,yi),ut.pixelStorei(F.UNPACK_SKIP_ROWS,Ve),ut.pixelStorei(F.UNPACK_SKIP_IMAGES,ir),it===0&&C.generateMipmaps===!0&&C.mipmapsAutoUpdate===!0&&F.generateMipmap(Pt),ut.unbindTexture()},this.initRenderTarget=function(S){Dt.get(S).__webglFramebuffer===void 0&&kt.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?kt.setTextureCube(S,0):S.isData3DTexture?kt.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?kt.setTexture2DArray(S,0):kt.setTexture2D(S,0),ut.unbindTexture()},this.resetState=function(){G=0,V=0,st=null,ut.reset(),gt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return En}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=ie._getDrawingBufferColorSpace(t),e.unpackColorSpace=ie._getUnpackColorSpace()}}const Kc={type:"change"},dl={type:"start"},tu={type:"end"},Ur=new us,Zc=new Nn,k_=Math.cos(70*nn.DEG2RAD),Ce=new I,en=2*Math.PI,ue={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},qa=1e-6;class z_ extends Wf{constructor(t,e=null){super(t,e),this.state=ue.NONE,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:es.ROTATE,MIDDLE:es.DOLLY,RIGHT:es.PAN},this.touches={ONE:ts.ROTATE,TWO:ts.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new ni,this._lastTargetPosition=new I,this._quat=new ni().setFromUnitVectors(t.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Tc,this._sphericalDelta=new Tc,this._scale=1,this._panOffset=new I,this._rotateStart=new wt,this._rotateEnd=new wt,this._rotateDelta=new wt,this._panStart=new wt,this._panEnd=new wt,this._panDelta=new wt,this._dollyStart=new wt,this._dollyEnd=new wt,this._dollyDelta=new wt,this._dollyDirection=new I,this._mouse=new wt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=V_.bind(this),this._onPointerDown=H_.bind(this),this._onPointerUp=G_.bind(this),this._onContextMenu=$_.bind(this),this._onMouseWheel=q_.bind(this),this._onKeyDown=Y_.bind(this),this._onTouchStart=K_.bind(this),this._onTouchMove=Z_.bind(this),this._onMouseDown=W_.bind(this),this._onMouseMove=X_.bind(this),this._interceptControlDown=J_.bind(this),this._interceptControlUp=Q_.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.ownerDocument.addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=ue.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.ownerDocument.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Kc),this.update(),this.state=ue.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){const e=this.object.position;Ce.copy(e).sub(this.target),Ce.applyQuaternion(this._quat),this._spherical.setFromVector3(Ce),this.autoRotate&&this.state===ue.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=en:n>Math.PI&&(n-=en),s<-Math.PI?s+=en:s>Math.PI&&(s-=en),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Ce.setFromSpherical(this._spherical),Ce.applyQuaternion(this._quatInverse),e.copy(this.target).add(Ce),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Ce.length();a=this._clampDistance(o*this._scale);const c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const o=new I(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new I(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(o),this.object.updateMatrixWorld(),a=Ce.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Ur.origin.copy(this.object.position),Ur.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ur.direction))<k_?this.object.lookAt(this.target):(Zc.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ur.intersectPlane(Zc,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>qa||8*(1-this._lastQuaternion.dot(this.object.quaternion))>qa||this._lastTargetPosition.distanceToSquared(this.target)>qa?(this.dispatchEvent(Kc),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?en/60*this.autoRotateSpeed*t:en/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Ce.setFromMatrixColumn(e,0),Ce.multiplyScalar(-t),this._panOffset.add(Ce)}_panUp(t,e){this.screenSpacePanning===!0?Ce.setFromMatrixColumn(e,1):(Ce.setFromMatrixColumn(e,0),Ce.crossVectors(this.object.up,Ce)),Ce.multiplyScalar(t),this._panOffset.add(Ce)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Ce.copy(s).sub(this.target);let r=Ce.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientY),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(en*this._rotateDelta.x/e.clientHeight),this._rotateUp(en*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.zoomToCursor&&(this._performCursorZoom=!0,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(en*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-en*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(en*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-en*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(en*this._rotateDelta.x/e.clientHeight),this._rotateUp(en*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(t.pageX+e.x)*.5,o=(t.pageY+e.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new wt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function H_(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function V_(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function G_(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(tu),this.state=ue.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function W_(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case es.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=ue.DOLLY;break;case es.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ue.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ue.ROTATE}break;case es.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ue.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ue.PAN}break;default:this.state=ue.NONE}this.state!==ue.NONE&&this.dispatchEvent(dl)}function X_(i){switch(this.state){case ue.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case ue.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case ue.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function q_(i){this.enabled===!1||this.enableZoom===!1||this.state!==ue.NONE||(i.preventDefault(),this.dispatchEvent(dl),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(tu))}function Y_(i){this.enabled!==!1&&this._handleKeyDown(i)}function K_(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case ts.ROTATE:if(this.enableRotate===!1){this.state=ue.NONE;break}this._handleTouchStartRotate(i),this.state=ue.TOUCH_ROTATE;break;case ts.PAN:if(this.enablePan===!1){this.state=ue.NONE;break}this._handleTouchStartPan(i),this.state=ue.TOUCH_PAN;break;default:this.state=ue.NONE}break;case 2:switch(this.touches.TWO){case ts.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=ue.TOUCH_DOLLY_PAN;break;case ts.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=ue.TOUCH_DOLLY_ROTATE;break;default:this.state=ue.NONE}break;default:this.state=ue.NONE}this.state!==ue.NONE&&this.dispatchEvent(dl)}function Z_(i){switch(this._trackPointer(i),this.state){case ue.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case ue.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case ue.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case ue.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=ue.NONE}}function $_(i){this.enabled!==!1&&i.preventDefault()}function J_(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.ownerDocument.addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Q_(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const j_=new Map,tv=new Map;function $c(i){i.traverse(t=>{const e=t;if(e.geometry&&e.geometry.dispose(),e.material){const n=Array.isArray(e.material)?e.material:[e.material];for(const s of n)ev(s)||s.dispose()}})}function ev(i){if(i.userData&&i.userData.mfShared)return!0;for(const t of j_.values())if(t===i)return!0;for(const t of tv.values())if(t===i)return!0;return!1}function Rs(i,t,e){if(e.cut!==void 0){const n=e.variant==="cross",s=(n?t.max.x:t.max.z)+3,r=(n?t.min.x:t.min.z)-3;i.normal.set(n?-1:0,0,n?0:-1),i.constant=s-nn.clamp(e.cut,0,1)*(s-r);return}e.variant==="long"?(i.normal.set(0,0,-1),i.constant=(t.min.z+t.max.z)/2):e.variant==="cross"?(i.normal.set(-1,0,0),i.constant=(t.min.x+t.max.x)/2):(i.normal.set(0,0,-1),i.constant=1e6)}const Ue={haul:{name:"拱形运输断面",shape:"arch",width:.78,height:.72,crown:.68,rail:!0,support:"lining"},ramp:{name:"拱形斜坡道",shape:"arch",width:.72,height:.65,crown:.62,support:"lining"},air:{name:"拱形回风断面",shape:"arch",width:.56,height:.57,crown:.6,support:"lining"},drift:{name:"拱形联络断面",shape:"arch",width:.51,height:.53,crown:.64,support:"ribs"},loading:{name:"圆弧拱装运断面",shape:"arch",width:.6,height:.54,crown:.73,support:"ribs"},production:{name:"圆弧拱回采断面",shape:"arch",width:.7,height:.68,crown:.7,support:"ribs"},drill:{name:"拱形凿岩硐室",shape:"arch",width:.71,height:.75,crown:.7,support:"ribs"},cut:{name:"矩形切割／薄层断面",shape:"rectangle",width:.54,height:.44,support:"frames"},scraper:{name:"梯形电耙断面",shape:"trapezoid",width:.57,height:.53,support:"frames"},main:{name:"圆形提升井筒",radius:.28,shape:"circle"},vent:{name:"圆形回风井筒",radius:.21,shape:"circle"},raise:{name:"矩形天井",radius:.19,shape:"rectangle"},pass:{name:"圆形垂直溜井",radius:.207,shape:"circle"},incline:{name:"矩形斜溜道",radius:.18,shape:"rectangle"},hopper:{name:"收缩形漏斗与斗颈",radius:.41,shape:"hopper"},service:{name:"拱形充填联络断面",shape:"arch",width:.5,height:.56,crown:.64,support:"ribs"},fillBore:{name:"专用圆形充填钻孔",radius:.13,shape:"circle"}};function nv(i,t){return t==="shaft"?i==="主井"?Ue.main:!i||i==="回风井"?Ue.vent:Ue.raise:t==="gravity"?Ue.pass:t==="chute"?Ue.incline:t==="bell"?Ue.hopper:t==="ramp"?Ue.ramp:t==="fillBore"?Ue.fillBore:t==="service"?Ue.service:t!=="drift"&&t!=="face"?null:t==="face"||/低侧|切割|中心上山|顺路人行/.test(i)?Ue.cut:/电耙/.test(i)?Ue.scraper:/回风/.test(i)?Ue.air:/回采进路|出矿作业/.test(i)?Ue.production:/凿岩|钻机/.test(i)?Ue.drill:/装运|装矿|装车|出矿巷/.test(i)?Ue.loading:i==="阶段运输巷道"?Ue.haul:/分段运输|分层运输/.test(i)?Ue.ramp:Ue.drift}function iv(i){const t=i.width/2,e=i.height;if(i.shape==="rectangle")return[[-t,0],[t,0],[t,e],[-t,e]];if(i.shape==="trapezoid")return[[-t,0],[t,0],[t*.72,e],[-t*.72,e]];const n=e*(1-i.crown),s=(t*t+n*n)/(2*n),r=Math.asin(t/s);return[[-t,0],[t,0],...Array.from({length:11},(a,o)=>{const c=r*(1-2*o/10);return[s*Math.sin(c),e-s*(1-Math.cos(c))]})]}const Bn=.32,pi=[7.75,Bn,5.05],Wr=[7.75,10.52,5.05],Os=[9.1,10.52,5.05],ze=6.45,vi=3.65,Xs=[ze,Bn,vi],$s=[ze,Bn,5.05],Ri=-7.6,mi=9.45,Un=4.42,Jc=[Ri,mi,Un],qs=(i,t)=>i.every((e,n)=>Math.abs(e-t[n])<1e-6),pn=i=>i.map(t=>Math.round(t*1e6)).join(","),eu=(i,t)=>[pn(i),pn(t)].sort().join("/"),sv=(i,t)=>i.filter((e,n)=>Math.abs(e-t[n])>1e-6).length===1;class rv{constructor(t){this.phase=t,this.links=[],this.volumes=[],this.labels=[],this.routes=[],this.technical=[],this.fittings=[],this.pipelines=[],this.orePasses=[],this.edges=new Map,this.transport=[Xs,$s,pi,Wr,Os],this.network=new Map}line(t,e,n="drift",s="access",r=!0){const a=nv(t,n);for(let l=1;l<e.length;l++){const d=e[l-1],u=e[l];if(qs(d,u))continue;const h={a:d,b:u,kind:n,layer:s,cut:r,name:t,section:a};this.links.push(h),this.edges.set(eu(d,u),h);for(const[f,g]of[[d,u],[u,d]]){const x=this.network.get(pn(f))??[];x.push(pn(g)),this.network.set(pn(f),x)}}const o=Math.floor((e.length-1)/2),c=e[o].map((l,d)=>(l+e[o+1][d])/2);this.label(t,c,s,a?.name)}label(t,e,n,s){!t||this.labels.some(r=>r.name===t)||this.labels.push({name:t,position:e,layer:n,detail:s})}volume(t,e,n,s=n,r){if(e.some(u=>!Number.isFinite(u)))throw new Error("Invalid volume "+t);if(e[0]>=e[1]||e[2]>=e[3]||e[4]>=e[5])return;this.volumes.push({bounds:e,layer:n,style:s,condition:r,name:t});const[a,o,c,l,,d]=e;this.label(t,[(a+o)/2,(c+l)/2,d],n)}mark(t,e,n,s="work"){this.technical.push({a:e,b:n,style:s}),this.label(t,e.map((r,a)=>(r+n[a])/2),s)}fitting(t,e,n,s="access"){this.fittings.push({name:t,point:e,shape:n,layer:s}),this.label(t,e,s)}flow(t,e,n="ore"){const s=e.filter((r,a)=>a===0||!qs(r,e[a-1]));this.routes.push({name:t,points:s,type:n})}}function Js(i,{thin:t=!1,high:e=mi,haulStops:n=[]}={}){const s=[-7.95,Bn,5.05],r=[pi[0],-.18,pi[2]],a=[Ri,10.52,Un],o=[9.1,10.52,Un],c=[7.75,e,5.05],l=[7.75,e,Un];i.transport.splice(3,0,c),i.line("主井",[r,pi,c,Wr],"shaft");const d=[s,...n,$s,pi];i.line("阶段运输巷道",d),i.line("地表卸矿线",[Wr,Os],"surface","rock",!1),e!==mi&&i.line(null,[Jc,[Ri,e,Un]],"shaft"),i.line("回风井",[Jc,a],"shaft"),i.line("地表检修通道",[a,[7.75,10.52,Un],o,Os],"surface","rock",!1),i.line("上部回风联络道",[[Ri,e,Un],l,c]),i.volume(null,[-8.45,8.5,-.88,-.4,-4.95,5.48],"rock","foundation"),i.volume("围岩剖切面",[-6.8,6.8,-.37,.07,-4.65,4.3],"rock","rock"),i.volume(null,[-6.75,6.45,.07,t?2.6:9.5,-3.95,-3.4],"rock","rockDark"),i.volume("井口平台",[7.27,9.32,10.37,10.52,3.93,5.68],"rock","foundation");const u=11.25;for(const h of[7.39,8.11])for(const f of[4.69,5.41])i.mark("提升井架",[h,10.52,f],[h,u,f],"rock"),i.mark(null,[h,u,f],[h,u,10.1-f],"rock"),i.mark(null,[h,u,f],[15.5-h,u,f],"rock");i.phase===0&&i.flow("阶段运输与主井提升",[...d,c,Wr,Os],"opening")}function fl(i,t,e,n,{inclined:s=!1}={}){const r=e.slice().sort((d,u)=>d[1]-u[1]),a=r[0][1]-n[1],o=Math.min(.31,a*.43),c=[n[0],n[1]+o,n[2]-o*.7],l=r.map(d=>[d[0],d[1]-o*.77,c[2]]);if(s)i.line(t,[r[0],n],"chute"),i.fitting(t+"卸矿格筛",r[0],"grizzly");else{i.line(t,[c,...l],"gravity");for(const[d,u]of l.entries())i.line(d===l.length-1?"卸矿口及短斜溜道":"中间卸矿口及分支斜溜道",[r[d],u],"chute"),i.fitting("卸矿格筛",r[d],"grizzly");i.line("井底收口与放矿溜口",[c,n],"chute"),r.at(-1)[1]-n[1]>=1.3&&i.fitting("井底贮矿段",c,"storage")}return i.fitting(s?"斜溜井底放矿闸门":"井底放矿闸门",n,"gate"),i.orePasses.push({name:t,intakes:r,entries:l,outlet:n,inclined:s}),d=>{const u=r.findIndex(h=>qs(h,d));return s?[d,n]:[d,...l.slice(0,u+1).reverse(),c,n]}}function pl(i,t){const e=[...new Set(t)].sort((s,r)=>s-r).map(s=>[ze,s,vi]),n=fl(i,"矿石溜井",e,Xs);return i.line("溜井底部装运联络道",[Xs,$s]),s=>[...n([ze,s,vi]),...i.transport.slice(1)]}function ca(i,t,e=!1){const n=[...new Set(t)].sort((o,c)=>o-c),s=[8.4,Bn,5.05];i.line("井底联络道",[pi,s]);const r=[s],a=new Map;for(const o of n){const c=r.at(-1);if(e)r.push([8.4,o,5.05]);else{const l=Math.ceil((o-c[1])/1.28);for(let d=1;d<=l;d++){const[u,,h]=r.at(-1),f=d===l?o:c[1]+(o-c[1])*d/l,g=u===8.4?9.02:8.4;r.push([u,f,h===5.05?-3.35:5.05]),r.push([g,f,r.at(-1)[2]])}}a.set(o,r.at(-1))}return i.line(e?"通风人行天井":"折返式采准斜坡道",r,e?"shaft":"ramp"),o=>a.get(o)}function na(i,t,e,n=mi){const s=[t,n,e],r=[Ri,n,e];return i.line("回风穿脉",[s,r,[Ri,n,Un]]),s}function Fn(i,t,e,n,s="drift"){const r=[n[0],e[1],e[2]],a=[n[0],e[1],n[2]];i.line(t,[e,r,a,n],s)}function av(i){const t=[],{edges:e,network:n,routes:s}=i,r=new Set([pn(pi)]),a=[pn(pi)];for(let o=0;o<a.length;o++)for(const c of n.get(a[o])??[])r.has(c)||(r.add(c),a.push(c));for(const{a:o,b:c,name:l,kind:d,cut:u}of i.links)(!r.has(pn(o))||!r.has(pn(c)))&&t.push("孤立构筑物 "+l+" "+pn(o)),u&&!["ramp","chute"].includes(d)&&!sv(o,c)&&t.push("井巷剖切方向错误 "+l);for(const{name:o,points:c,type:l}of s){c.length<2&&t.push("路线过短 "+o),l==="ore"&&!qs(c.at(-1),Os)&&t.push("矿流未到地表卸矿端 "+o),l==="fill"&&!qs(c[0],ji)&&t.push("充填线路未从供料端开始 "+o);for(let d=1;d<c.length;d++){const u=c[d-1],h=c[d],f=e.get(eu(u,h));if(!f){t.push("流线跨过未连接节点 "+o+" "+pn(u)+" → "+pn(h));continue}["gravity","chute","bell"].includes(f.kind)&&h[1]>=u[1]&&t.push("矿石沿溜井逆重力运动 "+o),l==="fill"&&f.kind!=="pipe"&&t.push("料流离开充填管 "+o),l==="ore"&&["pipe","ramp","fillBore","service"].includes(f.kind)&&t.push("矿流进入不对应的线路 "+o)}}return t}const ji=[-7.2,10.52,4.42];function ml(i,{name:t,high:e,collar:n,branch:s,nozzle:r,active:a,endRise:o=0,bore:c=!1}){const l=[Ri,10.52,Un],d=[n[0],10.52,n[2]],u=[n[0],e,n[2]],h=s.map((v,E)=>[v[0],v[1]+.39+(E===s.length-1?o:0),v[2]]),f=[d[0],d[1]+.1,d[2]],g=[ji[0],ji[1]+.1,ji[2]],x=[u[0],e+.4,u[2]];i.line("地表充填站检修联络道",[l,ji,[d[0],10.52,Un],d],"surface","rock",!1),i.volume("地表充填站",[-7.65,-6.65,10.53,11.2,3.91,4.93],"fill","fill"),c?i.line("地表充填钻孔",[d,u],"fillBore"):i.line("上部充填干线井",[d,u],"shaft"),i.line(t,[u,...s],"service");const m=h.at(-1);m[1]>r[1]&&m[0]===r[0]&&m[2]===r[2]&&m[1]-r[1]>.72&&(i.line("采场充填天井／下料孔",[m,r],"fillBore"),i.line(null,[m,s.at(-1)],"fillBore"));const p=[ji,g,[f[0],g[1],g[2]],f,x,...h,r];i.line("充填管路",p,"pipe","fill",!1),i.fitting("充填下料口",r,"nozzle","fill");for(let v=1;v<h.length;v++){const E=h[v-1],b=h[v];if(E[0]===b[0]&&E[2]===b[2])continue;const T=E.map((A,_)=>(A+b[_])/2);i.fitting("近顶吊挂充填管",T,"hanger","fill")}i.pipelines.push({name:t,nozzle:r,active:a,route:p,gallery:[u,...s],nearRoof:h}),a&&i.flow("料浆 → 充填天井或下料管 → 待填区域",p,"fill")}const tt=-5.7,xt=5.7,ov=1.64,se=8.69,me=1.28,Je=2.62,Ln=3.26,Qe=-3.25,Xe=tt+.76,gl=[-4.9,-2.45,0,2.45,4.9],Qc=i=>[...new Set(i)].sort((t,e)=>t-e),Qn=(i,t,e)=>i.map(n=>[n,t,e]),Ji=(i,t,e,n,s,r=me,a=Je)=>i.volume(t,[e,n,r,a,Qe,Ln],s),Ot=(i,t,e,n,s,r,a,o,c=o)=>i.volume(t,[e,n,s,r,-a,a],o,c);function lv(i,t){const e=i.phase,n=t==="longwall",s=t==="flatfill",r=t==="room",a=[-4.55,-1.5,1.55,4.55],o=r?e===3?[-1,1,2.35,Ln]:[Qe,Qe,Qe,Qe]:[],c=[tt,tt,Xe,-1.7,s||n?-.04:xt,3.15,xt][e],l=Ln-.08,d=3.38,u=Qe+.16,h=r?a:[-4.7,-2.05,.4,2.75,4.95],f=Qn(h,Bn,5.05);if(Js(i,{thin:!0,high:d,haulStops:f}),i.volume("底板围岩剖面",[tt-.1,xt+.1,.06,me-.035,Qe,l+.2],"rock","rock"),e>=1){const x=na(i,ze,u,d),m=l+.46,p=h.map((T,A)=>{const _=[T,me,l],y=[T,Bn,m],L=fl(i,"放矿斜溜井 "+(A+1),[_],y,{inclined:!0});return i.line("装车巷道联络 "+(A+1),[y,f[A]]),[...L(_),...f.slice(A),$s,...i.transport.slice(2)]}),v=r?a:e>=2?[Xe,...e>=3?[c===xt?5.35:c-.36]:[]]:[],E=Qc([tt,...v,...h,xt]);i.line(e>=2?"低侧切割平巷":"低侧装矿联络巷",Qn(E,me,l));const b=Qc([tt,...r?a:[Xe,c===xt?5.35:c-.36],ze]);if(i.line("高侧联络与回风道",[...Qn(b,me,u),x]),e>=2){if(r)for(const[T,A]of a.entries())i.line("矿房 "+(T+1)+" 中心上山",[[A,me,l],[A,me,Math.max(u,Math.min(l,o[T]))],[A,me,u]]);else{const T=c===xt?5.35:c-.36;e<=3&&i.line("边界切割上山",[[Xe,me,l],[Xe,me,u]]),e>=3&&i.line("全厚回采作业带",[[T,me,l],[T,me,.9],[T,me,u]],"face")}if(e>=3&&!(n&&e===6)&&!(s&&e===6)){const T=r?a[e===3?1:3]:c===xt?5.35:c-.36,A=[T,me,r?Math.max(u,Math.min(l,o[e===3?1:3])):.9],_=h.reduce((R,N,U)=>Math.abs(N-T)<Math.abs(h[R]-T)?U:R,0),y=h[_];i.label("本工序出矿斜溜井",[y,(me+Bn)/2,l+.23],"access");const L=E.filter(R=>R>=Math.min(T,y)&&R<=Math.max(T,y));T>y&&L.reverse(),i.flow("工作面 → 低侧切割平巷 → 分布式斜溜井 → 阶段运输",[A,...Qn(L,me,l),...p[_]])}}else Fn(i,"边界采准联络",[tt,me,l],[tt,me,u]);if(s){const T=e>=4?e===6?xt:e===4?-1.25:1.68:tt,A=e<4?Xe-.22:T-.43,_=Je-.53;ml(i,{name:"上阶段沿脉充填巷与条带支路",high:_,collar:[tt-.88,0,u-.55],branch:[[A,_,u-.55],[A,_,e>=4?1.8:u-.29]],nozzle:[A,Je-.3,e>=4?1.8:u-.29],active:e>=4}),e>=4&&e<6&&(i.volume("沿走向拦砂隔层",[T-.08,T+.08,me,Je,Qe,l-.24],"fill","bulkhead"),i.volume("低侧脱水砂门",[T-.57,T-.15,me,me+.45,l-.57,l-.41],"fill","bulkhead"),i.fitting("砂门泄水孔",[T-.36,me+.21,l-.41],"drain","fill"))}}if(r){if(e<3)Ji(i,"待采矿层",tt,xt,"ore");else{const x=[tt,-3.05,0,3.05,xt];for(const[m,p]of o.entries()){const v=Math.min(p,Ln-.05);i.volume("第 "+(m+1)+" 矿房",[x[m],x[m+1],me,Je,v,Ln],"void"),i.volume(null,[x[m],x[m+1],me,Je,Qe,v],"ore");for(const E of[-2.1,.08,1.95]){if(m===3||E<=v+.45)continue;const b=x[m+1],T=.36;i.volume("规则圆柱形点柱",[b-T,b+T,me,Je,E-T,E+T],"pillar","roundPillar")}}for(const m of[tt-.43,xt])Ji(i,"盘区边界矿柱",m,m+.43,"pillar")}return}if(Ji(i,"待采矿层",c,xt,"ore"),e===2&&Ji(i,"切割上山自由面",tt,Xe,"void"),e<3)return;const g=s?[tt,tt,tt,tt,-1.25,1.68,xt][e]:n?[tt,tt,tt,tt,-1.31,1.6,xt][e]:tt;if(Ji(i,n||s?"回采作业带":"采空区",g,c,"void"),c<xt&&i.mark("贯穿矿层的回采工作面",[c,Je,Qe],[c,Je,Ln-.08]),s&&e>=4){const x=[tt,tt,tt,tt,tt,-1.25,1.68][e];Ji(i,"已完成的分带充填体",tt,x,"fill");const m=6;for(let p=0;p<m;p++){const v=Ln-(Ln-Qe)*p/m,E=Ln-(Ln-Qe)*(p+1)/m;i.volume(p===0?"自低侧向高侧分带充填":null,[x,g,me,Je,E,v],"fill","fill"),i.volumes.at(-1).fillSequence=p/(m-1)}}if(n&&(i.volume("崩落顶板",[tt,g,me,Je+.72,Qe,l-.12],"waste","rubble"),i.volume("采场上方围岩",[g,xt,Je+.08,Je+.48,Qe-.08,-2.48],"rock")),!s&&!n)for(const[x,m,p]of[[-4.22,-1.95,.69],[-3.1,.53,.45],[-4.55,2.12,.39],[-1.12,-1.45,.55],[1.25,1.24,.7],[3.53,-.25,.58]])x+p<c&&i.volume("选择性支撑矿柱",[x-p,x+p,me,Je,m-p,m+p*.71],"pillar","irregular");if((s||n)&&e<6)for(let x=Qe+.42;x<2.9;x+=.77){const m=c-.52;i.mark("工作带支柱",[m,me,x],[m,Je,x],"pillar")}}function nu(i,t,e,{name:n="阶段电耙",baseStyle:s="pillar",active:r=!0,positions:a=gl}={}){const o=e+.58,c=[...a,ze],l=[ze,t,vi];if(i.line(n+"出矿巷",[...Qn(c,t,o),l]),Ot(i,s==="concrete"?"堑沟式人工假底柱":n+"底柱",tt-.25,xt+.25,t-.22,t+.95,e,"pillar",s),r)for(const d of a)i.line(n+"漏斗及斗颈",[[d,t+.93,.8],[d,t,.8]],"bell"),i.line(n+"装运横巷",[[d,t,.8],[d,t,o]]);return d=>[[d,t+.93,.8],[d,t,.8],...Qn(c.filter(u=>u>=d),t,o)]}function _l(i,t,e=ov,n=se,s=!0){s&&Ot(i,"顶柱",tt-.54,xt+.54,n,n+.48,t,"pillar"),Ot(i,"两侧间柱",tt-.58,tt,e,n,t,"pillar"),Ot(i,"两侧间柱",xt,xt+.58,e,n,t,"pillar")}function vl(i,t,e,n,s,r=1.2){for(let a=-3;a<=3;a++)i.mark(t,[e,n,s-.03],[e+a*r/3,n+r*(1.37-Math.abs(a)*.12),s+.035])}function cv(i,t){const e=i.phase,n=t==="shrink",s=t==="stage",r=t==="subdrill",a=t==="forced",o=t==="natural",c=n?1.42:t==="stage"?2.1:2.68,l=1.65,d=l-.93,u=s?[se+.15]:a?[2.85,4.16,5.47,6.78,8.09]:r?[2,4.18,6.34]:[],h=[-4.9,-2.45],f=e<2?tt:e===2?Xe:e===3?-2.9:e===4?2.8:xt,g=r?e===5?xt-.08:e>=3?f:Xe:tt;if(Js(i),!a&&!o&&_l(i,c,l,se,!0),e>=1){const p=[...new Set([d,...u,...n||o?[mi]:[]])],v=ca(i,p,!s),E=pl(i,[d]),b=nu(i,d,c,{active:e>=2,name:s?"阶段铲运":"阶段电耙",baseStyle:s?"concrete":"pillar"});if(n||o){const T=n?Math.min(se-.27,[l,l,l+.33,4.73,8.27,8.27][e]):5.85,A=[xt+.31,d,c+.35],_=[xt+.31,mi,c+.35],y=[ze,d,vi],L=[xt+.31,T,c+.35];if(Fn(i,"天井下部联络道",y,A),i.line(o?"边界切帮及观察天井":"人行通风天井",[A,L,_],"shaft"),Fn(i,"天井上部联络道",v(mi),_),n){const R=na(i,tt-.31,c+.35),N=[tt-.31,T,c+.35],U=[tt-.31,d,c+.35];Fn(i,"另一端天井井底联络",y,U),i.line("另一端人行通风天井",[U,N,R],"shaft"),e>=2&&i.line("另一端分层联络道",[N,[tt,T,c+.35],[tt,T,c-.15]])}if(e>=2&&i.line(o?"切帮观察联络道":"分层人行联络道",[L,[xt,T,c+.35],[xt,T,c-.15]]),o&&e>=2){const R=na(i,tt-.29,c+.36),N=[R[0],6.55,R[2]],U=[R[0],d,R[2]];Fn(i,"切帮井下部联络",y,U),i.line("另一端切帮天井",[U,N,R],"shaft"),i.line("切帮平巷",[N,[tt,N[1],N[2]],[tt,N[1],-c]])}}if(u.length)for(const[T,A]of u.entries()){const _=[xt+.06,A,c-.14];Fn(i,s?"上部钻机联络道":"凿岩层联络道 "+(T+1),v(A),_),i.line(s?"顶部凿岩硐室":"凿岩巷／硐室 "+(T+1),[_,[g,A,c-.14]])}if(e>=2&&r&&e<=3){const T=[g,u[0],c-.14];i.line("切割天井",[T,[T[0],se,T[2]]],"shaft")}if(e>=3&&!(r&&e===5)&&!(a&&e===3)){const T=o?e>=4?[-2.45,0,2.45]:[0]:a||r?h:gl;for(const A of T)i.flow("底部漏斗 → 阶段运输 → 主井",[...b(A),...E(d)])}}if(o)return hv(i,c,l);if(n){const p=[l,l,2.26,5.25,se,se][e];if(Ot(i,"未采矿体",tt,xt,p,se,c,"ore"),e===2&&Ot(i,"水平拉底空间",tt,xt,l,p,c,"void"),e>=3){Ot(i,"空场与凿岩空间",tt,xt,l,p,c,"void");const v=[0,0,0,4.47,7.54,2.04][e];Ot(i,e===5?"最终放矿残余矿堆":"留矿作业平台",tt,xt,l,v,c,"broken","rubble")}return}if(s){const p=[l,l,2.54,5.84,se][e];if(Ot(i,"原生矿体",tt,xt,p,se,c,"ore"),e>=2&&Ot(i,e===2?"拉底补偿空间":"阶段全高矿房",tt,xt,l,p,c,"void"),e===3){Ot(i,"暂存松散矿石",tt,xt,l,3.45,c,"broken","rubble");for(let v=-5.24;v<xt;v+=.86)i.mark("顶部下向平行深孔",[v,se+.12,c-.14],[v,p,c-.14])}e===4&&Ot(i,"底部装运余矿",tt,xt,l,l+.4,c,"broken","rubble");return}if(a){if(Ot(i,"相邻待采矿块",.28,xt,l,se,c,"ore"),Ot(i,"待强制崩落矿块",tt,.28,[l,l,3.1,se,se][e],se,c,"ore"),e===2){Ot(i,"下部补偿空间",tt,.28,l,3.1,c,"void");for(const v of u.filter(E=>E>3.1))i.mark("侧向水平深孔",[tt,v,c-.14],[.28-.16,v,c-.14])}if(e>=3){const v=e===3?7.98:5.35;Ot(i,"全阶段崩落矿堆",tt,.28,l,v,c,"broken","rubble"),Ot(i,"覆盖岩随放矿下降",tt,.28,v,se+.37,c,"waste","rubble")}Ot(i,"上覆围岩",tt,xt,se+.36,se+.85,c,"rock","rockLight");return}const x=e===3?[f+.34,f,f-.36]:[f,f,f],m=[l,4.14,6.28,se];for(let p=0;p<x.length;p++)Ot(i,"待采矿体",x[p],xt,m[p],m[p+1],c,"ore"),Ot(i,e===2?"侧向切割槽":"贯通的阶段矿房",tt,x[p],m[p],m[p+1],c,"void");if(e>=3&&e<5){Ot(i,"落矿汇至同一底部",tt,f-.25,l,e===3?2.95:2.12,c,"broken","rubble");for(const p of u)vl(i,"分段上向扇形孔",Math.min(f+.75,xt-1),p,c)}}function hv(i,t,e){const n=i.phase,s=[0,0,3.4,3.25,4.65,5.85][n],r=[0,0,.63,2.94,5.38,7.83][n],a=[0,0,3.4,3.4,4.75,5.85][n],o=25;for(let c=0;c<o;c++){const l=tt+(xt-tt)*c/o,d=tt+(xt-tt)*(c+1)/o,u=(l+d)/2,h=Math.abs(u)<s?r*Math.sqrt(1-(u/s)**2):0,f=Math.abs(u)<a?.61:0,g=Math.min(se,e+Math.max(h,f));if(Ot(i,null,l,d,g,se,t,"ore","plainOre"),n===2&&Ot(i,null,l,d,e,g,t,"void","thinVoid"),n>=3){const x=n===5?Math.min(6.52,g-.22):g-.19;Ot(i,null,l,d,e,x,t,"broken","rubble"),n===5&&Ot(i,null,l,d,Math.max(e,x),g,t,"waste","rubble"),i.mark(null,[l,g,t+.03],[d,g,t+.03])}}i.label("上覆围岩",[1.6,se+.57,t],"rock"),n<5?Ot(i,null,tt,xt,se+.04,se+.82,t,"rock","rockLight"):(Ot(i,null,tt,-2.8,se+.04,se+.82,t,"rock","rockLight"),Ot(i,null,2.8,xt,se+.04,se+.82,t,"rock","rockLight"),Ot(i,"崩落带贯入覆岩",-2.8,2.8,se-.04,se+.77,t,"waste","rubble")),n<5&&i.label("未崩矿体",[3.8,7.6,t],"ore"),n===2&&i.label("拉底自由面",[.5,e+.5,t+.02],"void"),n>=3&&i.label("自然崩落前缘",[0,Math.min(se,e+r),t+.04],"work")}function uv(i,t){const e=i.phase,n=t==="subroom",s=n?2.4:2.58,r=[1.52,5.24],a=[4.84,8.55],o=n?e>=3&&e<=5?1:e>=6?0:-1:e===3||e===4?0:e===6||e===7?1:-1;if(Js(i),n?(Ot(i,"保留间柱",xt,xt+.58,r[0],a[1]+.43,s,"pillar"),e<4&&Ot(i,"上分段待回收间柱",tt-.58,tt,r[1],a[1],s,"pillar"),e<7&&Ot(i,"下分段待回收间柱",tt-.58,tt,r[0],a[0],s,"pillar"),e<5&&Ot(i,"上段待回收顶柱",tt,xt,a[1],a[1]+.43,s,"pillar")):_l(i,s,r[0],a[1]),n&&e<8)for(let u=0;u<8;u++){const h=-s+2*s*u/8,f=(u/7-.5)*.38;i.volume("分段间斜顶柱",[tt,xt,a[0]+f,r[1]+f,h,h+2*s/8],"pillar")}const c=r.map(u=>u+.22),l=e>=1?ca(i,r):null,d=e>=1?pl(i,r):null;for(const[u,h]of r.entries()){const f=a[u],g=n?u===1?e>=2:e>=6:u===0?e>=2:e>=6,x=n?u===1?e>=4:e>=7:u===0?e>=4:e>=7,m=!n&&(u===0?e>=5:e>=8),p=x?xt:u===o?.82:g?Xe:tt;if(n){for(let W=0;W<8;W++){const P=-s+2*s*W/8,k=(W/7-.5)*.38,G=u===1?h+k:h,V=u===0?f+k:f;i.volume(null,[p,xt,G,V,P,P+2*s/8],"ore","plainOre"),i.volume(null,[tt,p,G,V,P,P+2*s/8],"void","thinVoid")}p>tt&&i.label("分段 "+(u+1)+" 矿房空间",[(tt+p)/2,h+1.1,s],"void"),p<xt&&i.label("分段 "+(u+1)+" 未采矿体",[(p+xt)/2,h+1.05,s],"ore"),u===1&&e>=6&&Ot(i,"上分段处理后的空区",tt,xt,h,f,s,"waste","rubble"),u===0&&e===8&&Ot(i,"斜顶柱回收后的处理区",tt,xt,f-.25,f+.52,s,"waste","rubble")}else Ot(i,"分段 "+(u+1)+" 未采矿体",p,xt,h,f,s,"ore"),Ot(i,"分段 "+(u+1)+(m?" 胶结充填体":" 切割与回采空间"),tt,p,h,f,s,m?"fill":"void"),u===0&&Ot(i,"分段隔离层",tt,xt,f,r[1],s,"pillar");if(e===0)continue;const v=n&&(e===4||e===5||e===7||e===8)&&u===o,E=v?tt+.46:Math.max(Xe,Math.min(xt-.1,p-.23)),b=s+.68,T=[ze,h,vi],A=[ze,h,b],_=[xt+.36,h,b],y=[E,h,b],L=[E,h,s-.15];if(Fn(i,"分段设备联络道 "+(u+1),l(h),T),i.line("分段运输平巷 "+(u+1),[T,A,_,y]),i.line("分段装运横巷 "+(u+1),m?[y,[E,h,s+.21]]:[y,L]),m){i.volume("充填挡墙 "+(u+1),[E-.4,E+.4,h-.08,h+.67,s+.12,s+.28],"fill","bulkhead");continue}const R=[E,c[u],s-.15],N=[xt,c[u],s-.15],U=[Xe,c[u],s-.15];if(i.line(n?"堑沟平巷与装矿口 "+(u+1):"下部装矿口 "+(u+1),[L,R,U]),i.line("分段凿岩平巷 "+(u+1),[R,N]),g&&!x&&(i.line("分段切割天井 "+(u+1),[U,[Xe,f-.21,s-.15]],"shaft"),u!==o&&Ot(i,"分段切割槽 "+(u+1),tt,Xe,h,f,s,"void")),u===o){x||vl(i,"分段扇形凿岩",p+.27,c[u],s);const W=v?"回收矿柱矿石":"分段落矿堆";i.volume(W,[Math.max(tt-.15,E-1.1),E,h,h+.74,-s+.2,s],"broken","rubble"),i.flow("本分段装运 → 矿石溜井 → 阶段运输",[L,y,_,A,...d(h)])}}if(!n&&e>=1){const u=e>=6?1:0,h=a[u]+.16;ml(i,{name:"上部凿岩巷兼充填联络",high:h,collar:[tt-.91,0,-s-.42],branch:[[tt+1.7,h,-s-.42],[tt+1.7,h,-1.15]],nozzle:[tt+1.7,a[u]-.48,-1.15],active:e===5||e===8,bore:!0})}}function dv(i,t){const e=i.phase,n=t==="underhand",s=n?2.24:1.85,r=[1.78,4.03,6.28,8.53],a=n?[2,1,0]:[0,1,2],o=[0,0,0,0,0,1,1,2,2][e],c=e>=4&&e%2===0,l=[0,0,0,0,1,1,2,2,3][e],d=e>=2&&!c,u=-4.4;if(Js(i),n?i.volume("上盘围岩",[tt,xt,r[3],r[3]+.42,-s,s],"rock","rockLight"):_l(i,s,r[0],r[3]),e>=1){const h=r.slice(0,3).map(y=>y+.12),f=ca(i,h,!n);i.line("井底装运联络道至提升车场",[Xs,$s]);const g=n?[.45]:[.45,3.63],x=.55,m=h[a[o]],p=g.map((y,L)=>{const R=[y,Bn,x],N=h.filter(P=>P<=m).map(P=>[y,P,x]),U=fl(i,n?"分层中央溜矿井":"顺路放矿溜井 "+(L+1),N,R),W=[y,Bn,3.65];return i.line("井底装矿道 "+(L+1),[R,W,Xs]),P=>[...U([y,P,x]),W,...i.transport]});for(let y=0;y<h.length;y++){const L=h[y],R=[ze,L,vi];Fn(i,"分层联络道 "+(y+1),f(L),R);const N=[xt-.4,L,n?.04:s-.13],U=[N[0],L,s+.55],W=[ze,L,U[2]];if(i.line("分层运输巷 "+(y+1),[R,W,U]),d&&y===a[o]){const P=[e===2?tt+.44:-1.3,L,N[2]],k=g[0],G=[k,L,P[2]],V=[k,L,x],st=e===2?[U,N,P]:[U,N,G,P];i.line(e===2?n?"上层切割平巷":"拉底巷道":"分层出矿作业通道",st),e>2&&(i.line(n?"分区至中央溜矿井":"作业面至顺路溜井",[G,V]),i.flow(n?"分区工作面 → 中央溜井 → 阶段运输":"当前作业面 → 顺路溜井 → 阶段运输",[P,G,...p[0](L)]))}a.indexOf(y)<l&&(i.volume((n?"分层脱水砂门 ":"充填隔墙 ")+(y+1),[N[0]-.31,N[0]+.32,L-.1,L+.57,s+.09,s+.28],"fill","bulkhead"),n&&i.fitting("砂门泄水孔",[N[0],L+.18,s+.28],"drain","fill"))}const v=r[a[o]+1],E=n?v-.57:mi-.56,b=n?2.3:u;ml(i,{name:n?"分层切割巷近顶充填支管":"上阶段充填巷与充填天井",high:E,collar:[tt-.91,0,n?.04:-.66],branch:n?[[tt+.04,E,.04],[b-1.2,E,.04],[b,E,.04]]:[[b,E,-.66]],nozzle:[b,v-(n?.26:.3),n?.04:-.66],active:c,endRise:n?1.2*Math.tan(Math.PI/36):0});const T=na(i,tt-.25,s+.34),A=[tt-.25,h[0],s+.34],_=[tt-.25,h[a[o]],s+.34];i.line(n?"回风人行天井":"顺路人行滤水井",[A,_,T],"shaft"),d&&i.line("采场人行联络口",[_,[tt-.25,_[1],s-.1],[tt+.42,_[1],s-.1]]),!n&&c&&i.fitting("滤水井泄水出口",A,"drain","fill")}for(const[h,f]of a.entries()){const g=r[f],x=r[f+1];if(h<l){const m=!n&&h<a.length-1;Ot(i,"第 "+(h+1)+" 轮充填体",tt,xt,g+(n?.16:0),x-(m?.11:0),s,"fill"),n&&Ot(i,"钢筋混凝土人工假顶 "+(h+1),tt,xt,g,g+.16,s,"fill","concrete"),m&&Ot(i,"充填体上的作业底板 "+(h+1),tt,xt,x-.11,x,s,"fill","concrete")}else if(h===o&&d){const m=e===2?g+.63:x;if((!n||e===2)&&Ot(i,e===2?"首层切割空间":"当前分层作业空间",tt,xt,g,m,s,"void"),Ot(i,"未采矿体",tt,xt,m,x,s,"ore"),n&&e>2)for(let p=0;p<6;p++){const v=-s+2*s/6*p,E=-s+2*s/6*(p+1),b=2.2+.52*Math.abs(p-2.5);i.volume("分区壁式回采前缘",[b,xt,g,x,v,E],"ore","plainOre"),i.volume("已采分区空间",[tt,b,g,x,v,E],"void","thinVoid")}e>2&&(i.volume("待装运矿堆",[-3.37,-.58,g,g+.75,-.56,s-.05],"broken","rubble"),i.mark(n?"下向分层作业面":"上向分层作业面",[-4.4,n?g:x,s+.05],[4.4,n?g:x,s+.05]))}else Ot(i,"未采矿体",tt,xt,g,x,s,"ore")}}function fv(i,t){const e=i.phase,n=3.04,s=t?[1.74,5.52]:[1.48,5.15];Js(i);const r=s.map(c=>t?c-.93:c),a=e>=1?pl(i,r):null,o=e>=1?ca(i,r,t):null;for(const[c,l]of s.entries()){const d=r[c],u=c===0?s[1]-(t?1.15:0):se,h=e>=3&&(c===1||e>=(t?6:4)),f=e>=2&&(c===1||e>=(t?5:3)),g=c===1,x=[ze,d,vi];if(e>=1&&Fn(i,"分段人行设备联络道 "+(c+1),o(d),x),t){const E=f?h?g?e===3?-1.9:e===4?.55:xt:-.76:Xe:tt;if(Ot(i,"分段未落矿体",E,xt,l,u,n,"ore"),e>=1){const b=nu(i,d,n,{name:"分段 "+(c+1)+" 电耙",active:f}),T=[Math.max(Xe,E-.18),l+.16,n-.12],A=[ze,l+.16,n-.12];if(Fn(i,"凿岩巷入口 "+(c+1),o(d),A),i.line("独立凿岩巷 "+(c+1),[A,T]),f&&!h&&i.line("切割井与堑沟联络 "+(c+1),[T,[T[0],u,T[2]]],"shaft"),h){const _=u-(e>=4?.97:.3);Ot(i,"分段崩落矿石",tt,E,l,_,n,"broken","rubble"),Ot(i,"侵入的覆盖岩",tt,E,_,u,n,"waste","rubble"),E<xt&&vl(i,"分段凿岩方向",Math.min(E+.8,xt-.95),l+.16,n,1.05);for(const y of gl.filter(L=>L<E-.15).slice(-2))i.flow("堑沟 → 漏斗 → 电耙巷 → 溜井",[...b(y),...a(d)])}else f&&Ot(i,"堑沟及小补偿空间",tt,E,l,u,n,"void")}else Ot(i,"分段底柱",tt,xt,l-.95,l,n,"pillar");continue}const m=g?[-4.7,-2.3,.1,2.5,4.9]:[-3.55,-1.15,1.25,3.65],p=f?h?g?[-n,-n,-n,-1.25,.02,1.63][e]:e===4?-1.5:-.24:-n+.48:-n;if(i.volume("原生矿体",[tt,xt,l,u,p,n],"ore"),h?(i.volume("端部后方崩落围岩",[tt,xt,l,u,-n,p-.19],"waste","rubble"),i.volume("端部松散矿堆",[tt,xt,l,l+1.05,p-.51,p],"broken","rubble")):f&&i.volume("初始切割槽",[tt,xt,l,u,-n,p],"void"),e<1)continue;const v=n+.6;i.line("分段运输平巷 "+(c+1),[...Qn([...m,ze],l,v),x]);for(const[E,b]of m.entries()){const T=[b,l,p],A=[b,l,v];if(i.line("分段 "+(c+1)+" 回采进路 "+(E+1),[T,A]),h){for(const _ of[-.75,0,.75])i.mark("端部上向扇形排孔",[b,l+.25,p],[b+_,l+2.08-.5*Math.abs(_),p+.12]);(E===1||E===m.length-1)&&i.flow("端部装矿 → 同一回采进路 → 分段运输",[T,...Qn([...m.slice(E),ze],l,v),...a(l)])}}f&&!h&&(i.line("初始切割平巷",Qn(m,l,p)),i.line("切割天井",[[m[0],l,p],[m[0],u,p]],"shaft"))}Ot(i,"上覆围岩",tt,xt,se,se+.55,n,"rock","rockLight")}function Ho(i,t){const e=new rv(t);if(["open","room","flatfill","longwall"].includes(i))lv(e,i);else if(["shrink","stage","subdrill","forced","natural"].includes(i))cv(e,i);else if(["subroom","subfill"].includes(i))uv(e,i);else if(["overhand","underhand"].includes(i))dv(e,i);else if(["pillared","pillarless"].includes(i))fv(e,i==="pillared");else throw new Error("Unknown method "+i);return e}const iu={rock:{name:"围岩与底板",color:"#7b8795"},ore:{name:"未采矿体",color:"#c48349"},pillar:{name:"矿柱与支护",color:"#a45b35"},access:{name:"井巷与底部结构",color:"#47c8c2"},void:{name:"切割空间与采空区",color:"#9cb7ca"},broken:{name:"松散矿石",color:"#edbd70"},waste:{name:"崩落围岩",color:"#a1adae"},fill:{name:"充填体与充填设施",color:"#79bc9a"},work:{name:"工序、矿流与料流",color:"#f4d865"}},Ze=(i,t,e,n,s,r,a,o,c)=>({name:i,section:t,summary:r,focus:a,steps:o,figure:{number:e,page:n,caption:s,extra:c,image:"./assets/ref-"+e+".jpg",original:"../B/B_p"+(n+22)+".png"}}),$e=["开拓","主井和阶段运输巷组成矿块的主通道，回风井与上部通道建立独立回风出口。各采场从阶段主通道接入。"],su={open:Ze("全面采矿法","11.2","11-2",278,"全面采矿法","在薄矿层内以连续工作面沿走向全面推进，采空区由选择留下的矿柱支撑。","对比工作面在倾向上的全宽与采空区中不规则分布的支撑矿柱。",[$e,["采准","在矿层低侧布置阶段运输巷与放矿溜井，上部设置联络回风通道。"],["切割","掘进切割平巷及边界切割上山，使初始工作面横贯矿层。"],["全面推进","以矿层全厚沿走向推进，保留局部支撑矿柱。矿石耙至低侧切割平巷，经溜井进入运输巷。"],["采完留柱","工作面推进到矿块边界。排空待运矿石，保留支撑矿柱。"]]),room:Ze("房柱采矿法","11.3","11-5",280,"房柱采矿法","在薄至中厚矿层内划分矿房，采房时有规律地留设承载矿柱。","沿各矿房中心上山查看矿房、横向联络巷和规则圆柱形点柱。",[$e,["采准","由底板运输巷接入放矿溜井及矿房中心上山，并布置矿房上部联络平巷。"],["切割","从低侧切割平巷和各矿房中心上山展开初始自由面。"],["回采矿房","沿各矿房的上山扩采，逐房形成开敞空间。矿石沿各自矿房运至低侧放矿溜井。"],["规则留柱","回采完所示矿房，规则圆柱形点柱继续承载顶板。"]]),shrink:Ze("留矿采矿法","11.4","11-9",283,"留间柱和顶底柱的留矿法","矿房自下而上分层回采。每轮局部放矿，其余松散矿石暂留作为上采作业平台。","用正视图追踪留矿堆上升，并查看最终放矿后顶柱、间柱和空场。",[$e,["采准","由阶段运输巷开掘底部漏斗颈和两侧人行通风天井，天井通过分层联络口进入矿房。"],["拉底辟漏","拉开矿房底部切割空间，并使其贯通漏斗。"],["分层上采、局部放矿","从留矿堆上方继续回采。只放出维持作业空间所需的矿量。"],["采至顶柱","逐层抬高工作面至顶柱下，房内仍保留大部分松散矿石。"],["最终放矿","人员撤离矿房。暂留矿石从漏斗集中放出，留下空场。"]]),stage:Ze("阶段矿房法","11.6.2","11-31",297,"垂直平行深孔落矿阶段矿房构造","采用教材的垂直深孔代表方案。阶段全高形成一个矿房，从顶端凿岩，底部集中出矿。","找出顶部凿岩硐室、朝下的深孔、底部拉底空间和同一阶段出矿水平。",[$e,["采准","从上部通道开凿岩硐室，下部建立装运横巷与阶段出矿系统。"],["底部拉底","由拉底巷扩出水平补偿空间，形成矿房下部自由面。"],["分层落矿","从顶部布置垂直深孔；靠近底部的矿层先落下，其后落矿面逐层向上推移。"],["最终出矿","矿石由底部装运横巷送入溜井，矿房成为阶段全高空场。"]]),subroom:Ze("分段矿房法","11.5","11-23",291,"分段矿房法典型方案","阶段内划分若干独立矿房分段，每个分段有自己的装运水平，并保留斜顶柱。","检查各分段的堑沟与装运横巷。矿石先在本分段运出，再经共用溜井下放。",[$e,["采准","斜坡道连通各分段，从分段运输巷分别掘进装运横巷、堑沟平巷和凿岩平巷。"],["切割","从堑沟一侧形成切割天井及切割槽，保留分段间的斜顶柱。"],["上分段回采","从切割槽侧逐排回采上分段，通过本分段的装运横巷出矿。"],["回收上段间柱","上分段矿房采完后先回收一侧间柱，矿石经该分段装运横巷运出。"],["回收上段顶柱","间柱矿石运完后回收上段顶柱，顶柱矿石落到同一分段的堑沟。"],["下分段接续","上分段空区处理后，下分段从独立切割槽展开，经下分段装运横巷和溜井出矿。"],["回收下段间柱","下分段矿房采完后，先回收紧邻矿房的一侧间柱。"],["回收斜顶柱","最后回收下分段的斜顶柱，分段底部装运其矿石并进行本区采空处理。"]]),subdrill:Ze("分段凿岩阶段矿房法","11.6.1","11-24",293,"沿走向布置的分段凿岩阶段矿房法","分段布置凿岩巷道，形成阶段全高的共同矿房。落矿汇入同一个阶段底部。","分段凿岩平巷提供凿岩位置，漏斗与电耙巷始终位于阶段底部。",[$e,["采准","从通风人行天井掘进各凿岩分段，阶段底部布置电耙巷、漏斗颈及溜井。"],["拉底与切割","形成底部拉底空间，通过切割天井形成矿房侧的竖直切割槽。"],["分段凿岩落矿","由各分段凿岩巷向同一侧向自由面落矿，上部分段略超前，下部共同出矿。"],["阶段底部出矿","各分段落矿下汇，经漏斗、电耙巷和溜井集中送到阶段运输巷。"],["阶段矿房采毕","矿房全高贯通，保留顶柱和间柱。"]]),flatfill:Ze("单层充填采矿法","12.1","12-1",308,"单层充填采矿法","薄矿层按全厚用壁式工作面推进，在工作面后方有计划地充填采空带。","看走向上依次排列的充填带、拦砂设施、支护作业带与待采矿体。",[$e,["采准","在矿层低侧布置放矿溜井，高侧布置上阶段联络和充填管路入口。"],["切割","以低侧切割平巷和边界上山形成初始工作面。"],["全厚推进","壁式工作面沿走向推进，边出矿边支护。矿石先至切割平巷，再经溜井外运。"],["后方充填","沿采空带布置充填管和砂门。料浆经上阶段沿脉巷与条带支管送达，从低侧向高侧分区充填。"],["推进与充填循环","工作面移至下一条带，上一轮充填体留在采空区内。"],["采毕充填","最后一条带出矿后补填，各轮充填带连成整体。"]]),overhand:Ze("上向水平分层充填法","12.2.1","12-2",310,"上向水平分层水力充填采矿法","由底向上逐个水平分层回采和充填。上一轮硬化的充填体成为下一轮作业底板。","比较第二层回采时作业面以下的充填体、顺路保留的溜井与上部充填入口。",[$e,["采准","设置上部充填天井、放矿溜井、穿脉巷和人行滤水井。"],["拉底","在矿房底部先拉底，打开首层作业空间。"],["首层落矿与出矿","由首层作业面出矿，矿石由放矿溜井下放。"],["首层充填","由上部充填巷经充填天井送入料浆。水从人行滤水井排出，充填体表面铺设作业底板。"],["第二层上采","以硬化充填体为作业底板，向上一层回采。"],["第二层充填","充填体升至第二层，顺路接高出矿和人行设施。"],["顶层回采","按同一循环回采本示例的顶层，顶柱留设。"],["接顶充填","最后一层出矿后充填接顶，保留独立的外围井巷。"]]),underhand:Ze("下向分层充填法","12.3.1","12-11",316,"下向分层水力充填采矿法","采用水力充填和钢筋混凝土人工假顶方案。先采上层，再在已形成的人工假顶下回采下层。","查看混凝土底板在下一轮成为顶板的位置，比较它与上向法的工作面关系。",[$e,["采准","建立分层联络和中央溜矿井。充填干线经专用井下放，分层支管在切割巷近顶敷设。"],["上层切割","先在最高分层开切割平巷，再从切割侧展布回采进路。"],["上层回采","上层分区回采，矿石经分层巷道进入溜井。"],["构筑假顶并充填","在上层底部铺设钢筋混凝土底板，设置挡墙，接顶充填并待其形成支承。"],["下层回采","在上层人工假顶保护下分区回采下一分层。中央溜井上段随工作面下降而退出。"],["下层充填","完成该层混凝土底板及充填后，才能进入更低一层。"],["底层回采","在既有人工假顶下回采本示例最低分层。"],["接顶充填","最低分层出矿后充填接顶，保留外围通道。"]]),subfill:Ze("分段充填采矿法","12.6.1","12-25",329,"空场嗣后充填的采准与出矿系统对照","采用分段空场嗣后充填方案。每个分段采场独立出矿，采完封堵后按采场整体充填。","先看分段凿岩、装运与出矿，随后看挡墙和充填管如何与出矿系统分开。教材图为阶段嗣后充填实例，用作系统对照。",[$e,["采准","采准斜坡道接通分段钻凿和装运巷，底层装运巷接入矿石溜井。"],["分段切割","用侧向切割槽连通本分段的钻凿和装矿空间。"],["首分段回采","从切割槽逐排落矿，由该分段装运横巷出矿。"],["首分段出净","完成首分段回采，从独立底部装运横巷清运末批松散矿石。"],["封堵与充填","出净后封堵出矿支路。供料管沿上部凿岩联络巷敷设，经独立充填孔进入采空区，整体充填并养护。"],["下一分段回采","首分段充填体稳定后，在上方独立分段重新切割、回采、出矿。"],["第二分段出净","继续回采至分段边界并清运末批矿石，形成独立采空区。"],["第二分段充填","封堵第二采场出矿口并整体充填，保持外围运输网络连通。"]],"https://www.chinamine-safety.gov.cn/fw/ksaqkj/zjjz/202506/W020250606454230501478.pdf"),longwall:Ze("单层崩落法","10.2.1","10-17",235,"庞家堡铁矿长壁式崩落法","采用直线长壁方案。工作面贯穿薄矿层沿走向推进，支护带后方逐步放顶。","观察支护带紧邻工作面、崩落围岩位于工作面后方，矿石由低侧溜井送出。",[$e,["采准","布置高侧安全通道、低侧装矿巷和放矿溜井。"],["切割","从低侧切割巷掘进矿块一侧的切割上山，贯穿矿层。沿低侧巷分布的斜溜井接到底板装车联络。"],["长壁推进","沿走向推进、支护及出矿；工作带后方是已采薄层空间。"],["回撤放顶","撤除后部支护使顶板围岩占据采空区，当前工作带仍保留支护。"],["推进与放顶循环","继续沿走向回采，出矿经未被崩落体封闭的低侧通道进行。"],["采毕放顶","完成最后一条带的出矿并退出采场，后续放顶收尾。"]]),pillared:Ze("有底柱分段崩落法","10.3","10-26",242,"有底柱分段崩落法","自上而下逐分段回采。分段保有底柱及专用出矿结构，凿岩巷与电耙巷在不同水平。","分别追踪上下分段的堑沟、斗颈、电耙巷和共用溜井。",[$e,["采准","各分段分别设凿岩巷、电耙巷和底柱内的斗颈，并接入溜井与阶段运输。"],["堑沟与小补偿空间","施工堑沟及切割天井，形成上分段的首采切割空间。"],["崩落上分段","上分段首采区域形成松散矿堆，矿石开始向专用底部结构移动。"],["上分段放矿","在覆岩下由漏斗经电耙巷及溜井出矿，上部覆盖岩逐步下移。"],["下分段切割","上分段放矿后启用下分段的切割天井，并扩出堑沟与小补偿空间。"],["下分段回采","下分段在覆岩下回采，矿石经自己的漏斗、斗颈和电耙巷进入溜井。"]]),pillarless:Ze("无底柱分段崩落法","10.4","10-33",250,"无底柱分段崩落采矿法典型方案","采用回采进路垂直矿体走向方案。进路兼作凿岩、端部出矿通道，上下分段错列。","切到俯视比较相邻分段错列进路；跟随矿流从退采端返回分段运输巷。",[$e,["采准","从脉外分段运输平巷掘进多条平行回采进路，相邻分段进路在平面错列。"],["端部切割","在远端用切割平巷和切割天井形成初始自由面。"],["上分段退采","上分段自切割端逐排向运输侧退采，从同一进路端部装运。下分段先完成自身端部切割。"],["下分段跟进","下分段在上分段领先的条件下接续退采，形成错开的回采前缘。"],["出矿线后移","出矿点随前缘后退，沿同一进路到运输平巷和溜井。"]]),forced:Ze("阶段强制崩落法","10.5.1","10-53",264,"设有补偿空间的阶段强制崩落法","阶段全高强制落矿，矿石进入预先形成的下部补偿空间，再由底部放出。","观察下部补偿空间先形成，随后阶段全高变成松散矿堆，覆岩随放矿下降。",[$e,["采准","阶段底部设漏斗、电耙巷及矿石溜井，侧部天井连接各凿岩硐室。"],["形成补偿空间","在待崩矿段下方拉出自由空间，并和漏斗上口连通。"],["全高强制落矿","人工落矿后，此次回采的全阶段矿柱状体转为松散矿堆。"],["底部放矿","底部成排放矿口协同出矿，覆盖围岩与矿石的界面随之下移。"]]),natural:Ze("阶段自然崩落法","10.5.2","10-59",268,"矿块回采阶段自然崩落法","阶段底部拉底并从下方连续控制放矿，崩落前缘在重力及原岩应力作用下逐步向上发展。","用正视图观察拉底、起始冒落和持续向上的拱状崩落前缘。",[$e,["采准","布置底部出矿系统，以及矿块周边的切帮与观察通道。"],["拉底与切帮","由矿块中部向两侧扩大底部拉底区域，露出矿体底面。"],["开始自然冒落","受重力及原岩应力作用，拉底上方首先冒落；矿石从底部结构放出。"],["崩落前缘上移","持续控制放矿，使崩落前缘向上和两侧发展，上部原生矿体仍可见。"],["贯通覆岩、持续出矿","崩落前缘抵达覆岩，继续从底部放矿，覆岩在高处逐步进入矿块。"]])},Dn=i=>new I(...i),Fr=new I(0,1,0),pv=i=>()=>(i=Math.imul(i,1664525)+1013904223>>>0,i/4294967296);function mv(i){const t=(n,s={})=>new Oh({color:n,roughness:.95,flatShading:!0,...s}),e=(n,s)=>{const r=t(n);return r.onBeforeCompile=a=>{a.vertexShader=a.vertexShader.replace("#include <common>",`#include <common>
varying vec3 samplePosition;`).replace("#include <begin_vertex>",`#include <begin_vertex>
samplePosition = (modelMatrix * vec4(position, 1.0)).xyz;`),a.fragmentShader=a.fragmentShader.replace("#include <common>",`#include <common>
        varying vec3 samplePosition;
        float grain(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 21.173))) * 43758.5453); }
      `).replace("#include <color_fragment>",`#include <color_fragment>
        float mineral = grain(floor(samplePosition * 48.0)) * 0.12;
        float seam = smoothstep(0.72, 0.94, sin(samplePosition.y * 13.0 + samplePosition.z * 1.7));
        diffuseColor.rgb *= 0.93 + mineral - seam * ${s};
      `)},r.customProgramCacheKey=()=>"strata:"+s,r};return{rock:e(i.rock,"0.13"),rockLight:e(i.rockLight,"0.16"),rockDark:e(i.rockDark,"0.12"),ore:e(i.ore,"0.09"),fill:e(i.fill,"0.14"),bulkhead:t(i.rockLight),concrete:t(i.concrete),pipe:t(i.pipe),pipeTrace:new df({color:i.pipe,dashSize:.19,gapSize:.11,depthWrite:!1}),void:t(i.trim,{transparent:!0,opacity:.13,depthWrite:!1,side:cn}),thinVoid:t(i.trim,{transparent:!0,opacity:.07,depthWrite:!1,side:cn}),pillar:e(i.pillar,"0.12"),foundation:t(i.rockDark),broken:t(i.broken),waste:t(i.waste),access:t(i.access),bed:t(i.bed),gallery:t(i.access,{transparent:!0,opacity:.19,depthWrite:!1,side:cn}),scraperFrame:t(i.concrete),trim:t(i.trim),slot:t(i.access,{transparent:!0,opacity:.22,depthWrite:!1,side:cn}),diagram:t(i.work,{emissive:i.work,emissiveIntensity:.11,depthTest:!1}),work:t(i.work,{emissive:i.work,emissiveIntensity:.14}),edges:new Qr({color:i.edge,transparent:!0,opacity:.33}),slotEdge:new Qr({color:i.trim,transparent:!0,opacity:.78})}}class gv{constructor(t){this.materials=t,this.root=new yn,this.layers={};for(const e of Object.keys(iu))this.layers[e]=new yn,this.root.add(this.layers[e]);this.annotations=[],this.layers.shaft=new yn,this.layers.base=new yn,this.root.add(this.layers.shaft,this.layers.base),this.pipeTrace=new yn,this.pipeTrace.visible=!1,this.activePipe=!1,this.layers.fill.add(this.pipeTrace),this.growingFill=[],this.flows=[],this.particles=new rl(1,0),this.seed=701}add(t,e,n,s=!0){const r=new un(t,this.materials[n]);if(this.info&&Object.assign(r.userData,this.info),s){const a=new kd(new Hd(t,25),this.materials[n==="slot"?"slotEdge":"edges"]);r.add(a)}return this.layers[e].add(r),r}box(t,e,n,s,r,a,o,c=o,l=0,d=!0){if(e-t<.025||s-n<.025||a-r<.025)return;const u=new ds(e-t,s-n,a-r);if(u.translate((t+e)/2,(n+s)/2,(r+a)/2),l){const h=u.attributes.position;for(let f=0;f<h.count;f++)h.setY(f,h.getY(f)-h.getZ(f)*l);u.computeVertexNormals()}return this.add(u,o,c,d)}rod(t,e,n,s,r=s,a=8){const o=Dn(t),c=Dn(e),l=c.clone().sub(o);if(l.lengthSq()<.001)return;const d=new Ws(n,n,l.length(),a),u=this.add(d,s,r,!1);return u.quaternion.setFromUnitVectors(Fr,l.normalize()),u.position.copy(o.lerp(c,.5)),u}loft(t,e,n){const s=[];for(let a=0;a<t.length;a++){const o=(a+1)%t.length;for(const c of[t[a],t[o],e[o],t[a],e[o],e[a]])s.push(...c.toArray())}const r=new tn;r.setAttribute("position",new Pe(s,3)),r.computeVertexNormals(),this.add(r,"access",n,!1)}rim(t,e="trim"){const n=new tn().setFromPoints([...t,t[0]]),s=new sa(n,this.materials.slotEdge);if(this.layers.access.add(s),e==="scraperFrame")for(let r=0;r<t.length;r++)this.rod(t[r].toArray(),t[(r+1)%t.length].toArray(),.018,"access",e)}gallery(t,e,n){const s=Dn(t),r=Dn(e),a=r.clone().sub(s),o=a.clone().cross(Fr).normalize();if(o.lengthSq()<.1){this.bore(t,e,{shape:"rectangle",radius:n.width*.34});return}const c=iv(n),l=a.length(),d=(m,p=1)=>c.map(([v,E])=>m.clone().addScaledVector(o,v*p).addScaledVector(Fr,E*p)),u=d(s),h=d(r);this.loft(u,h,"gallery"),this.rim(u),this.rim(h);const f=Math.floor(l/(n.support==="lining"?2.3:1.15));for(let m=1;m<=f;m++){const p=s.clone().lerp(r,m/(f+1));this.rim(d(p),n.support==="frames"?"scraperFrame":"trim")}const g=n.width*.5,x=o.clone().multiplyScalar(-n.width*.09);for(const m of[-1,1]){const p=o.clone().multiplyScalar(g*m);this.rod(s.clone().add(p).toArray(),r.clone().add(p).toArray(),.025,"access","trim"),n.rail&&(p.multiplyScalar(.48).add(x),this.rod(s.clone().add(p).toArray(),r.clone().add(p).toArray(),.022,"access","bed"))}if(n.rail)for(let m=.27;m<l;m+=.53){const p=s.clone().lerp(r,m/l).add(x),v=o.clone().multiplyScalar(g*.6);this.rod(p.clone().sub(v).toArray(),p.clone().add(v).toArray(),.024,"access","bed")}}bore(t,e,n){const s=Dn(t),r=Dn(e),a=r.clone().sub(s).normalize(),o=Math.abs(a.y)>.94?new I(1,0,0):a.clone().cross(Fr).normalize(),c=a.clone().cross(o).normalize(),l=[[1,1],[-1,1],[-1,-1],[1,-1]],d=n.shape==="circle"?Array.from({length:14},(g,x)=>{const m=2*Math.PI*x/14;return[Math.cos(m),Math.sin(m)]}):l,u=(g,x)=>d.map(([m,p])=>g.clone().addScaledVector(o,x*m).addScaledVector(c,x*p)),h=u(s,n.radius);if(n.shape==="hopper"){const g=u(s.clone().lerp(r,.69),n.radius*.36),x=u(r,n.radius*.36);this.loft(h,g,"slot"),this.loft(g,x,"slot"),this.rim(g),this.rim(x)}else{const g=u(r,n.radius);this.loft(h,g,"slot"),this.rim(g)}this.rim(h)}fitting({point:[t,e,n],shape:s,layer:r}){if(s==="grizzly"){for(const a of[-.16,-.08,0,.08,.16])this.rod([t-.23,e+.025,n+a],[t+.23,e+.09,n+a],.013,r,"trim",5);return}if(s==="gate"){for(const a of[-.18,.18])this.rod([t+a,e-.05,n],[t+a,e+.3,n],.024,r,"trim");this.rod([t-.19,e+.3,n],[t+.19,e+.3,n],.032,r,"trim"),this.box(t-.16,t+.16,e+.16,e+.25,n-.028,n+.028,r,"scraperFrame");return}if(s==="storage"){const a=new Ws(.29,.17,.31,12,1,!0);a.translate(t,e+.15,n),this.add(a,r,"slot");return}if(s==="drain"){for(const a of[-.13,0,.13])this.rod([t+a,e,n-.1],[t+a,e-.035,n+.18],.017,r,"bed");return}if(s==="nozzle"){this.rod([t,e+.14,n],[t,e,n],.082,r,"pipe");return}this.rod([t,e,n],[t,e+.11,n],.014,r,"scraperFrame",5)}label(t,e,n){this.annotations.push({layer:t,name:e,world:Dn(n)})}rubble(t,e,n,s,r=1){const[a,o,c,l,d,u]=e,h=pv(this.seed++),f=n*1.42*r,g=[];for(let v=a+f/2;v<o;v+=f)for(let E=d+f/2;E<u;E+=f)for(let b=c+f/2;b<l;b+=f){const T=()=>(h()-.5)*f*.75,A=[v+T(),b+T(),E+T()];s(...A)&&g.push(A)}if(!g.length)return;const x=new Od(this.particles,this.materials[t],g.length);this.info&&Object.assign(x.userData,this.info);const m=new Te,p=new Kt;g.forEach(([v,E,b],T)=>{m.position.set(v,E,b),m.rotation.set(h()*6,h()*6,h()*6);const A=n*(.6+h()*.6);m.scale.set(A,A*.75,A*(.7+h()*.48)),m.updateMatrix(),x.setMatrixAt(T,m.matrix),p.setScalar(.52+h()*.77),x.setColorAt(T,p)}),this.layers[t].add(x)}flow(t,e){const n=new sf;for(let o=1;o<t.length;o++)n.add(new Uh(Dn(t[o-1]),Dn(t[o])));if(!n.getLength())return;const s=e==="fill"?"fill":"work",r=e==="fill"?"bulkhead":"work";t.slice(1).forEach((o,c)=>{this.rod(t[c],o,.026,s,r)});const a=[];for(let o=0;o<3;o++){const c=new un(this.particles,this.materials[r]);c.scale.setScalar(.16),this.layers[s].add(c),a.push(c)}this.flows.push({path:n,particles:a})}}function ru(i){if(!i.cut||!i.section)return[];const{a:t,b:e,section:n}=i,s=n.radius??n.width/2,r=Math.abs(e[1]-t[1])>Math.hypot(e[0]-t[0],e[2]-t[2]),a=n.radius?r?.07:s:n.height+.02,o=n.radius&&!r?s:.075,c=t.filter((d,u)=>d!==e[u]).length>1,l=c?Math.max(2,Math.ceil(Math.hypot(...e.map((d,u)=>d-t[u]))/.35)):1;return Array.from({length:l},(d,u)=>{const h=t.map((m,p)=>m+(e[p]-m)*u/l),f=t.map((m,p)=>m+(e[p]-m)*(u+1)/l),g=c||h[0]===f[0]?s+.015:.045,x=c||h[2]===f[2]?s+.015:.045;return[Math.min(h[0],f[0])-g,Math.max(h[0],f[0])+g,Math.min(h[1],f[1])-o,Math.max(h[1],f[1])+a,Math.min(h[2],f[2])-x,Math.max(h[2],f[2])+x]})}const xl=(i,t)=>[0,2,4].every(e=>i[e]<t[e+1]-1e-6&&i[e+1]>t[e]+1e-6);function _v(i,t){if(!xl(i,t))return[i];const e=[],n=i.slice();for(const s of[0,2,4]){if(n[s]<t[s]-1e-6){const r=n.slice();r[s+1]=t[s],e.push(r),n[s]=t[s]}if(n[s+1]>t[s+1]+1e-6){const r=n.slice();r[s]=t[s+1],e.push(r),n[s+1]=t[s+1]}}return e}function Xr(i,t,e,n,s=0){return[t,e,n].every((r,a)=>r>i[a*2]+s&&r<i[a*2+1]-s)}function au(i){const t=i.links.flatMap(ru);return i.volumes.flatMap(e=>{const{bounds:n,layer:s,style:r}=e;if(s==="void"||r==="rubble"||r==="bulkhead")return[{...e,bounds:n}];const a=t.filter(o=>xl(n,o));return a.reduce((o,c)=>o.flatMap(l=>_v(l,c)),[n]).map(o=>({...e,bounds:o,cutFragment:a.length>0}))})}function vv(i){const t=av(i),e=au(i).filter(s=>s.layer!=="void"&&s.style!=="rubble");for(const s of i.links)if(s.cut)for(const r of[.05,.25,.5,.75,.95]){const a=s.a.map((o,c)=>o+r*(s.b[c]-o));if(e.some(({bounds:o,style:c})=>c!=="bulkhead"&&Xr(o,...a,.02))){t.push("井巷中心线被实体阻断 "+s.name+" "+a.join(","));break}}const n=e.filter(s=>s.style==="bulkhead");for(const s of i.routes.filter(r=>r.type==="ore"))for(let r=1;r<s.points.length;r++)n.some(({bounds:a})=>xv(s.points[r-1],s.points[r],a))&&t.push("矿流穿过封堵挡墙 "+s.name);return t}function xv(i,t,e){let n=0,s=1;for(let r=0;r<3;r++){const a=e[r*2]+.005,o=e[r*2+1]-.005,c=t[r]-i[r];if(Math.abs(c)<1e-6){if(i[r]<=a||i[r]>=o)return!1}else{const l=(a-i[r])/c,d=(o-i[r])/c;if(n=Math.max(n,Math.min(l,d)),s=Math.min(s,Math.max(l,d)),s<=n)return!1}}return s>n}function jc(i,t,e,n){const{bounds:s,layer:r,style:a}=t;if(a==="rubble"){const m=e.phase>3&&r==="broken"?.32:r==="waste"?.39:.31,p=e.links.flatMap(ru).filter(v=>xl(s,v));i.rubble(r,s,m,(v,E,b)=>Xr(s,v,E,b)&&!p.some(T=>Xr(T,v,E,b)));return}const[o,c,l,d,u,h]=s;if(a==="roundPillar"||a==="irregular"){const m=Math.min(c-o,h-u)/2,p=a==="irregular",v=p?m*.91:m,E=new Ws(v,m,d-l,p?7:32);E.translate((o+c)/2,(l+d)/2,(u+h)/2),i.add(E,r,"pillar");return}const f=a==="plainOre"?"ore":a,g=!t.cutFragment&&!["thinVoid","plainOre","rockDark"].includes(a),x=i.box(...s,r,f,0,g);x&&t.layer==="fill"&&t.style==="fill"&&!n.some(m=>m.style==="fill"&&Xr(m.bounds,(o+c)/2,(l+d)/2,(u+h)/2))&&i.growingFill.push({mesh:x,floor:l,delay:(t.fillSequence??0)*.83})}function Sv(i,t){const{a:e,b:n,kind:s,layer:r,section:a}=t;s==="surface"?i.rod(e,n,.055,"rock","rock"):s==="pipe"?i.rod(e,n,.055,r,"pipe",12):a?.radius?i.bore(e,n,a):a&&i.gallery(e,n,a)}const th=new Set(["shaft","gravity","chute","bell","fillBore"]),Mv={ore:"unmined",pillar:"unmined",void:"mined_out",waste:"caved_rock",access:"excavation",shaft:"excavation"};function yv(i,t,e,n,s,r,a){return{object_id:s,name:i,type_code:n,stage:r,mining_state:Mv[t]??(n==="FILL"?"backfill":n==="RETAINED"?"retained_ore":t==="broken"?"caved_ore":"object"),mined:["void","broken"].includes(t)||n==="FILL",backfilled:t==="fill"&&n==="FILL",textbook_ref:a,source_tier:"【教】",assumption:!0,dimensions:e??"教学示意"}}function bv(i,t,e,n=Ho(t,e)){const s=new gv(i),r=e?Ho(t,e-1):null,a=su[t],o="《采矿学（第2版）》§"+a.section+" · 图 "+a.figure.number,c=a.steps[e][0],l=(u,h,f,g,x)=>yv(u,h,f,g,t+"-"+x,c,o);for(const[u,h]of au(n).entries()){if(h.style==="foundation"&&h.bounds[3]<0){s.info=null;const x=s.layers.rock.children.length;jc(s,h,n,[]);const m=s.layers.rock.children.slice(x);m.length&&s.layers.base.add(...m);continue}const f=h.name??iu[h.layer].name,g=h.layer==="broken"?t==="shrink"?"RETAINED":"BROKEN":h.layer==="fill"?h.style==="fill"?"FILL":"SUPPORT":h.layer==="void"?"STOPE-A":h.layer.toUpperCase();s.info=l(f,h.layer,h.style==="roundPillar"?"圆柱形点柱":void 0,g,"v-"+u),jc(s,h,n,r?.volumes??[])}for(const[u,h]of n.links.entries()){const f=th.has(h.kind),g=s.layers.access.children.length,x=h.name??h.section?.name??"联络线";s.info=l(x,f?"shaft":h.layer,h.section?.name,f?"SHAFT":"DRIFT","r-"+u),Sv(s,h),f&&s.layers.access.children.length>g&&s.layers.shaft.add(...s.layers.access.children.slice(g))}s.info=null;for(const u of n.pipelines){const h=new sa(new tn().setFromPoints(u.route.map(Dn)),i.pipeTrace);h.computeLineDistances(),h.renderOrder=10,s.pipeTrace.add(h)}s.activePipe=n.pipelines.some(u=>u.active);for(const[u,h]of n.fittings.entries()){const f=s.layers.access.children.length;s.info=l(h.name??"井巷附属设施",h.layer,void 0,"FITTING","f-"+u),s.fitting(h),s.layers.access.children.length>f&&s.layers.shaft.add(...s.layers.access.children.slice(f))}s.info=null;for(const u of n.technical){const h=u.style==="work"?"diagram":u.style==="rock"?"rockLight":"pillar",f=s.rod(u.a,u.b,u.style==="work"?.028:.062,u.style,h);f&&h==="diagram"&&(f.renderOrder=8)}const d=new Set(n.links.filter(u=>th.has(u.kind)).map(u=>u.name));for(const u of n.fittings.filter(h=>h.layer==="access"))d.add(u.name);for(const{name:u,position:h,layer:f}of n.labels)s.label(d.has(u)?"shaft":f,u,h);for(const u of n.routes)s.flow(u.points,u.type);return s.routeNames=[...new Set(n.routes.map(u=>u.name))],s}function eh(i){for(const t of Object.values(i.layers))t.traverse(e=>{e.isInstancedMesh&&e.dispose(),e.geometry&&e.geometry!==i.particles&&e.geometry.dispose()});i.particles.dispose()}const Ya={ore:"#B8794C",pillar:"#A65F43",rock:"#83786B",rockLight:"#A89B87",rockDark:"#55483D",access:"#A59881",trim:"#D8C9A8",bed:"#655747",fill:"#829073",pipe:"#BCD3A5",concrete:"#B8B0A0",broken:"#D3A475",waste:"#8E877C",work:"#F2BD80",edge:"#453023"},Ds={ore:"矿体",pillar:"矿柱",access:"巷道",shaft:"井筒",void:"采场空区",fill:"充填体",broken:"崩落体",waste:"崩落体",work:"切割工程",rock:"围岩"},Ev=new Set(["shaft","gravity","chute","bell","fillBore"]),Tv={dev:{name:"开拓工程",color:"#967154"},prep:{name:"采准工程",color:"#A08064"},cut:{name:"切割工程",color:"#A6531F"},stope:{name:"回采与出矿",color:"#B46D42"},fill:{name:"充填作业",color:"#75866A"},post:{name:"采场处理",color:"#8D7563"}},Av=()=>{const i={...Ya},t=typeof document>"u"?null:getComputedStyle(document.documentElement);if(t)for(const e of Object.keys(Ya)){const n=e.replace(/[A-Z]/g,s=>"-"+s.toLowerCase());i[e]=t.getPropertyValue("--mf-model-"+n).trim()||Ya[e]}return i};function wv(i,t){return t===0?"dev":t===1?"prep":t===2||i==="下分段切割"?"cut":/充填$|充填循环/.test(i)?"fill":/放顶$|留柱$|矿房采毕$/.test(i)?"post":"stope"}function Rv(i){const t=new Set(["work","rock"]);for(const n of i){for(const s of n.volumes)t.add(s.layer);for(const s of n.links)t.add(Ev.has(s.kind)?"shaft":s.layer);for(const s of n.technical)t.add(s.style)}const e=Cv.filter(n=>t.has(n)).map(n=>Ds[n]);return[...new Set(e)]}const Cv=["ore","access","shaft","void","pillar","fill","broken","waste","work","rock"];function Pv(i){const t=new Tn,e=new I;for(const n of i){for(const{bounds:[s,r,a,o,c,l]}of n.volumes)t.expandByPoint(e.set(s,a,c)).expandByPoint(e.set(r,o,l));for(const s of n.links)for(const[r,a,o]of[s.a,s.b])t.expandByPoint(e.set(r,a,o));for(const{a:s,b:r}of n.technical)for(const[a,o,c]of[s,r])t.expandByPoint(e.set(a,o,c))}return t.expandByScalar(.3)}function Or(i,t){const{name:e,layer:n}=i;return t===0?/主井|阶段运输|回风井|上部回风|井架/.test(e)?8:2:/工作面|前缘|人工假顶|点柱|切割槽|充填下料口|本工序|凿岩硐室/.test(e)?10:/充填体|矿石溜井|中心上山|回采进路|放矿斜溜井 1$|漏斗/.test(e)?8:n==="rock"||/地表|井口|第 \d+ |联络道|附属设施/.test(e)?1:["fill","work","void","broken","pillar"].includes(n)?6:4}function Lv(i,t){const n=su[i].steps.map(([v,E],b)=>({label:v,note:E,phase:wv(v,b)})),s=n.length,r=[...new Set(n.map(v=>v.phase))].map(v=>({id:v,...Tv[v]})),a=n.flatMap((v,E)=>v.phase==="stope"?[E]:[]),o={cut:0,progress:a[Math.floor(a.length/2)]/(s-1)||.55},c=3.4,l=n.map((v,E)=>Ho(i,E)),d=Rv(l),u=["围岩"],h=n.map(v=>v.label),f=Pv(l),g=v=>nn.clamp(Number.isFinite(v)?Math.trunc(v)-1:0,0,s-1),x=v=>Math.round(nn.clamp(v,0,1)*(s-1)),m=(v={})=>{const E=new yn,b=new Map;for(const k of Object.keys(Ds)){const G=Ds[k];if(b.has(G))continue;const V=new yn;V.name="L_"+G,b.set(G,V),E.add(V)}const T=mv(Av()),A=new Nn;for(const k of Object.values(T))k.clippingPlanes=[A];let _,y=-1,L=v.variant??"iso",R=v.cut,N=0;function U(k){if(k!==y){if(_){for(const G of Object.values(_.layers))G.removeFromParent();eh(_)}y=k,N=0,_=bv(T,i,y,l[y]);for(const[G,V]of Object.entries(_.layers))G==="base"?E.add(V):b.get(Ds[G])?.add(V);_.pipeTrace.visible=_.activePipe,E.updateMatrixWorld(!0)}}function W(){return(_?.annotations??[]).filter(({world:k})=>A.distanceToPoint(k)>=0).sort((k,G)=>Or(G,y)-Or(k,y)).slice(0,8).map(({name:k,world:G,layer:V})=>({label:k,pos:G.toArray(),layer:Ds[V]}))}function P(){return{细部:(_?.annotations??[]).filter(({layer:G,world:V})=>["void","work","pillar","fill","shaft"].includes(G)&&A.distanceToPoint(V)>=0).sort((G,V)=>Or(V,y)-Or(G,y))[0]?.world.toArray()??f.getCenter(new I).toArray()}}return U(v.progress===void 0?g(v.step??s):x(v.progress)),Rs(A,f,{variant:L,cut:R}),{group:E,bounds:f.clone(),clipPlane:A,stepCount:s,step(k){return U(g(k)),R=void 0,Rs(A,f,{variant:L}),W()},explore(k){return U(x(k)),Rs(A,f,{variant:L,cut:R??0}),W()},setCut(k){R=nn.clamp(k,0,1),Rs(A,f,{variant:L,cut:R})},setVariant(k){L=k,R=void 0,Rs(A,f,{variant:L})},progressLabel:k=>n[x(k)].label,progressStep:k=>x(k)+1,focusPoints:P,animate(k,G){if(!_)return!1;N||(N=k);const V=(k-N)/1e3;for(const{path:st,particles:q}of _.flows)q.forEach((j,nt)=>{const Rt=G?(nt+1)/4:(V*.31+nt/3)%1;st.getPointAt(Rt,j.position),j.scale.setScalar(.085)});for(const{mesh:st,floor:q,delay:j}of _.growingFill){const nt=G?1:nn.clamp((V-j)/1.52,.035,1);st.scale.y=nt,st.position.y=q*(1-nt)}return!G&&(_.flows.length>0||_.growingFill.length>0&&V<2.45)},dispose(){if(_){for(const k of Object.values(_.layers))k.removeFromParent();eh(_)}_=void 0;for(const k of Object.values(T))k.dispose()}}};function p(v={}){const E=v.step??v.stage??s,b=m({...v,step:E}),T=b.step(E);return b.animate(1,!0),{group:b.group,anchors:T,bbox:{min:f.min.toArray(),max:f.max.toArray()},focusPoints:b.focusPoints()}}return{engineCode:t,PARAMS:{},steps:n,phases:r,STAGES:h,LAYERS:d,LAYERS_OFF:u,defaults:o,stepDuration:c,build:p,createLive:m,selfCheck:()=>l.flatMap((v,E)=>vv(v).map(b=>n[E].label+" · "+b))}}const Dv={comprehensive:["open","A-1"],"room-pillar":["room","A-2"],shrinkage:["shrink","S-3"],"stage-room":["stage","A-4"],"sublevel-room":["subroom","A-5"],"sublevel-drilling-stage-room":["subdrill","A-6"],"single-layer":["flatfill","B-1"],"upward-horizontal-slice":["overhand","F-9"],"downward-slice":["underhand","B-3"],"sublevel-backfill":["subfill","B-4"],"single-layer-caving":["longwall","C-1"],"sublevel-caving-bottom-pillar":["pillared","C-2"],"sublevel-caving-no-pillar":["pillarless","C-19"],"stage-forced-caving":["forced","C-4"],"stage-natural-caving":["natural","C-5"]},nh=Object.fromEntries(Object.entries(Dv).map(([i,[t,e]])=>[i,Lv(t,e)])),Nv={unmined:{label:"未开采矿体",short:"未开采",color:"#B45E36",mined:!1,backfilled:!1},mined_out:{label:"已回采空间",short:"已回采空腔",color:"#2A2622",mined:!0,backfilled:!1},caved_ore:{label:"崩落矿石（已回采）",short:"崩落矿石",color:"#855338",mined:!0,backfilled:!1},caved_rock:{label:"崩落围岩",short:"崩落围岩",color:"#716D64",mined:!1,backfilled:!1},retained_ore:{label:"留矿堆（暂留矿石）",short:"留矿堆",color:"#B07A48",mined:!0,backfilled:!1},residual:{label:"残留矿体（永久损失）",short:"残留矿体",color:"#95603E",mined:!0,backfilled:!1},backfill:{label:"充填体（已充填）",short:"充填体",color:"#78967F",mined:!0,backfilled:!0},backfill_pillar:{label:"人工矿柱（胶结充填）",short:"人工矿柱",color:"#78967F",mined:!0,backfilled:!0},current_slice:{label:"当前回采分层",short:"当前分层",color:"#B45E36",mined:!0,backfilled:!1},excavation:{label:"巷道/井筒（已开挖）",short:"巷道/井筒",color:"#83A0AB",mined:!0,backfilled:!1},object:{label:"工程对象",short:"工程对象",color:"#83A0AB",mined:!1,backfilled:!1}},Ka={id:"iso",label:"等轴测",az:34,el:26};function Iv(i){const t=i.querySelector("[data-model-select]"),e=i.querySelector("canvas"),n=e?.parentElement,s=i.querySelector("[data-model-status]"),r=i.querySelector("[data-model-poster]"),a=i.querySelector("[data-model-labels]"),o=i.querySelector("[data-model-controls]"),c=i.querySelector("[data-model-scope]"),l=i.querySelector("[data-model-process]"),d=i.querySelector("[data-model-article]"),u=i.querySelector("[data-model-view]"),h=i.querySelector("[data-model-layers]"),f=i.querySelector("[data-model-annotations]"),g=i.querySelector("[data-model-prev]"),x=i.querySelector("[data-model-play]"),m=i.querySelector("[data-model-next]"),p=i.querySelector("[data-model-scrub]"),v=i.querySelector("[data-model-step-count]"),E=i.querySelector("[data-model-step-title]"),b=i.querySelector("[data-model-step-note]"),T=i.querySelector("[data-model-selection]"),A=i.querySelector("[data-model-modes]"),_=i.querySelector("[data-model-step-phase]"),y=i.querySelector("[data-model-speed]"),L=i.querySelector("[data-model-auto]"),R=i.querySelector("[data-model-steps]"),N=i.querySelector("[data-model-rail]"),U=i.querySelector("[data-model-steps-total]"),W=i.querySelector("[data-model-explore]"),P=i.querySelector("[data-model-progress]"),k=i.querySelector("[data-model-progress-val]"),G=i.querySelector("[data-model-progress-name]"),V=i.querySelector("[data-model-cut]"),st=i.querySelector("[data-model-cut-val]"),q=i.querySelector("[data-model-hud]"),j=i.querySelector("[data-model-hud-phase]"),nt=i.querySelector("[data-model-hud-count]"),Rt=i.querySelector("[data-model-hud-title]"),Vt=Array.from(i.querySelectorAll("[data-model-mode]"));if(!e||!n||!s||!o||!l||!u||!h||!g||!x||!m||!p||!v||!E||!b||!a||!f||!T||!A||!_||!y||!L||!R||!N||!U||!W||!P||!k||!G||!V||!st)return;const $=i.classList.contains("model-studio--scrolly"),Mt=window.matchMedia("(min-width: 48rem)"),At=window.matchMedia("(prefers-reduced-motion: reduce)"),Ut=JSON.parse(i.dataset.modelJson??"[]"),yt=new Map(Ut.map(X=>[X.slug,X]));let et=yt.get(t?new URLSearchParams(location.search).get("method")??"":"")??yt.get(i.dataset.modelDefault??"")??Ut[0];if(!et)return;let de;try{de=new B_({canvas:e,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0})}catch{s.textContent="此浏览器无法运行三维模型。";return}de.setPixelRatio(Math.min(window.devicePixelRatio,1.75)),de.toneMapping=Vo,de.toneMappingExposure=1.04,de.localClippingEnabled=!0;const It=new Ed,le=getComputedStyle(i).getPropertyValue("--color-model-stage").trim();It.background=new Kt(le||"#211711"),It.add(new Rf(15851462,6705989,1.45));function ce(X,ct,vt,zt,S){const C=new Df(X,ct);C.position.set(vt,zt,S),It.add(C)}ce(16772566,2.1,110,170,90),ce(14802383,.82,-140,70,-110),ce(16762762,.5,30,60,-170);const Ft=new ln(38,1,.1,3200),$t=new z_(Ft,e);$t.enableDamping=!0,$t.dampingFactor=.09,$t.minDistance=7,$t.maxDistance=1e3,$t.listenToKeyEvents(e),e.addEventListener("keydown",X=>{if(X.key!=="+"&&X.key!=="="&&X.key!=="-")return;const ct=X.key==="-"?1.16:.86,vt=Ft.position.clone().sub($t.target);vt.setLength(nn.clamp(vt.length()*ct,$t.minDistance,$t.maxDistance)),Ft.position.copy($t.target).add(vt),Y(),X.preventDefault()});let re=null,Ae,jt=Ka,ne=1,ve=!1,Fe=0,Oe=0,be,F=0,fe="process",Bt=null,te=.55,ut=0,ye=1,Dt=!0,kt=!1,w=!1,M=[];const H=new Set,rt=new Gf,Q=new wt;function ht(X){a.replaceChildren(),M=X.map(({label:ct,pos:vt,layer:zt})=>{const S=document.createElement("span");return S.className="studio-label",S.textContent=ct,a.append(S),{node:S,point:new I(...vt),layer:zt}})}const ft=new I;function Z(){if(Fe=0,kt||w)return;$t.update();const X=Bt?.animate(performance.now(),At.matches);de.render(It,Ft);const ct=[],vt=q&&!q.hidden?{left:q.offsetLeft,right:q.offsetLeft+q.offsetWidth,top:q.offsetTop,bottom:q.offsetTop+q.offsetHeight}:null;for(const{node:zt,point:S,layer:C}of M){ft.copy(S).project(Ft);const z=(ft.x+1)*n.clientWidth/2,O=(1-ft.y)*n.clientHeight/2,B=zt.offsetWidth||88,it=Math.abs(ft.z)>1||z<B/2+5||z>n.clientWidth-B/2-5||O<14||O>n.clientHeight-38,_t=ct.some(Et=>Math.abs(Et.x-z)<(Et.width+B)/2+7&&Math.abs(Et.y-O)<25),lt=vt&&z+B/2>vt.left-4&&z-B/2<vt.right+4&&O+zt.offsetHeight/2>vt.top-4&&O-zt.offsetHeight/2<vt.bottom+4,dt=f.checked&&(!C||!H.has(C))&&!it&&!_t&&!lt;zt.style.visibility=dt?"visible":"hidden",dt&&(zt.style.left=Math.round(z)+"px",zt.style.top=Math.round(O)+"px",ct.push({x:z,y:O,width:B}))}if(X){const zt=n.getBoundingClientRect();zt.bottom>0&&zt.top<window.innerHeight&&Y()}}function Y(){!w&&!kt&&!Fe&&(Fe=requestAnimationFrame(Z))}$t.addEventListener("change",Y);function pt(){const X=n.clientWidth,ct=n.clientHeight;!X||!ct||(de.setSize(X,ct,!1),Ft.aspect=X/ct,Ft.updateProjectionMatrix(),Y())}const D=new ResizeObserver(pt);D.observe(n),pt();function J(X){if(!re)return;const ct=new Tn,vt=new Tn;if(re.updateMatrixWorld(!0),re.traverseVisible(lt=>{lt instanceof un&&ct.union(vt.setFromObject(lt))}),ct.isEmpty()&&Ae&&(ct.min.set(...Ae.min),ct.max.set(...Ae.max)),ct.isEmpty())return;ct.getCenter($t.target),X?$t.target.set(...X):Bt&&($t.target.y-=.42);const zt=nn.degToRad(jt.az),S=nn.degToRad(nn.clamp(jt.el,-85,85)),C=new I(Math.cos(S)*Math.sin(zt),Math.sin(S),Math.cos(S)*Math.cos(zt)),z=new I().crossVectors(Ft.up,C).normalize(),O=new I().crossVectors(C,z),B=Math.tan(nn.degToRad(Ft.fov/2))*(Bt?1:.78),it=new I;let _t=$t.minDistance;for(const lt of[ct.min.x,ct.max.x])for(const dt of[ct.min.y,ct.max.y])for(const Et of[ct.min.z,ct.max.z]){it.set(lt,dt,Et).sub($t.target);const Ht=Math.max(Math.abs(it.dot(z))/Ft.aspect,Math.abs(it.dot(O)));_t=Math.max(_t,it.dot(C)+Ht/B)}Ft.position.copy($t.target).addScaledVector(C,X?Math.max(12,_t*.47):_t),$t.update()}function K(){for(const X of et.layers){const ct=re?.getObjectByName("L_"+X);ct&&(ct.visible=!H.has(X))}}function mt(){re&&(It.remove(re),Bt?.group===re?Bt.dispose():$c(re)),Bt=null,re=null}function ot(X){mt(),re=X,It.add(X),K(),T.hidden=!0}function gt(){const X=nh[et.slug];if(!X)throw new Error("Missing model "+et.slug);const ct=X.createLive({variant:jt.variant??"iso",step:ne});Ae={min:ct.bounds.min.toArray(),max:ct.bounds.max.toArray()},ot(ct.group),Bt=ct,i.dataset.modelActive=et.slug}function Lt(X){const ct=nh[et.slug];if(!ct)throw new Error("Missing model "+et.slug);const vt=ct.build({variant:jt.variant??"iso",focus:jt.focus,stage:ne});Ae=vt.bbox,ot(vt.group),ht(vt.anchors),X&&J(jt.focus?vt.focusPoints?.[jt.focus]:void 0),i.dataset.modelActive=et.slug,i.dataset.modelStep=String(ne),Y()}function Wt(X=!1){if(!Bt)return;Bt.setVariant(jt.variant??"iso");let ct;fe==="explore"?(Bt.setCut(ut),ct=Bt.explore(te)):ct=Bt.step(ne),K(),T.hidden=!0,ht(ct),X&&J(jt.focus?Bt.focusPoints()[jt.focus]:void 0),i.dataset.modelStep=String(ne),Y()}function at(){const X=et.steps[ne-1];l.hidden=et.source!=="procedural"||!X||fe!=="process",W.hidden=et.source!=="procedural"||fe!=="explore",p.max=String(et.steps.length||1),p.value=String(ne),p.setAttribute("aria-valuetext",X?ne+" / "+et.steps.length+" "+X.label:""),v.textContent=ne+" / "+et.steps.length;const ct=et.phases.find(vt=>vt.id===X?.phase);if(_.textContent=ct?.name??"",_.style.setProperty("--pc",ct?.color??"var(--color-ink-3)"),E.textContent!==(X?.label??"")){const vt=document.createElement("span");vt.className="mf-feedback-in inline-block",vt.textContent=X?.label??"",E.replaceChildren(vt)}b.textContent=X?.note??"",b.hidden=!X?.note,q&&(q.hidden=fe!=="process"||!X,q.style.setProperty("--pc",ct?.color??"var(--color-accent)"),j&&(j.textContent=ct?.name??""),nt&&(nt.textContent=`${ne} / ${et.steps.length}`),Rt&&(Rt.textContent=X?.label??"")),g.disabled=ne<=1,m.disabled=ne>=et.steps.length,x.disabled=!Dt,fe==="explore"?Mi():tr()}function Ct(X){const ct=nn.clamp(X,1,et.steps.length||1);if(!(ct===ne&&fe==="process")){if(ne=ct,fe==="explore"){St("process");return}Bt?Wt(!1):Lt(!1),at()}}function Xt(){for(const X of Vt){const ct=X.dataset.modelMode===fe;X.classList.toggle("is-active",ct),X.setAttribute("aria-pressed",String(ct))}}function St(X){et.source!=="procedural"||!et.rawSteps||fe===X||(pe(),fe=X,X==="explore"&&(P.value=String(Math.round(te*100)),k.textContent=Math.round(te*100)+"%",G.textContent=Bt?.progressLabel(te)??"",V.value=String(Math.round(ut*100)),Ii()),Bt&&Wt(!1),Xt(),at(),Y())}function oe(){return Math.max(300,Math.round(et.stepDuration*1e3/ye))}function pe(){be!==void 0&&window.clearInterval(be),be=void 0,x.setAttribute("aria-label","播放工序"),x.title="播放工序",x.querySelector("span").textContent="▶"}function _n(X,ct){X.addEventListener("click",()=>{pe(),ve=!0,Ct(ct+1),F=performance.now()+700,(Mt.matches?X:n).scrollIntoView({block:Mt.matches?"center":"start",behavior:At.matches?"instant":"smooth"})})}function Qs(){const X=R.querySelectorAll(".studio-scrolly-key");if(X.length){X.forEach(vt=>_n(vt,Number(vt.dataset.step)-1));return}const ct=document.createElement("div");ct.className="studio-scrolly-list",et.steps.forEach((vt,zt)=>{const S=et.phases.find(_t=>_t.id===vt.phase),C=document.createElement("button");C.type="button",C.className="studio-scrolly-key",C.dataset.step=String(zt+1);const z=document.createElement("span");z.className="studio-scrolly-key__meta";const O=document.createElement("span");if(O.className="studio-scrolly-key__no",O.textContent=`${String(zt+1).padStart(2,"0")} / ${String(et.steps.length).padStart(2,"0")}`,z.append(O),S){const _t=document.createElement("span");_t.className="studio-scrolly-key__phase",_t.style.setProperty("--pc",S.color),_t.textContent=S.name,z.append(_t)}const B=document.createElement("strong");B.className="studio-scrolly-key__title",B.textContent=vt.label;const it=document.createElement("span");it.className="studio-scrolly-key__note",it.textContent=vt.note??"",C.append(z,B,it),_n(C,zt),ct.append(C)}),R.append(ct)}function gs(){t&&(t.value=et.slug),d&&(d.href=et.href),c&&(c.textContent=et.scope??"",c.hidden=!et.scope),e.setAttribute("aria-label",et.name+"三维模型"),r&&(r.hidden=!et.poster,et.poster&&(r.src=et.poster));const X=et.presets.length?et.presets:[Ka];jt=X[0],u.replaceChildren(...X.map(vt=>new Option(vt.label,vt.id))),H.clear(),et.layersOff.forEach(vt=>H.add(vt)),h.replaceChildren(...et.layers.map(vt=>{const zt=document.createElement("label");zt.className="studio-layer-option";const S=document.createElement("input");return S.type="checkbox",S.dataset.layer=vt,S.checked=!H.has(vt),S.addEventListener("change",()=>{S.checked?H.delete(vt):H.add(vt),K(),T.hidden=!0,Y()}),zt.append(S,vt),zt})),A.hidden=et.source!=="procedural"||!et.rawSteps,Xt(),y.value=String(ye),L.checked=Dt,R.replaceChildren();const ct=et.steps.length;if(i.style.setProperty("--mf-key-min",ct>24?"24vh":ct>17?"30vh":ct>12?"34vh":"40vh"),$&&et.rawSteps&&et.steps.length)Qs();else if(et.rawSteps&&et.phases.length)for(const vt of et.phases){const zt=et.steps.map((z,O)=>[z,O]).filter(([z])=>(z.phase??"_")===vt.id);if(!zt.length)continue;const S=document.createElement("div");S.className="studio-step-phase";const C=document.createElement("div");C.className="studio-step-phase__name",C.style.setProperty("--pc",vt.color),C.textContent=vt.name,S.append(C);for(const[z,O]of zt){const B=document.createElement("button");B.type="button",B.className="studio-step-row",B.dataset.step=String(O+1);const it=document.createElement("span");it.className="studio-step-row__no",it.textContent=String(O+1).padStart(2,"0");const _t=document.createElement("span");_t.textContent=z.label,B.append(it,_t),B.addEventListener("click",()=>{pe(),ve=!0,Ct(O+1)}),S.append(B)}R.append(S)}N.hidden=R.childElementCount===0,U.textContent=et.steps.length?String(et.steps.length)+" 步":""}function js(X){for(const vt of R.querySelectorAll("[data-step]")){const zt=Number(vt.dataset.step)===X;vt.classList.toggle("is-active",zt),zt?vt.setAttribute("aria-current","step"):vt.removeAttribute("aria-current")}const ct=R.querySelector(".is-active");ct instanceof HTMLElement&&!$&&(F=performance.now()+600,ct.scrollIntoView({block:"nearest"}))}function tr(){js(ne)}async function _s(X){pe(),et=X,o.hidden=!0,s.hidden=!1,s.textContent="正在加载三维模型…",fe="process",te=et.defaults.progress,ut=et.defaults.cut,gs(),ve=!1;const ct=et.steps.flatMap((vt,zt)=>vt.phase==="stope"?[zt+1]:[]);ne=$?1:ct[Math.floor(ct.length/2)]??Math.max(1,et.steps.length);try{if(et.source==="procedural")et.rawSteps?(gt(),Wt(!0)):Lt(!0);else if(X.glb){const{GLTFLoader:vt}=await hu(async()=>{const{GLTFLoader:S}=await import("./GLTFLoader.CJ3Egpz9.js");return{GLTFLoader:S}},[]),{scene:zt}=await new vt().loadAsync(X.glb);if(et!==X||w){$c(zt);return}ot(zt),ht(X.anchors.map(S=>({...S,pos:[S.pos[0],S.pos[2],-S.pos[1]]}))),J(),Y()}else throw new Error("Missing model asset");s.hidden=!0,o.hidden=!1,r&&(r.hidden=!0),at(),$&&requestAnimationFrame(()=>vs())}catch(vt){s.textContent="三维模型加载失败。",console.error("[MineForge]",vt)}}t?.addEventListener("change",()=>{const X=yt.get(t.value);if(!X)return;const ct=new URL(location.href);ct.searchParams.set("method",X.slug),history.replaceState(null,"",ct),_s(X)}),u.addEventListener("change",()=>{jt=et.presets.find(X=>X.id===u.value)??Ka,et.source==="procedural"&&Bt?(Wt(!0),fe==="explore"&&Ii()):et.source==="procedural"?Lt(!0):(J(),Y())}),f.addEventListener("change",Y);function wn(X){pe(),ve=!0,Ct(ne+X)}g.addEventListener("click",()=>wn(-1)),m.addEventListener("click",()=>wn(1)),p.addEventListener("input",()=>{pe(),ve=!0,Oe&&cancelAnimationFrame(Oe),Oe=requestAnimationFrame(()=>Ct(p.valueAsNumber))}),x.addEventListener("click",()=>{if(Dt){if(be!==void 0){pe();return}(!ve||ne>=et.steps.length)&&Ct(1),ve=!0,x.setAttribute("aria-label","暂停工序"),x.title="暂停工序",x.querySelector("span").textContent="Ⅱ",be=window.setInterval(Ni,oe())}});function Ni(){ne<et.steps.length&&Ct(ne+1),ne>=et.steps.length&&pe()}y.addEventListener("change",()=>{ye=Number(y.value)||1,be!==void 0&&(window.clearInterval(be),be=window.setInterval(Ni,oe()))}),L.addEventListener("change",()=>{Dt=L.checked,Dt||pe(),at()});for(const X of Vt)X.addEventListener("click",()=>St(X.dataset.modelMode==="explore"?"explore":"process"));function Ii(){const X=jt.variant==="cross"?"横剖":"纵剖";st.textContent=ut<=.005?"关闭（全显示）":`${X} ${Math.round(ut*100)}%`}function Si(){!Bt||fe!=="explore"||(Bt.setCut(ut),ht(Bt.explore(te)),K(),T.hidden=!0,k.textContent=Math.round(te*100)+"%",G.textContent=Bt.progressLabel(te)||"—",Ii(),Mi(),Y())}function Mi(){Bt&&js(Bt.progressStep(te))}P.addEventListener("input",()=>{te=P.valueAsNumber/100,Si()}),V.addEventListener("input",()=>{ut=V.valueAsNumber/100,Si()});let Ui=0;function vs(){if(Ui=0,!i.dataset.modelActive||fe!=="process"||!Mt.matches||performance.now()<F)return;const X=R.getBoundingClientRect();if(X.bottom<0||X.top>innerHeight)return;const ct=n.getBoundingClientRect();if(ct.bottom<120||ct.top>innerHeight-120)return;const vt=innerHeight*.45;let zt=null,S=1/0;for(const z of R.querySelectorAll("[data-step]")){const O=z.getBoundingClientRect();if(O.bottom<60||O.top>innerHeight-60)continue;const B=Math.abs(O.top+O.height/2-vt);B<S&&(S=B,zt=z)}if(!zt)return;const C=Number(zt.dataset.step);be!==void 0&&pe(),C>=1&&C!==ne&&Ct(C)}window.addEventListener("scroll",()=>{Y(),Ui||(Ui=requestAnimationFrame(vs))},{passive:!0});let Rn;e.addEventListener("pointerdown",X=>{X.isPrimary&&X.button===0&&(Rn=[X.clientX,X.clientY])}),e.addEventListener("pointerup",X=>{if(!X.isPrimary)return;const ct=Rn;if(Rn=void 0,!ct||!re||Math.hypot(ct[0]-X.clientX,ct[1]-X.clientY)>5)return;const vt=er(X.clientX,X.clientY);vt?nr(vt.userData):(T.hidden=!0,T.replaceChildren())}),e.addEventListener("pointercancel",X=>{X.isPrimary&&(Rn=void 0)});function er(X,ct){if(!re)return null;const vt=e.getBoundingClientRect();Q.set((X-vt.left)/vt.width*2-1,1-(ct-vt.top)/vt.height*2),Ft.updateMatrixWorld(),rt.setFromCamera(Q,Ft);const zt=rt.intersectObject(re,!0).find(S=>{if(!S.object.userData.object_id||Bt&&Bt.clipPlane.distanceToPoint(S.point)<0)return!1;for(let C=S.object;C;C=C.parent)if(!C.visible)return!1;return!0});return zt?zt.object:null}function nr(X){const ct=T;if(ct.replaceChildren(),!X.object_id){ct.hidden=!0;return}const vt=document.createElement("div");vt.className="mf-info mf-feedback-in";const zt=document.createElement("div");zt.className="mf-info__head";const S=document.createElement("strong");S.textContent=String(X.name??X.object_id),zt.append(S);const C=Nv[String(X.mining_state??"")];if(C){const dt=document.createElement("span");dt.className="mf-badge",dt.style.setProperty("--sc",C.color??"#716D64"),dt.append(document.createElement("i"),document.createTextNode(C.label??String(X.mining_state))),zt.append(dt)}vt.append(zt);const z=document.createElement("p");z.className="mf-info__id",z.textContent=String(X.object_id),vt.append(z);const O=document.createElement("dl"),B=dt=>dt===!0?"是":dt===!1?"否":"—",it=(dt,Et,Ht)=>{const Jt=document.createElement("dt");Jt.textContent=dt;const Tt=document.createElement("dd");Tt.textContent=Et||"—",Ht&&(Tt.className=Ht),O.append(Jt,Tt)},_t=String(X.source_tier??""),lt=_t.replace(/[【】]/g,"")||"—";it("开采状态",C?C.label??"":String(X.mining_state??"")),it("已回采",B(X.mined)),it("已充填",B(X.backfilled)),it("所属阶段",String(X.stage??"")),it("对象类型",String(X.type_code??"")),it("依据等级",_t||"—","mf-tier mf-tier--"+lt),it("教材出处",[X.textbook_ref,X.figure_ref].filter(Boolean).join(" · ")),it("尺寸",String(X.dimensions??"")),it("标高",X.elevation_z!=null?X.elevation_z+" m":"—"),it("连通",Array.isArray(X.connectivity)&&X.connectivity.length?X.connectivity.join("、"):"—"),X.assumption===!0&&it("说明","教学剖切和示意比例"),vt.append(O),ct.append(vt),ct.hidden=!1}const Fi=i;Fi.__mfPause=X=>{kt=!!X,kt||Y()},Fi.__mfCam=(X,ct)=>{Ft.position.set(...X),$t.target.set(...ct),$t.update(),de.render(It,Ft)},Fi.__mfModel={get state(){return{slug:et.slug,mode:fe,step:ne,stepCount:et.steps.length,progress:Math.round(te*100),cut:Math.round(ut*100),speed:ye,auto:Dt,playing:be!==void 0,stepTitle:et.steps[ne-1]?.label??""}},setStep:X=>{ve=!0,Ct(X)},setMode:X=>St(X==="explore"?"explore":"process"),setProgress:X=>{fe==="explore"&&(te=nn.clamp(X,0,100)/100,P.value=String(Math.round(X)),Si())},setCut:X=>{fe==="explore"&&(ut=nn.clamp(X,0,100)/100,V.value=String(Math.round(X)),Si())},setSpeed:X=>{ye=X,y.value=String(X)},setAuto:X=>{Dt=!!X,L.checked=Dt,at()},play:()=>x.click(),pickAt:(X,ct)=>{const vt=er(X,ct);return vt?{object_id:String(vt.userData.object_id??""),name:String(vt.userData.name??"")}:null}},window.addEventListener("pagehide",X=>{X.persisted||(w=!0,pe(),cancelAnimationFrame(Fe),cancelAnimationFrame(Oe),$t.dispose(),D.disconnect(),mt(),de.dispose())},{once:!0}),_s(et)}const ou=new IntersectionObserver(i=>{for(const t of i)!t.isIntersecting||!(t.target instanceof HTMLElement)||(ou.unobserve(t.target),Iv(t.target))},{rootMargin:"250px"});document.querySelectorAll("[data-mf-model][data-model-json]").forEach(i=>ou.observe(i));export{Gv as $,_e as A,tn as B,Kt as C,Df as D,kv as E,Wv as F,un as G,kd as H,Od as I,sa as J,zv as K,Ks as L,Vv as M,sr as N,Te as O,Yv as P,ni as Q,no as R,fn as S,Uv as T,Hv as U,wt as V,yn as W,ln as X,nn as Y,Vh as Z,Ph as _,Ov as a,Id as a0,Kr as a1,Uo as a2,qe as a3,zh as a4,al as a5,ol as a6,ie as a7,Ci as a8,Ys as a9,Tn as aa,ii as ab,Fv as b,Kv as c,Zr as d,qv as e,Qt as f,I as g,tc as h,Xv as i,Zv as j,ei as k,Bv as l,Ch as m,di as n,da as o,Uu as p,sn as q,ke as r,io as s,$n as t,zd as u,Di as v,Qr as w,Oh as x,cn as y,Ld as z};
