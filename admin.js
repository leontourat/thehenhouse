const API_URL="https://thehenhouse-reservation.maxgamingdu4.workers.dev";
let adminCode="";

const $=id=>document.getElementById(id);
function msg(id,text,type="info"){
 const el=$(id); if(!el)return;
 el.className="message show "+type; el.textContent=text;
}
async function api(path,options={}){
 options.headers={...(options.headers||{}),"Authorization":"Bearer "+adminCode,"Content-Type":"application/json"};
 const r=await fetch(API_URL+path,options);
 let d={}; try{d=await r.json()}catch{}
 if(!r.ok||d.success===false)throw new Error(d.error||"Erreur serveur");
 return d;
}

async function login(){
 const code=$("adminCode").value.trim();
 if(!code){msg("loginMessage","❌ Veuillez entrer le code administrateur.","error");return}
 msg("loginMessage","🔐 Vérification...","info");
 try{
  const r=await fetch(API_URL+"/admin/verify",{headers:{Authorization:"Bearer "+code},cache:"no-store"});
  const d=await r.json();
  if(!r.ok||!d.success)throw new Error("Code administrateur incorrect.");
  adminCode=code;
  $("loginSection").classList.add("hidden");
  $("adminSection").classList.remove("hidden");
  await refreshAll();
 }catch(e){msg("loginMessage","❌ "+e.message,"error");$("adminCode").select()}
}

async function refreshAll(){
 await Promise.all([loadMaintenance(),loadEvents(),loadBackground(),loadLogo()]);
}

async function loadMaintenance(){
 try{
  const r=await fetch(API_URL+"/maintenance",{cache:"no-store"}),d=await r.json();
  $("maintenanceButton").textContent=d.maintenance?"🟢 Désactiver la maintenance":"🔧 Activer la maintenance";
 }catch(e){$("maintenanceButton").textContent="Erreur"}
}
$("maintenanceButton").onclick=async()=>{
 const enabled=$("maintenanceButton").textContent.includes("Désactiver");
 if(!confirm(enabled?"Désactiver le mode maintenance ?":"Activer le mode maintenance ?"))return;
 try{
  const d=await api("/maintenance",{method:"POST",body:JSON.stringify({enabled:!enabled})});
  $("maintenanceButton").textContent=d.maintenance?"🟢 Désactiver la maintenance":"🔧 Activer la maintenance";
 }catch(e){alert(e.message)}
};

async function loadEvents(){
 const box=$("eventList");
 try{
  const r=await fetch(API_URL+"/events",{cache:"no-store"}),d=await r.json();
  const events=d.events||[];
  box.innerHTML=events.length?events.map(e=>`
   <div class="admin-item">
    <div><strong>${escapeHtml(e.title)}</strong><div class="meta">${escapeHtml(e.date)} • ${escapeHtml(e.time||"")}</div></div>
    <div class="admin-actions"><button onclick="editEvent(${e.id})">Modifier</button><button onclick="deleteEvent(${e.id})">Supprimer</button></div>
   </div>`).join(""):"<p class='small'>Aucun événement.</p>";
 }catch(e){box.innerHTML="<p class='small'>Impossible de charger les événements.</p>"}
}
$("eventForm").onsubmit=async e=>{
 e.preventDefault();
 const id=$("eventId").value;
 const body={title:$("eventTitle").value.trim(),image_url:$("eventImage").value.trim(),date:$("eventDate").value,time:$("eventTime").value,description:$("eventDescription").value.trim()};
 try{
  await api(id?"/events/"+id:"/events",{method:id?"PUT":"POST",body:JSON.stringify(body)});
  resetEventForm(); await loadEvents();
 }catch(err){alert(err.message)}
};
window.editEvent=async id=>{
 const r=await fetch(API_URL+"/events",{cache:"no-store"}),d=await r.json(),e=(d.events||[]).find(x=>x.id===id);
 if(!e)return;
 $("eventId").value=e.id;$("eventTitle").value=e.title||"";$("eventImage").value=e.image_url||"";$("eventDate").value=e.date||"";$("eventTime").value=e.time||"";$("eventDescription").value=e.description||"";
 $("eventFormTitle").textContent="Modifier l’événement";$("cancelEventEdit").classList.remove("hidden");
 document.querySelector('[data-section="eventsSection"]').click();
};
window.deleteEvent=async id=>{
 if(!confirm("Supprimer cet événement ?"))return;
 try{await api("/events/"+id,{method:"DELETE"});await loadEvents()}catch(e){alert(e.message)}
};
function resetEventForm(){
 $("eventForm").reset();$("eventId").value="";$("eventFormTitle").textContent="Créer un événement";$("cancelEventEdit").classList.add("hidden");
}
$("cancelEventEdit").onclick=resetEventForm;

async function loadBackground(){
 try{
  const page=$("backgroundPage").value,r=await fetch(API_URL+"/backgrounds/"+page,{cache:"no-store"}),d=await r.json();
  const url=d.image_url||"";
  $("backgroundUrl").value=url;
  $("backgroundPreview").src=url;
  $("backgroundPreview").classList.toggle("hidden",!url);
 }catch(e){}
}
$("backgroundPage").onchange=loadBackground;
$("backgroundUrl").oninput=()=>{
 const u=$("backgroundUrl").value.trim();
 $("backgroundPreview").src=u;$("backgroundPreview").classList.toggle("hidden",!u);
};
$("backgroundForm").onsubmit=async e=>{
 e.preventDefault();
 try{await api("/backgrounds/"+$("backgroundPage").value,{method:"POST",body:JSON.stringify({image_url:$("backgroundUrl").value.trim()})});alert("Fond enregistré.")}catch(err){alert(err.message)}
};
$("deleteBackground").onclick=async()=>{
 if(!confirm("Supprimer le fond de cette page ?"))return;
 try{await api("/backgrounds/"+$("backgroundPage").value,{method:"DELETE"});await loadBackground()}catch(e){alert(e.message)}
};

async function loadLogo(){
 try{
  const r=await fetch(API_URL+"/logo",{cache:"no-store"}),d=await r.json(),u=d.logo||"";
  $("logoUrl").value=u;$("logoPreview").src=u;$("logoPreview").classList.toggle("hidden",!u);
 }catch(e){}
}
$("logoUrl").oninput=()=>{
 const u=$("logoUrl").value.trim();$("logoPreview").src=u;$("logoPreview").classList.toggle("hidden",!u);
};
$("logoForm").onsubmit=async e=>{
 e.preventDefault();
 try{await api("/logo",{method:"POST",body:JSON.stringify({logo:$("logoUrl").value.trim()})});alert("Logo enregistré.")}catch(err){alert(err.message)}
};
$("resetLogo").onclick=async()=>{
 if(!confirm("Remettre le logo par défaut ?"))return;
 try{await api("/logo",{method:"DELETE"});await loadLogo()}catch(e){alert(e.message)}
};

document.querySelectorAll(".admin-nav button").forEach(b=>b.onclick=()=>{
 document.querySelectorAll(".admin-nav button").forEach(x=>x.classList.remove("active"));
 document.querySelectorAll(".admin-section").forEach(x=>x.classList.remove("active"));
 b.classList.add("active");$(b.dataset.section).classList.add("active");
});
$("loginButton").onclick=login;
$("adminCode").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();login()}});
$("logoutButton").onclick=()=>{
 adminCode="";$("adminSection").classList.add("hidden");$("loginSection").classList.remove("hidden");$("adminCode").value="";$("loginMessage").className="message";
};
function escapeHtml(v){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
