(function(){
  "use strict";
  const API_URL="https://thehenhouse-reservation.maxgamingdu4.workers.dev";
  async function loadSiteLogo(){try{const response=await fetch(`${API_URL}/logo`,{cache:"no-store",headers:{"Accept":"application/json"}});if(!response.ok)return;const data=await response.json();if(!data.success||!data.logo)return;document.querySelectorAll('img[data-site-logo], .brand img, .login-logo').forEach(img=>{img.src=data.logo;});}catch(error){console.warn("Impossible de récupérer le logo du site.",error);}}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",loadSiteLogo);else loadSiteLogo();
})();
