(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{5557:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return r(6197)}])},6197:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return $}});var o=r(5893),s=r(7294);let i=e=>{let{children:t}=e;return(0,o.jsx)("div",{className:"relative flex justify-center w-full",children:(0,o.jsx)("div",{className:"",children:(0,o.jsx)("div",{className:"relative flex flex-col p-1 font-sans dark:text-white text-black font-normal min-w-[420px] w-full",children:t})})})},l=()=>(0,o.jsx)("footer",{className:"flex flex-col items-center w-full px-2 pt-4 pb-8"}),n=e=>{var t;null==chrome||null===(t=chrome.tabs)||void 0===t||t.query({active:!0,currentWindow:!0},async t=>{let r=t[0],o=new URL(r.url),s=o.hostname;s.includes("www.")?e(s.slice(4)):e(s)})},a=e=>{var t;null==chrome||null===(t=chrome.tabs)||void 0===t||t.query({active:!0,currentWindow:!0},t=>{let r=t[0],o=r.id;e(o)})},c=(e,t)=>{var r;null==chrome||null===(r=chrome.runtime)||void 0===r||r.sendMessage(e,e=>{t(e)})};async function d(){return new Promise((e,t)=>{navigator.geolocation.getCurrentPosition(t=>e(function e(t){let r={};if(null===t||!(t instanceof Object))return t;for(let o in t)r[o]=e(t[o]);return r}(t)),e=>t(e))})}var u=r(5675),h=r.n(u),m=r(3096),p=r.n(m);p()(async e=>{let t=new Promise((t,r)=>{var o;null==chrome||null===(o=chrome.storage)||void 0===o||o.local.set(e,()=>t(e))});return t},500);let g=p()(e=>{var t;null==chrome||null===(t=chrome.storage)||void 0===t||t.sync.set({country:e},()=>{console.log("Saved country: ".concat(e.code))})}),x=p()(e=>{var t;null==chrome||null===(t=chrome.storage)||void 0===t||t.sync.set({subscription:e},()=>{})}),v=async e=>{var t;null==chrome||null===(t=chrome.storage)||void 0===t||t.sync.get({subscription:[]},t=>{e(t)})},f=async e=>{var t;null==chrome||null===(t=chrome.storage)||void 0===t||t.sync.get({country:[]},t=>{let r=t.country;console.log("Got country: ".concat(r.code)),e(r)})},b=p()(e=>{var t;null==chrome||null===(t=chrome.tabs)||void 0===t||t.query({active:!0,currentWindow:!0},t=>{var r;let o=t[0];new URL(o.url);let s=o.id;null==chrome||null===(r=chrome.storage)||void 0===r||r.sync.set({[s]:e},()=>{})})},500),y=async e=>{var t;null==chrome||null===(t=chrome.tabs)||void 0===t||t.query({active:!0,currentWindow:!0},t=>{var r;let o=t[0];new URL(o.url);let s=String(o.id);null==chrome||null===(r=chrome.storage)||void 0===r||r.sync.get(s,t=>{e(t[s])})})},j=p()(e=>{var t;null==chrome||null===(t=chrome.storage)||void 0===t||t.sync.get({key:[]},t=>{var r;let o=t.key;null==o||o.push(e),null==chrome||null===(r=chrome.storage)||void 0===r||r.sync.set({key:o},()=>{console.log("UUID ".concat(e," added to array"))})})},500),w=async e=>{var t;null==chrome||null===(t=chrome.storage)||void 0===t||t.sync.get({key:[]},t=>{let r=t.key;e(r)})},k=p()(e=>{var t;null===(t=chrome.storage)||void 0===t||t.local.set({key:e},()=>{console.log("Saved current date: ".concat(e))})},500),_=p()(e=>{var t;null==chrome||null===(t=chrome.storage)||void 0===t||t.local.get({key:[]},t=>{let r=t.key;e(r)})},500),C=e=>{var t,r;null==chrome||null===(t=chrome.storage)||void 0===t||t.local.clear(),null==chrome||null===(r=chrome.storage)||void 0===r||r.sync.clear()};var S=r(4216),N=r.n(S),D=r(4670),F=r(2916);let T=()=>{let[e,t]=(0,s.useState)(""),[r,i]=(0,s.useState)(""),[l,a]=(0,s.useState)(!1);return(0,s.useEffect)(()=>{v(e=>{var t;(null==e?void 0:null===(t=e.subscription)||void 0===t?void 0:t.paid)&&a(!0)}),n(async e=>{t(e),f(async e=>{if(0===e.length){var t,r;let e=await d(),o=e.coords.latitude,s=e.coords.longitude,l="https://nominatim.openstreetmap.org/reverse?format=json&lat=".concat(o,"&lon=").concat(s,"&accept-language=en"),n=await N().get(l),a=await (null==n?void 0:null===(t=n.data)||void 0===t?void 0:null===(r=t.address)||void 0===r?void 0:r.country_code.toUpperCase()),c=await N().get("https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json");null==c||c.data.map(e=>{if(e.code===a)return g(e),i(e),e.name})}else console.log("Country from storage",e.code),i(e)})})},[]),(0,o.jsxs)("header",{className:"text-center",children:[(0,o.jsx)("div",{className:"flex items-center justify-center",children:(0,o.jsx)("h1",{className:"text-xl font-extrabold",children:(0,o.jsx)("span",{className:"text-white",children:"RentEst"})})}),(0,o.jsxs)("div",{className:"box-border h-20 w-96 p-3 border-2 my-3",children:[(0,o.jsxs)("div",{className:"flex text-lg",children:[(0,o.jsx)("div",{className:"text-white",children:"Domain:"}),(0,o.jsx)("div",{className:"font-bold ml-2 text-white flex justify-start",children:e})]}),(0,o.jsxs)("div",{className:"flex text-lg",children:[(0,o.jsx)("div",{className:"mt-1 text-white",children:"Location:"}),(0,o.jsx)("div",{className:"font-bold ml-2 mt-1 pr-2 text-white",children:null==r?void 0:r.name}),(null==r?void 0:r.image)&&(0,o.jsx)(h(),{src:null==r?void 0:r.image,alt:"Country Flag",width:30,height:30})]}),l&&(0,o.jsx)("div",{className:"flex justify-end -mt-16",children:(0,o.jsx)(D.u,{hasArrow:!0,label:"Manage Subscription",bg:"blue.600",children:(0,o.jsx)(F.z,{onClick:()=>c("should-pay"),colorScheme:"blue",variant:"link",size:"sm",children:"⭐"})})})]})]})};var E=r(6775),z=r(5376),A=r(4849);r(4989);let B=e=>{let{trafficData:t}=e,[r,i]=(0,s.useState)([]),[l,n]=(0,s.useState)([]),[a,c]=(0,s.useState)(!1);return((0,s.useEffect)(()=>{c(!0),i(()=>{if(t){c(!1);let e=[];return null==t||t.tasks.map(t=>t.result[0].items.filter(t=>{let r=new Date;return t.month===r.getMonth()?e.push(t.metrics.organic.pos_2_3,t.metrics.organic.pos_4_10,t.metrics.organic.pos_4_10,t.metrics.organic.pos_11_20,t.metrics.organic.pos_31_40,t.metrics.organic.pos_51_60):3===t.month?e.push(t.metrics.organic.pos_2_3,t.metrics.organic.pos_4_10,t.metrics.organic.pos_4_10,t.metrics.organic.pos_11_20,t.metrics.organic.pos_31_40,t.metrics.organic.pos_51_60):void 0})),c(!1),e}y(async e=>{if(e){c(!1);let t=[];return null==e||e.tasks.map(e=>e.result[0].items.filter(e=>{let r=new Date;return e.month===r.getMonth()?t.push(e.metrics.organic.pos_2_3,e.metrics.organic.pos_4_10,e.metrics.organic.pos_4_10,e.metrics.organic.pos_11_20,e.metrics.organic.pos_31_40,e.metrics.organic.pos_51_60):3===e.month?t.push(e.metrics.organic.pos_2_3,e.metrics.organic.pos_4_10,e.metrics.organic.pos_4_10,e.metrics.organic.pos_11_20,e.metrics.organic.pos_31_40,e.metrics.organic.pos_51_60):void 0})),c(!1),n(t),t}})})},[t]),a)?(0,o.jsx)(A.y,{baseColor:"#21343F",highlightColor:"#263F4D",height:100,children:(0,o.jsx)(o.Fragment,{children:(0,o.jsx)(A.Z,{})})}):(E.kL.register(E.qi,E.u,E.De),(0,o.jsx)("div",{children:(0,o.jsx)(z.$I,{data:{labels:["1-3","4-10","11-20","31-40","51+"],datasets:[{label:"Aktuelle rangeringer p\xe5 s\xf8geresultater",data:t?r:l,backgroundColor:["#0077c0","#06385D","#00498D","#02386E","#00264D","#00172D"],borderColor:["#0077c0","#06385D","#00498D","#02386E","#00264D","#00172D"],borderWidth:1}]}})}))};var R=r(5278);let U=e=>{var t;return(0,o.jsxs)("section",{className:"flex flex-col space-y-2",children:[(0,o.jsxs)("label",{htmlFor:"user-control-extras",className:"text-sm font-bold dark:text-twitterAccentOneDark text-twitterAccentOne",children:["Rankings ",(0,o.jsx)(D.u,{label:"Shows where the website ranks for specific keywords, categorized into five groups: pages 1-3, 4-10, 11-20, 31-40, and 51+. The number represents the keyword's position in search results, e.g., if on page 3, it's on the third page of results.",fontSize:"md",placement:"top-start",children:(0,o.jsx)(R.U,{fontSize:"sm",mt:-1})})]}),(0,o.jsx)("div",{id:"user-control-extras",children:(0,o.jsx)(B,{trafficData:null===(t=e.props.props)||void 0===t?void 0:t.traffic})})]})};var O=r(3515),M=r(6744);(0,M.zo)(O.fC,{all:"unset",width:40,height:14,backgroundColor:"#939393",borderRadius:"9999px",position:"relative",WebkitTapHighlightColor:"#1DA1F2",display:"flex",alignItems:"center",cursor:"pointer",'&[data-state="checked"]':{backgroundColor:"#6bc9fb"}}),(0,M.zo)(O.bU,{display:"block",width:20,height:20,backgroundColor:"#fafafa",boxShadow:"rgb(0 0 0 / 50%) 0px 1px 3px",borderRadius:"9999px",transition:"transform 100ms",transform:"translateX(0px)",willChange:"transform",'&[data-state="checked"]':{backgroundColor:"#1d9bf0",transform:"translateX(20px)"}});var L=r(7602);(0,M.zo)(L.fC,{position:"relative",display:"flex",alignItems:"center",userSelect:"none",touchAction:"none",width:"100%",cursor:"pointer",'&[data-orientation="horizontal"]':{height:20},'&[data-orientation="vertical"]':{flexDirection:"column",width:20,height:100}}),(0,M.zo)(L.fQ,{backgroundColor:"#8ecdf8",position:"relative",flexGrow:1,borderRadius:"9999px",'&[data-orientation="horizontal"]':{height:4},'&[data-orientation="vertical"]':{width:4}}),(0,M.zo)(L.e6,{position:"absolute",display:"flex",alignItems:"center",backgroundColor:"#1DA1F2",borderRadius:"9999px",height:"100%"}),(0,M.zo)(L.bU,{all:"unset",display:"block",width:16,height:16,backgroundColor:"#1DA1F2",borderRadius:10,boxShadow:"rgb(101 119 134 / 20%) 0px 0px 7px, rgb(101 119 134 / 15%) 0px 1px 3px 1px","&:hover":{boxShadow:"0 0 0 5px rgba(29, 155, 240, 0.1)"},"&:focus":{boxShadow:"0 0 0 5px rgba(29, 155, 240, 0.1)"}});var W=r(2090);(0,M.zo)(W.f,{backgroundColor:"var(--twitter-accent-two)","&[data-orientation=horizontal]":{height:1,width:"100%"},"&[data-orientation=vertical]":{height:"100%",width:1}});let P=e=>{let{paidTraffic:t}=e,[r,i]=(0,s.useState)(null),[l,n]=(0,s.useState)(!1);return((0,s.useEffect)(()=>{n(!0),i(()=>{if(t)return n(!1),t;y(async e=>{if(e){var t;n(!1),i("".concat(null==e?void 0:null===(t=e.tasks)||void 0===t?void 0:t.map(e=>{var t;return null===(t=e.result[0].items[0].metrics)||void 0===t?void 0:t.organic.estimated_paid_traffic_cost.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}),"$"))}})})},[t]),l)?(0,o.jsx)(A.y,{baseColor:"#21343F",highlightColor:"#263F4D",height:100,children:(0,o.jsx)(o.Fragment,{children:(0,o.jsx)(A.Z,{})})}):r?(0,o.jsxs)("div",{className:"p-5 pb-5 bg-twitterBgTwoDark rounded-2xl",children:[(0,o.jsx)("div",{className:"text-lg mb-2 text-white",children:"Paid Traffic Cost"}),(0,o.jsx)("div",{className:"text-2xl font-bold text-sky-400",children:t||r})]}):(0,o.jsx)("p",{children:"No profile data"})},H=e=>{let{organicKeywords:t}=e,[r,i]=(0,s.useState)([]),[l,n]=(0,s.useState)(!1);return((0,s.useEffect)(()=>{n(!0),i(()=>{if(t)return n(!1),t;y(async e=>{if(e){var t;n(!1),i(null==e?void 0:null===(t=e.tasks)||void 0===t?void 0:t.map(e=>{var t;return null===(t=e.result[0].items[0].metrics)||void 0===t?void 0:t.organic.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}))}})})},[t]),l)?(0,o.jsx)(A.y,{baseColor:"#21343F",highlightColor:"#263F4D",height:100,children:(0,o.jsx)(o.Fragment,{children:(0,o.jsx)(A.Z,{})})}):r?(0,o.jsxs)("div",{className:"p-5 pb-5 bg-twitterBgTwoDark rounded-2xl",children:[(0,o.jsx)("div",{className:"text-lg mb-2 text-white",children:"Organic Keywords"}),(0,o.jsx)("div",{className:"text-2xl font-bold text-sky-400",children:t||r})]}):(0,o.jsx)("p",{children:"No profile data"})},Y=e=>{let{organicTraffic:t}=e,[r,i]=(0,s.useState)(null),[l,n]=(0,s.useState)(!1);return((0,s.useEffect)(()=>{n(!0),i(()=>{if(t)return n(!1),t;y(async e=>{e&&(n(!1),i(null==e?void 0:e.tasks.map(e=>{var t;return null===(t=e.result[0].items[0].metrics)||void 0===t?void 0:t.organic.etv.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")})))})})},[t]),l)?(0,o.jsx)(A.y,{baseColor:"#21343F",highlightColor:"#263F4D",height:100,children:(0,o.jsx)(o.Fragment,{children:(0,o.jsx)(A.Z,{})})}):r?(0,o.jsxs)("div",{className:"p-5 pb-5 bg-twitterBgTwoDark rounded-2xl",children:[(0,o.jsx)("div",{className:"text-lg mb-2 text-white",children:"Monthly Traffic"}),(0,o.jsx)("div",{className:"text-2xl font-bold text-sky-400",children:t||r})]}):(0,o.jsx)("p",{children:"No profile data"})},q=e=>{let{visibility:t}=e,[r,i]=(0,s.useState)(null),[l,n]=(0,s.useState)(!1);return((0,s.useEffect)(()=>{n(!0),i(()=>{if(t)return n(!1),t;y(async e=>{e&&(n(!1),i("".concat(null==e?void 0:e.tasks.map(e=>{var t;return null===(t=e.result[0].items[0].metrics)||void 0===t?void 0:t.organic.impressions_etv.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}))))})})},[t]),l)?(0,o.jsx)(A.y,{baseColor:"#21343F",highlightColor:"#263F4D",height:100,children:(0,o.jsx)(o.Fragment,{children:(0,o.jsx)(A.Z,{})})}):r?(0,o.jsxs)("div",{className:"p-5 pb-5 bg-twitterBgTwoDark rounded-2xl",children:[(0,o.jsx)("div",{className:"text-lg mb-2 text-white",children:"Visibility Trend"}),(0,o.jsx)("div",{className:"text-2xl font-bold text-sky-400",children:t||r})]}):(0,o.jsx)("p",{children:"No profile data"})},G=e=>{var t,r,s,i;return(0,o.jsxs)("section",{className:"flex flex-col space-y-2",children:[(0,o.jsxs)("label",{htmlFor:"user-control-feed-width",className:"text-sm font-bold dark:text-twitterAccentOneDark text-twitterAccentOne",children:["General ",(0,o.jsx)(D.u,{label:"*Organic keywords:* Website's ranked keywords. *Monthly traffic:* Visitors per month. *Visibility trend:* Website's search result visibility via paid traffic. *Paid traffic cost:* Cost of recent paid traffic.",fontSize:"md",placement:"right-start",children:(0,o.jsx)(R.U,{fontSize:"sm",mt:-1})})]}),(0,o.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,o.jsx)(H,{organicKeywords:null===(t=e.props.props)||void 0===t?void 0:t.organicKeywords}),(0,o.jsx)(Y,{organicTraffic:null===(r=e.props.props)||void 0===r?void 0:r.organicTraffic}),(0,o.jsx)(q,{visibility:null===(s=e.props.props)||void 0===s?void 0:s.visibility}),(0,o.jsx)(P,{paidTraffic:null===(i=e.props.props)||void 0===i?void 0:i.paidTraffic})]})]})};r(9217);let Z=e=>{let{monthAndYear:t,traffic:r}=e,[i,l]=(0,s.useState)([]),[n,a]=(0,s.useState)([]),[c,d]=(0,s.useState)(!1);if((0,s.useEffect)(()=>{d(!0),l(()=>{if(t&&r){d(!1);let e=[],o=[];return null==t||t.tasks.map(t=>t.result[0].items.map(t=>{let r=t.month,o=new Date,s=new Date;s.setMonth(r-1),o.setFullYear(t.year);let i=o.toLocaleString("default",{year:"2-digit"}),l=s.toLocaleString("default",{month:"short"});return e.push("".concat(l," ").concat(i))})),null==r||r.tasks.map(e=>e.result[0].items.map(e=>o.push(e.metrics.organic.impressions_etv.toFixed()))),[e,o]}y(async e=>{if(e){d(!1);let t=[],r=[];null==e||e.tasks.map(e=>e.result[0].items.map(e=>{let r=e.month,o=new Date,s=new Date;s.setMonth(r-1),o.setFullYear(e.year);let i=o.toLocaleString("default",{year:"2-digit"}),l=s.toLocaleString("default",{month:"short"});return t.push("".concat(l," ").concat(i))})),null==e||e.tasks.map(e=>e.result[0].items.map(e=>r.push(e.metrics.organic.impressions_etv.toFixed()))),a([t,r])}})})},[t,r]),c)return(0,o.jsx)(A.y,{baseColor:"#21343F",highlightColor:"#263F4D",height:100,children:(0,o.jsx)(o.Fragment,{children:(0,o.jsx)(A.Z,{})})});let u={labels:i?i[0]:n[0],datasets:[{label:"Organic Monthly Traffic",fill:!0,lineTension:.1,borderColor:"#08C4C4",backgroundColor:e=>{let t=e.chart.ctx,r=t.createLinearGradient(0,0,0,200);return r.addColorStop(0,"#3A6073"),r.addColorStop(1,"#16222A"),r},borderCapStyle:"butt",borderDash:[],borderDashOffset:0,borderJoinStyle:"miter",pointBorderColor:"#08C4C4",pointBackgroundColor:"#fff",pointBorderWidth:1,pointHoverRadius:5,pointHoverBackgroundColor:"#08C4C4",pointHoverBorderColor:"rgba(220,220,220,1)",pointHoverBorderWidth:2,pointRadius:1,pointHitRadius:10,data:i?i[1]:n[1]}]};return(0,o.jsx)("div",{children:(0,o.jsx)(z.kL,{type:"line",data:u})})},I=e=>{var t,r;return(0,o.jsxs)("section",{className:"flex flex-col space-y-2",children:[(0,o.jsxs)("label",{htmlFor:"user-control-navigation",className:"text-sm font-bold dark:text-twitterAccentOneDark text-twitterAccentOne",children:["Traffic ",(0,o.jsx)(D.u,{label:"Shows the website's traffic changes over the last six months. ",fontSize:"md",placement:"right-start",children:(0,o.jsx)(R.U,{fontSize:"sm",mt:-1})})]}),(0,o.jsx)("div",{id:"user-control-navigation",children:(0,o.jsx)(Z,{monthAndYear:null===(t=e.props.props)||void 0===t?void 0:t.monthAndYear,traffic:null===(r=e.props.props)||void 0===r?void 0:r.traffic})})]})},X=e=>(0,o.jsxs)("main",{className:"flex flex-col p-2 space-y-4",children:[(0,o.jsx)(G,{props:e}),(0,o.jsx)(I,{props:e}),(0,o.jsx)(U,{props:e})]});var K=r(381);let V=()=>{let[e,t]=(0,s.useState)(null),[r,n]=(0,s.useState)(""),d=K(),u=d.format("MMM DD, YYYY");return(0,s.useEffect)(async()=>{y(async e=>{if(e)t(e);else{let e=e=>{console.log("Received response:",null==e?void 0:e.paid),x(e),v(t=>{var r,s;console.log("Subscription:",null==t?void 0:null===(r=t.subscription)||void 0===r?void 0:r.paid),(null==t?void 0:null===(s=t.subscription)||void 0===s?void 0:s.paid)?(console.log("User has paid! \uD83C\uDF89"),w(async e=>{e.length<999&&fetch("https://rent-estimate-newyork.onrender.com/",{method:"GET",headers:new Headers({"Content-Type":"application/json"}),credentials:"same-origin"}).then(e=>e.json()).then(e=>{b(e),a(e=>j(e))})})):(console.log("User has not paid! \uD83D\uDE22"),x(e),w(async e=>{e.length<10?fetch("https://rent-estimate-newyork.onrender.com/",{method:"GET",headers:new Headers({"Content-Type":"application/json"}),credentials:"same-origin"}).then(e=>e.json()).then(e=>{b(e),console.log(e),a(e=>j(e))}):n((0,o.jsxs)("div",{className:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative",children:["The amount of requests has been exceeded for today. Please try again tomorrow or upgrade your plan to get unlimited reports and access to premium features like downloadable reports and more.",(0,o.jsx)("br",{}),(0,o.jsx)("div",{className:"text-center",children:(0,o.jsx)("button",{className:"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center mx-auto h-12 m-2 text-lg",onClick:()=>c("should-pay"),children:"Upgrade Plan  \uD83D\uDE80"})})]})),_(e=>{e?e==u?console.log("same day"):(C(),k(u)):k(u)})}))})};c("has-paid",e)}})},[]),(0,o.jsxs)(i,{children:[(0,o.jsx)(T,{}),r&&(0,o.jsx)("div",{children:r}),(0,o.jsx)(X,{props:e}),(0,o.jsx)(l,{})]})};var $=V}},function(e){e.O(0,[757,885,801,774,888,179],function(){return e(e.s=5557)}),_N_E=e.O()}]);