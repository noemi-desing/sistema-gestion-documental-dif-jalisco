/* =========================================================
   DIF JALISCO — GESTIÓN DOCUMENTAL
   app.js
   Flujo:
   HOME → DIRECCIÓN (registro) → DEPARTAMENTOS (atención)
========================================================= */

let db;

/* =========================
   UTILIDADES
========================= */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

function nowISO(){ return new Date().toISOString(); }
function year(){ return new Date().getFullYear(); }
function quarter(){
  const m = new Date().getMonth()+1;
  return m<=3?1:m<=6?2:m<=9?3:4;
}
function pad(n,l=4){ return String(n).padStart(l,"0"); }

/* =========================
   CADIDO (AUTO / OCULTO)
   (base – se puede expandir)
========================= */
const CADIDO = {
  MEMO: {
    codigo: "DPI-01-01",
    serie: "Correspondencia interna",
    subserie: "Memorándum",
    destino: "Conservación por sexenio"
  },
  OFICIO: {
    codigo: "DPI-01-02",
    serie: "Correspondencia oficial",
    subserie: "Oficio",
    destino: "Conservación por sexenio"
  },
  CIRCULAR: {
    codigo: "DPI-02-01",
    serie: "Normatividad interna",
    subserie: "Circular",
    destino: "Conservación por sexenio"
  },
  OTRO: {
    codigo: "DPI-99-99",
    serie: "Otros",
    subserie: "Otros",
    destino: "Revisión"
  }
};

/* =========================
   BASE DE DATOS (IndexedDB)
========================= */
function openDB(){
  return new Promise(resolve=>{
    const req = indexedDB.open("DIF_GestionDocumental",1);
    req.onupgradeneeded = e=>{
      const db = e.target.result;
      db.createObjectStore("docs",{keyPath:"id",autoIncrement:true});
      db.createObjectStore("meta",{keyPath:"key"});
    };
    req.onsuccess = e=>{ db=e.target.result; resolve(); };
  });
}

function metaGet(key,def){
  return new Promise(res=>{
    const tx=db.transaction("meta","readonly");
    const r=tx.objectStore("meta").get(key);
    r.onsuccess=()=>res(r.result?r.result.value:def);
  });
}
function metaSet(key,val){
  return new Promise(res=>{
    const tx=db.transaction("meta","readwrite");
    tx.objectStore("meta").put({key,value:val});
    tx.oncomplete=()=>res();
  });
}

function addDoc(doc){
  return new Promise(res=>{
    const tx=db.transaction("docs","readwrite");
    tx.objectStore("docs").add(doc);
    tx.oncomplete=()=>res();
  });
}

function getAllDocs(){
  return new Promise(res=>{
    const tx=db.transaction("docs","readonly");
    const r=tx.objectStore("docs").getAll();
    r.onsuccess=()=>res(r.result||[]);
  });
}

function updateDoc(id,patch){
  return new Promise(res=>{
    const tx=db.transaction("docs","readwrite");
    const store=tx.objectStore("docs");
    const g=store.get(id);
    g.onsuccess=()=>{
      const d={...g.result,...patch};
      store.put(d);
      res();
    };
  });
}

/* =========================
   NAVEGACIÓN
========================= */
$$("[data-view]").forEach(b=>{
  b.onclick=()=>{
    hideAll();
    $(b.dataset.view).classList.remove("hidden");
  };
});
$$("[data-back]").forEach(b=>{
  b.onclick=()=>{
    hideAll();
    $("homeView").classList.remove("hidden");
  };
});
function hideAll(){
  $$("section.card").forEach(s=>s.classList.add("hidden"));
}

/* =========================
   SUBIDA DE ARCHIVO (Dirección)
========================= */
$("dirFile").addEventListener("change",()=>{
  const f=$("dirFile").files[0];
  if(!f) return;
  $("dirPreview").textContent = f.name;
});

function readFile(file){
  return new Promise(res=>{
    const r=new FileReader();
    r.onload=()=>res(r.result);
    r.readAsDataURL(file);
  });
}

