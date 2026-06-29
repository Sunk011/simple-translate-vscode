import{d as rt,g as it}from"./languageDetector-CxMWe0Z6.js";import{S as o,D as B,R as ot,a as O,b as $,c as q,d as at}from"./constants-B-XnnSlF.js";const st={minChars:2,maxChars:500,debounceMs:150};function lt(t,e={}){const r=typeof t=="function"?{onSelection:t}:t,{minChars:n,maxChars:i,debounceMs:a}={...st,...e};let s=null;function l(b){var c,u;const p=window.getSelection();if(!p||(c=r.shouldIgnoreSelection)!=null&&c.call(r,p,b))return;const f=p.toString().trim();let L;if(p.rangeCount>0&&(L=p.getRangeAt(0).getBoundingClientRect()),s&&clearTimeout(s),f.length===0){(u=r.onSelectionClear)==null||u.call(r);return}s=setTimeout(()=>{var w;if(s=null,f.length<n||f.length>i)return;const h=window.getSelection();if(((h==null?void 0:h.toString().trim())??"").length===0){(w=r.onSelectionClear)==null||w.call(r);return}r.onSelection(f,L)},a)}return document.addEventListener("mouseup",b=>l(b),!0),document.addEventListener("touchend",b=>l(b),!0),()=>{s&&clearTimeout(s),document.removeEventListener("mouseup",l,!0),document.removeEventListener("touchend",l,!0)}}let g=null,d=null;function ct(t,e){try{if(e){const a=e.target;if(a&&g&&(g.contains(a)||a.id==="simple-translate-overlay-root")||e.composedPath().some(s=>s===g||s===d))return!0}const r=t??window.getSelection();if(!r||r.rangeCount===0)return!1;const n=r.anchorNode;return n?!!(n.getRootNode()===d||g&&g.contains(n)):!1}catch{return!1}}function P(){if(g&&d)return{container:g,shadow:d};g=document.createElement("div"),g.id="simple-translate-overlay-root",document.body.appendChild(g),d=g.attachShadow({mode:"closed"});const t=document.createElement("style");return t.textContent=`
    .subtitle-container {
      position: fixed;
      padding: 10px 18px;
      background: rgba(28, 28, 30, 0.82);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      color: #fff;
      border-radius: 14px;
      border: 0.5px solid rgba(255, 255, 255, 0.08);
      width: auto;
      min-width: 200px;
      max-width: min(600px, 80vw);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35), 0 2px 8px rgba(0, 0, 0, 0.15);
      cursor: default;
      user-select: text;
      z-index: 2147483647;
      animation: subtitleIn 280ms cubic-bezier(0.2, 0.8, 0.2, 1);
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: opacity 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
      left: 50%;
      transform: translateX(-50%);
    }
    .subtitle-dragbar-wrap, .subtitle-dragbar {
      display: none;
    }
    .subtitle-close {
      position: absolute;
      top: 7px;
      right: 7px;
      background: rgba(255, 255, 255, 0.12);
      border: none;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      font-size: 13px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
      z-index: 20;
      pointer-events: auto;
      opacity: 0;
      transform: scale(0.8);
      padding: 0;
    }
    .subtitle-container:hover .subtitle-close {
      opacity: 1;
      transform: scale(1);
    }
    .subtitle-close:hover {
      background: rgba(255, 255, 255, 0.25);
      color: #fff;
    }
    .subtitle-close:active {
      transform: scale(0.9);
    }
    .subtitle-body {
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 3px;
      width: 100%;
      position: relative;
      z-index: 2;
      align-items: center;
      text-align: center;
    }
    .subtitle-source {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.45);
      line-height: 1.5;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 2px;
      transition: color 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
      width: 100%;
      letter-spacing: -0.01em;
    }
    .subtitle-container:hover .subtitle-source {
      color: rgba(255, 255, 255, 0.6);
    }
    .subtitle-result {
      font-size: 22px;
      font-weight: 600;
      line-height: 1.35;
      color: #fff;
      transition: font-size 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
      width: 100%;
      margin-bottom: 2px;
      letter-spacing: -0.02em;
    }
    .subtitle-footer {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.35);
      margin-top: 4px;
      height: auto;
      min-height: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0 2px;
      letter-spacing: 0.01em;
    }
    .subtitle-provider {
      text-align: left;
      flex-shrink: 0;
    }
    .subtitle-actions {
      display: flex;
      gap: 6px;
      opacity: 0;
      transition: opacity 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
      min-width: 48px;
      justify-content: flex-end;
    }
    .subtitle-container:hover .subtitle-actions {
      opacity: 1;
    }
    .subtitle-btn {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      padding: 5px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
      font-size: 14px;
      line-height: 1;
    }
    .subtitle-btn:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.12);
    }
    .subtitle-btn:active {
      transform: scale(0.9);
    }
    .subtitle-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 15px;
      color: rgba(255,255,255,0.85);
      padding: 2px 0;
      font-weight: 500;
      letter-spacing: -0.01em;
    }
    .subtitle-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.15);
      border-top-color: rgba(255,255,255,0.9);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes subtitleIn {
      from { opacity: 0; transform: translateX(-50%) translateY(8px) scale(0.97); }
      to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,d.appendChild(t),window.addEventListener("resize",()=>{const e=d==null?void 0:d.querySelector(".subtitle-container");if(e&&e.style.transform==="none"){const r=e.getBoundingClientRect(),n=window.innerWidth,i=window.innerHeight;let a=parseFloat(e.style.left||"0"),s=parseFloat(e.style.top||"0"),l=!1;a+r.width>n&&(a=Math.max(0,n-r.width),l=!0),s+r.height>i&&(s=Math.max(0,i-r.height),l=!0),l&&(e.style.left=`${a}px`,e.style.top=`${s}px`)}}),{container:g,shadow:d}}async function j(){try{const t=await chrome.storage.sync.get([o.subtitleTop,o.subtitleLeft,o.subtitleTransform,o.fontSize,o.opacity]);return{top:t[o.subtitleTop],left:t[o.subtitleLeft],transform:t[o.subtitleTransform],fontSize:t[o.fontSize],opacity:t[o.opacity]}}catch{return{}}}function U(t,e){return()=>{t.style.animation="fadeOut 150ms ease-in forwards",setTimeout(()=>t.remove(),150),e==null||e()}}function Y(t,e){const r=`
    <div class="subtitle-source" title="${v(e.sourceText)}">${v(X(e.sourceText,100))}</div>
  `,n=t==="loading"?`
    <div class="subtitle-loading">
      <div class="subtitle-spinner" aria-hidden="true"></div>
      <span>正在思考…</span>
    </div>
  `:`
    <div class="subtitle-result">${v(e.translatedText??"")}</div>
    <div class="subtitle-footer">
      <div class="subtitle-provider">
        ${e.providerName?`<span>via ${v(e.providerName)}</span>`:""}
      </div>
      <div class="subtitle-actions">
        <button class="subtitle-btn subtitle-copy" type="button" title="复制译文">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </button>
        <button class="subtitle-btn subtitle-retry" type="button" title="重新翻译">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
        </button>
      </div>
    </div>
  `;return`
    <button class="subtitle-close" type="button" aria-label="关闭">×</button>
    <div class="subtitle-body">
      ${r}
      ${n}
    </div>
  `}function G(t,e){if(t.style.left="50%",t.style.transform="translateX(-50%)",t.style.bottom="auto",t.style.top="auto",e){const r=window.innerHeight;e.top+e.height/2>r*.6?t.style.top="24px":t.style.bottom="24px"}else t.style.bottom="24px"}async function ut(t){var s;const{shadow:e}=P(),r=await j(),n=e.querySelector(".subtitle-container");n&&n.remove();const i=document.createElement("div");i.className="subtitle-container",i.dataset.loading="true",G(i,t.selectionRect),i.style.fontSize=`${r.fontSize??15}px`,i.innerHTML=Y("loading",{sourceText:t.sourceText});const a=U(i);(s=i.querySelector(".subtitle-close"))==null||s.addEventListener("click",a),e.appendChild(i)}async function F(t){var L;const{shadow:e}=P(),r=await j(),n=e.querySelector(".subtitle-container");if((n==null?void 0:n.dataset.loading)==="true"&&n){delete n.dataset.loading;const c=n.querySelector(".subtitle-body");if(c){const h=c.querySelector(".subtitle-source"),I=c.querySelector(".subtitle-loading");if(h&&(h.innerHTML=v(X(t.sourceText,100))),I){I.outerHTML=`
          <div class="subtitle-result">${v(t.translatedText)}</div>
          <div class="subtitle-footer">
            <div class="subtitle-provider">
              ${t.providerName?`<span>via ${v(t.providerName)}</span>`:""}
            </div>
            <div class="subtitle-actions">
              <button class="subtitle-btn subtitle-copy" type="button" title="复制译文">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
              <button class="subtitle-btn subtitle-retry" type="button" title="重新翻译">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
              </button>
            </div>
          </div>
        `;const w=c.querySelector(".subtitle-copy"),_=c.querySelector(".subtitle-retry");w==null||w.addEventListener("click",M=>{M.stopPropagation(),navigator.clipboard.writeText(t.translatedText).then(()=>{const T=M.currentTarget,nt=T.innerHTML;T.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',setTimeout(()=>{T.innerHTML=nt},1500)})}),_==null||_.addEventListener("click",M=>{var T;M.stopPropagation(),(T=t.onRetry)==null||T.call(t)})}}const u=n.querySelector(".subtitle-result");u&&(u.style.fontSize=`${Math.round((r.fontSize??15)*1.2)}px`);return}const a=document.createElement("div");a.className="subtitle-container",G(a,t.selectionRect);const s=r.fontSize??15;a.style.fontSize=`${s}px`,a.innerHTML=Y("result",{sourceText:t.sourceText,translatedText:t.translatedText,providerName:t.providerName});const l=a.querySelector(".subtitle-result");l&&(l.style.fontSize=`${Math.round(s*1.2)}px`);const b=U(a,t.onClose);(L=a.querySelector(".subtitle-close"))==null||L.addEventListener("click",b);const p=a.querySelector(".subtitle-copy"),f=a.querySelector(".subtitle-retry");p==null||p.addEventListener("click",c=>{c.stopPropagation(),navigator.clipboard.writeText(t.translatedText).then(()=>{const u=c.currentTarget,h=u.innerHTML;u.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',setTimeout(()=>{u.innerHTML=h},1500)})}),f==null||f.addEventListener("click",c=>{var u;c.stopPropagation(),(u=t.onRetry)==null||u.call(t)}),e.appendChild(a)}function v(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}function X(t,e){return t.length<=e?t:t.slice(0,e)+"…"}function dt(){if(d){const t=d.querySelector(".subtitle-container");t&&t.remove()}}let m=null,y=null,A=null,S=null,z=null,H=null;const gt=3e3,x=28,pt=`
  .trigger-btn {
    position: fixed;
    z-index: 2147483646;
    width: ${x}px;
    height: ${x}px;
    border-radius: 50%;
    border: 0.5px solid rgba(255, 255, 255, 0.08);
    background: rgba(28, 28, 30, 0.82);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 0;
    animation: trigger-pop 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
    transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), background 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
    pointer-events: auto;
  }
  .trigger-btn:hover {
    transform: scale(1.1);
    background: rgba(0, 122, 255, 0.88);
  }
  .trigger-btn:active {
    transform: scale(0.92);
  }
  .trigger-btn svg {
    width: 17px;
    height: 17px;
    pointer-events: none;
  }
  .trigger-btn svg rect {
    transition: fill 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  .trigger-btn:hover svg rect:first-child {
    fill: rgba(255, 255, 255, 0.5);
  }
  .trigger-btn:hover svg rect:last-child {
    fill: rgba(255, 255, 255, 0.95);
  }
  @keyframes trigger-pop {
    from { opacity: 0; transform: scale(0.5); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes trigger-out {
    from { opacity: 1; transform: scale(1); }
    to   { opacity: 0; transform: scale(0.6); }
  }
`,ft=`<svg viewBox="0 0 128 128" fill="none">
  <rect x="3" y="52" width="90" height="60" rx="14" fill="#66B2FF"/>
  <rect x="35" y="16" width="90" height="60" rx="14" fill="#007AFF"/>
</svg>`;function ht(){if(m&&y)return y;m=document.createElement("div"),m.id="simple-translate-trigger-icon",document.body.appendChild(m),y=m.attachShadow({mode:"closed"});const t=document.createElement("style");return t.textContent=pt,y.appendChild(t),y}function W(){const t=window.getSelection();if(!t||t.rangeCount===0)return null;const e=t.getRangeAt(0),r=document.createRange();r.setStart(e.endContainer,e.endOffset),r.collapse(!0);const n=r.getBoundingClientRect();if(n.height>0)return{top:n.top,left:n.left,lineHeight:n.height};const i=e.getBoundingClientRect();return i.height===0&&i.width===0?null:{top:i.bottom-16,left:i.right,lineHeight:16}}function V(t){const e=W();if(!e){t.style.display="none";return}t.style.display="";const r=window.innerWidth,n=window.innerHeight;let i=e.top+Math.round((e.lineHeight-x)/2),a=e.left+4;a+x+4>r&&(a=e.left-x-4),i+x+4>n&&(i=n-x-4),i<4&&(i=4),a<4&&(a=4),t.style.top=`${i}px`,t.style.left=`${a}px`}function bt(t){K();const e=()=>{S||(S=requestAnimationFrame(()=>{S=null,V(t)}))};z=e,window.addEventListener("scroll",e,{passive:!0,capture:!0})}function K(){z&&(window.removeEventListener("scroll",z,!0),z=null),S&&(cancelAnimationFrame(S),S=null)}function mt(t){if(E(),!W())return;const r=ht(),n=document.createElement("button");n.className="trigger-btn",n.innerHTML=ft,n.setAttribute("aria-label","翻译"),V(n),n.addEventListener("mousedown",i=>{i.preventDefault(),i.stopPropagation()}),n.addEventListener("click",i=>{i.stopPropagation(),E(),t()}),r.appendChild(n),H=n,bt(n),A=setTimeout(E,gt)}let C=null;function E(){if(K(),A&&(clearTimeout(A),A=null),C&&(clearTimeout(C),C=null),y&&H){const t=H;H=null,t.style.animation="trigger-out 150ms cubic-bezier(0.25, 0.1, 0.25, 1) forwards",C=setTimeout(()=>{t.remove(),C=null},150)}}function yt(t){return m?t.composedPath().some(e=>e===m||e===y):!1}const k=[];function xt(){const t=Date.now();for(;k.length>0&&t-k[0]>at;)k.shift();return k.length>=ot}function vt(){k.push(Date.now())}function wt(t){var i;if(!t||t.rangeCount===0)return!1;const e=t.anchorNode;if(!e)return!1;const r=e.nodeType===Node.ELEMENT_NODE?e:e.parentElement;if(!r)return!1;const n=(i=r.tagName)==null?void 0:i.toLowerCase();return n==="input"||n==="textarea"||r.isContentEditable?!0:r.closest('[contenteditable="true"]')!==null}let Z=B,D=null;async function J(){try{const t=await chrome.storage.sync.get([o.enabled,o.blacklistDomains]);if(t[o.enabled]===!1)return!1;const e=t[o.blacklistDomains];if(e){const r=e.split(",").map(i=>i.trim().toLowerCase()).filter(Boolean),n=window.location.hostname.toLowerCase();if(r.some(i=>n.includes(i)))return!1}return!0}catch{return!0}}async function Q(){try{const t=await chrome.storage.sync.get([o.minChars,o.maxChars,o.chineseRatioThreshold,o.triggerMode,o.primaryLangA,o.primaryLangB]);return{minChars:t[o.minChars]??q,maxChars:t[o.maxChars]??$,chineseRatioThreshold:t[o.chineseRatioThreshold]??O,triggerMode:t[o.triggerMode]??B,primaryLangA:t[o.primaryLangA]??"zh",primaryLangB:t[o.primaryLangB]??"en"}}catch{return{minChars:q,maxChars:$,chineseRatioThreshold:O,triggerMode:B,primaryLangA:"zh",primaryLangB:"en"}}}async function Tt(t,e,r){try{const n=await chrome.runtime.sendMessage({type:"TRANSLATE",payload:{text:t,sourceLang:e,targetLang:r}});return n!=null&&n.ok&&(n!=null&&n.translatedText)?{translatedText:n.translatedText,providerName:n.providerName}:null}catch{return null}}async function N(t,e){try{if(!await J())return;if(xt()){await F({sourceText:t,translatedText:"请求过于频繁，请稍后再试",persistUntilDeselect:!0,selectionRect:e});return}vt();const n=await Q(),a=rt(t,n.primaryLangA,n.primaryLangB,{chineseRatioThreshold:n.chineseRatioThreshold})??n.primaryLangB,s=it(a,n.primaryLangA,n.primaryLangB);await ut({sourceText:t,selectionRect:e});const l=await Tt(t,a,s);await F({sourceText:t,translatedText:(l==null?void 0:l.translatedText)??"翻译失败，请检查设置或网络",providerName:l==null?void 0:l.providerName,persistUntilDeselect:!0,selectionRect:e,onRetry:()=>N(t,e)})}catch(r){console.warn("[Simple Translate] 翻译出错:",r)}}function St(t,e){switch(D={text:t,rect:e},Z){case"manual":break;case"icon":mt(()=>{const r=tt();N((r==null?void 0:r.text)??t,(r==null?void 0:r.rect)??e)});break;case"auto":N(t,e);break}}function Lt(){D=null,E(),dt()}chrome.runtime.onMessage.addListener((t,e,r)=>{if(t.type==="TRANSLATE_SHORTCUT"){const n=D??tt();n?(N(n.text,n.rect),r({ok:!0})):r({ok:!1})}return!0});function tt(){const t=window.getSelection();if(!t)return null;const e=t.toString().trim();if(e.length===0)return null;let r;return t.rangeCount>0&&(r=t.getRangeAt(0).getBoundingClientRect()),{text:e,rect:r}}let R=null;async function et(){R&&(R(),R=null),E();try{if(!await J())return;const e=await Q();Z=e.triggerMode,R=lt({onSelection:St,onSelectionClear:Lt,shouldIgnoreSelection:(r,n)=>!!(ct(r,n)||yt(n)||wt(r))},{minChars:e.minChars,maxChars:e.maxChars})}catch(t){console.warn("[Simple Translate] 初始化失败:",t)}}et();const Ct=[o.enabled,o.blacklistDomains,o.minChars,o.maxChars,o.triggerMode,o.primaryLangA,o.primaryLangB];chrome.storage.onChanged.addListener((t,e)=>{e==="sync"&&Ct.some(r=>r in t)&&et()});
