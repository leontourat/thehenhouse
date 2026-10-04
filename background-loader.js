(function(){
  "use strict";
  const API_URL="https://thehenhouse-reservation.maxgamingdu4.workers.dev";
  const pageMap={"index.html":"home","":"home","menu.html":"menu","events.html":"events","reservation.html":"reservation","contact.html":"contact","alcool.html":"alcool","cocktails.html":"cocktails","mocktails.html":"mocktails","soft.html":"soft","grignotage.html":"grignotage"};
  function getPageKey(){const file=(window.location.pathname.toLowerCase().split("/").pop()||"index.html");return pageMap[file]||"home";}
  async function loadBackground(){try{const response=await fetch(`${API_URL}/backgrounds/${getPageKey()}`,{cache:"no-store",headers:{"Accept":"application/json"}});if(!response.ok)return;const data=await response.json();const image=String(data.image_url||"").trim();if(!image)return;document.body.classList.add("site-background-page");document.body.style.backgroundImage=`url("${image.replace(/"/g,'&quot;')}")`;document.body.style.backgroundSize="cover";document.body.style.backgroundPosition="center center";document.body.style.backgroundAttachment="fixed";document.body.style.backgroundRepeat="no-repeat";}catch(error){console.warn("Impossible de charger le fond de la page.",error);}}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",loadBackground);else loadBackground();
})();
