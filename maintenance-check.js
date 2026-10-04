(function(){
"use strict";
const API_URL="https://thehenhouse-reservation.maxgamingdu4.workers.dev";
const path=window.location.pathname.toLowerCase();
const page=path.split("/").pop()||"index.html";
if(["maintenance.html","events-admin.html"].includes(page)) return;
(async()=>{
 try{
  const r=await fetch(API_URL+"/maintenance",{cache:"no-store"});
  const d=await r.json();
  if(!d.success||!d.maintenance)return;
  const target=path.includes("/menu/")?"../maintenance.html":"maintenance.html";
  window.location.replace(target);
 }catch(e){console.warn("Maintenance check:",e)}
})();
})();