/* =========================
   GUARDAR REGISTRO (Dirección)
========================= */
$("dirSave").onclick = async ()=>{
  const file=$("dirFile").files[0];
  if(!file){ $("dirStatus").textContent="Sube un archivo."; return; }

  const counter = (await metaGet("folio",0))+1;
  await metaSet("folio",counter);

  const tipo=$("dirTipoDoc").value;
  const cad=CADIDO[tipo]||CADIDO.OTRO;

  const folio=`DPI-${year()}-${pad(counter)}`;
  const fileData=await readFile(file);

  const doc={
    folio,
    created: nowISO(),
    year: year(),
    quarter: quarter(),
    inout: $("dirInOut").value,
    tipo,
    fechaDoc: $("dirFechaDoc").value,
    areaProd: $("dirAreaProd").value,
    areaDest: $("dirAreaDest").value,
    asunto: $("dirAsunto").value,
    funcion: $("dirFuncion").value,
    ubicacion: $("dirUbicacion").value,
    caracter: $("dirCaracter").value,
    fechaLimite: $("dirFechaLimite").value,
    semaforo: $("dirSemaforo").value,
    obs: $("dirObs").value,
    cadido: cad,
    fileName: file.name,
    fileData,
    derivados: getDerivados(),
    respuestas: []
  };

  await addDoc(doc);
  $("dirStatus").textContent=`Documento registrado: ${folio}`;
  renderDireccion();
};

/* =========================
   DERIVACIÓN
========================= */
function getDerivados(){
  const a=[];
  if($("toPlaneacion").checked) a.push("Departamento de Planeación y Proyectos");
  if($("toSeguimiento").checked) a.push("Departamento de Seguimiento y Evaluación");
  if($("toDesarrollo").checked) a.push("Departamento de Desarrollo Institucional");
  if($("toCapacitacion").checked) a.push("Departamento de Capacitación e Investigación");
  return a;
}

/* =========================
   RENDER DIRECCIÓN
========================= */
async function renderDireccion(){
  const list=$("dirList");
  list.innerHTML="";
  const docs=await getAllDocs();

  $("kpiTotalDir").textContent=`Total: ${docs.length}`;
  $("kpiUrgentesDir").textContent=`Urgentes: ${docs.filter(d=>d.caracter==="URGENTE").length}`;
  $("kpiPendientesDir").textContent=`Pendientes: ${docs.filter(d=>d.derivados.length>0).length}`;

  docs.forEach(d=>{
    const div=document.createElement("div");
    div.className="panel";
    div.innerHTML=`
      <b>${d.folio}</b> — ${d.asunto}<br>
      <small>${d.tipo} · ${d.caracter}</small><br>
      <button data-id="${d.id}">⬇ Descargar</button>
    `;
    div.querySelector("button").onclick=()=>{
      const a=document.createElement("a");
      a.href=d.fileData;
      a.download=d.fileName;
      a.click();
    };
    list.appendChild(div);
  });
}

/* =========================
   RENDER DEPARTAMENTOS
========================= */
async function renderDept(view){
  const dept=view.dataset.dept;
  const list=view.querySelector(".deptList");
  list.innerHTML="";
  const docs=await getAllDocs();
  const mine=docs.filter(d=>d.derivados.includes(dept));

  view.querySelector(".deptTotal").textContent=`Total: ${mine.length}`;
  view.querySelector(".deptResp").textContent=`Requiere respuesta: ${mine.filter(d=>d.caracter!=="CONOCIMIENTO").length}`;
  view.querySelector(".deptUrg").textContent=`Urgente: ${mine.filter(d=>d.caracter==="URGENTE").length}`;

  mine.forEach(d=>{
    const div=document.createElement("div");
    div.className="panel";
    div.innerHTML=`
      <b>${d.folio}</b> — ${d.asunto}<br>
      <small>${d.caracter} · Semáforo ${d.semaforo}</small><br>
      <button class="dl">⬇ Descargar</button>
      ${d.caracter!=="CONOCIMIENTO"?'<button class="resp">📝 Responder</button>':""}
    `;
    div.querySelector(".dl").onclick=()=>{
      const a=document.createElement("a");
      a.href=d.fileData;
      a.download=d.fileName;
      a.click();
    };
    if(div.querySelector(".resp")){
      div.querySelector(".resp").onclick=()=>openRespuesta(d,dept);
    }
    list.appendChild(div);
  });
}

/* =========================
   RESPUESTA (Deptos)
========================= */
function openRespuesta(doc,dept){
  $("modal").classList.remove("hidden");
  $("modalContext").textContent=`${doc.folio} — ${doc.asunto}`;
  $("respTexto").value=`En atención al documento ${doc.folio}, se informa que…`;
  $("respGuardar").onclick=async ()=>{
    const f=$("respFile").files[0];
    if(!f){ $("respStatus").textContent="Sube la respuesta."; return; }
    const data=await readFile(f);
    doc.respuestas.push({
      dept,
      fecha: nowISO(),
      texto: $("respTexto").value,
      fileName: f.name,
      fileData: data
    });
    await updateDoc(doc.id,{respuestas:doc.respuestas});
    $("respStatus").textContent="Respuesta guardada.";
  };
}

$("modalClose").onclick=()=>$("modal").classList.add("hidden");

/* =========================
   INIT
========================= */
(async()=>{
  await openDB();
  renderDireccion();
  $$(".dept").forEach(v=>renderDept(v));
})();



