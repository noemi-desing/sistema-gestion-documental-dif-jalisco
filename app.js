/* =========================================================
   DIF JALISCO — GESTIÓN DOCUMENTAL (FUNCIONAL)
   - HOME: 5 botones (Dirección + 4 Departamentos)
   - Dirección: sube + registra + aplica CADIDO + deriva a deptos
   - Deptos: ven solo lo derivado, descargan, marcan conocimiento,
             generan respuesta (plantilla editable) y guardan respuesta
   - UNA sola base (IndexedDB)
========================================================= */

/* =========================
   CADIDO (EXTRAÍDO DE CADIDO.xlsx)
   - El usuario NO edita esto.
   - Se usa para llenar Código CADIDO, Sección/Serie/Subserie,
     vigencias, destino final, clasificación info, valor documental.
========================= */
const CADIDO = [
  {"area":"Dirección de Planeación Institucional","section":"Sección 8H","code":"8H.1","documento":"Correspondencia General","valor":["Administrativo"],"tramite":5,"concentracion":0,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Dirección de Planeación Institucional","section":"Sección 8H","code":"8H.2","documento":"Agenda de Mejora","valor":["Administrativo"],"tramite":5,"concentracion":8,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Dirección de Planeación Institucional","section":"Sección 8H","code":"8H.3","documento":"MIDE Jalisco","valor":["Administrativo"],"tramite":5,"concentracion":8,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Dirección de Planeación Institucional","section":"Sección 8H","code":"8H.4","documento":"PROGRAMA OPERATIVO ANUAL","valor":["Administrativo"],"tramite":5,"concentracion":8,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Dirección de Planeación Institucional","section":"Sección 8H","code":"8H.5","documento":"Proyecto institucional","valor":["Administrativo"],"tramite":5,"concentracion":8,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Dirección de Planeación Institucional","section":"Sección 8H","code":"8H.6","documento":"Sistema de Control Interno","valor":["Administrativo"],"tramite":5,"concentracion":8,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Dirección de Planeación Institucional","section":"Sección 8H","code":"8H.7","documento":"Sistema de planeación institucional","valor":["Administrativo"],"tramite":5,"concentracion":8,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Dirección de Planeación Institucional","section":"Sección 8H","code":"8H.8","documento":"Sistema de evaluación institucional","valor":["Administrativo"],"tramite":5,"concentracion":8,"destino":"Eliminación","clasif":"Pública"},

  {"area":"Departamento de Planeación y Proyectos","section":"Sección 8H","code":"8H.1.1","documento":"Correspondencia General","valor":["Administrativo"],"tramite":5,"concentracion":0,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Departamento de Planeación y Proyectos","section":"Sección 8H","code":"8H.1.2","documento":"Programación y Presupuestación","valor":["Administrativo"],"tramite":5,"concentracion":4,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Departamento de Planeación y Proyectos","section":"Sección 8H","code":"8H.1.3","documento":"Proyectos","valor":["Administrativo"],"tramite":5,"concentracion":8,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Departamento de Planeación y Proyectos","section":"Sección 8H","code":"8H.1.4","documento":"Innovación Institucional","valor":["Administrativo"],"tramite":5,"concentracion":4,"destino":"Eliminación","clasif":"Pública"},

  {"area":"Departamento de Seguimiento y Evaluación","section":"Sección 8H","code":"8H.2.1","documento":"Correspondencia General","valor":["Administrativo"],"tramite":5,"concentracion":0,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Departamento de Seguimiento y Evaluación","section":"Sección 8H","code":"8H.2.2","documento":"Instrumentos de Planeación","valor":["Administrativo"],"tramite":5,"concentracion":4,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Departamento de Seguimiento y Evaluación","section":"Sección 8H","code":"8H.2.3","documento":"Seguimiento y Evaluación","valor":["Administrativo"],"tramite":5,"concentracion":4,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Departamento de Seguimiento y Evaluación","section":"Sección 8H","code":"8H.2.4","documento":"Indicadores institucionales","valor":["Administrativo"],"tramite":5,"concentracion":4,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Departamento de Seguimiento y Evaluación","section":"Sección 8H","code":"8H.2.5","documento":"Informes institucionales","valor":["Administrativo"],"tramite":5,"concentracion":8,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Departamento de Seguimiento y Evaluación","section":"Sección 8H","code":"8H.2.6","documento":"Evaluación institucional","valor":["Administrativo"],"tramite":5,"concentracion":8,"destino":"Eliminación","clasif":"Pública"},

  {"area":"Departamento de Desarrollo Institucional","section":"Sección 8H","code":"8H.3.1","documento":"Correspondencia General","valor":["Administrativo"],"tramite":5,"concentracion":0,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Departamento de Desarrollo Institucional","section":"Sección 8H","code":"8H.3.2","documento":"Procesos y Procedimientos","valor":["Administrativo"],"tramite":5,"concentracion":8,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Departamento de Desarrollo Institucional","section":"Sección 8H","code":"8H.3.3","documento":"Manual de Organización","valor":["Administrativo"],"tramite":5,"concentracion":8,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Departamento de Desarrollo Institucional","section":"Sección 8H","code":"8H.3.4","documento":"Mejora continua","valor":["Administrativo"],"tramite":5,"concentracion":4,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Departamento de Desarrollo Institucional","section":"Sección 8H","code":"8H.3.5","documento":"Innovación institucional","valor":["Administrativo"],"tramite":5,"concentracion":4,"destino":"Eliminación","clasif":"Pública"},

  {"area":"Departamento de Capacitación e Investigación","section":"Sección 8H","code":"8H.4.1","documento":"Correspondencia General","valor":["Administrativo"],"tramite":5,"concentracion":0,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Departamento de Capacitación e Investigación","section":"Sección 8H","code":"8H.4.2","documento":"Directorio Estatal de Instituciones de Asistencia Social","valor":["Administrativo"],"tramite":5,"concentracion":4,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Departamento de Capacitación e Investigación","section":"Sección 8H","code":"8H.4.3","documento":"Directorio Nacional de Instituciones de Asistencia Social","valor":["Administrativo"],"tramite":5,"concentracion":4,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Departamento de Capacitación e Investigación","section":"Sección 8H","code":"8H.4.4","documento":"Procesos de Capacitación","valor":["Administrativo"],"tramite":5,"concentracion":2,"destino":"Eliminación","clasif":"Pública"},
  {"area":"Departamento de Capacitación e Investigación","section":"Sección 8H","code":"8H.4.5","documento":"Procesos de Investigación","valor":["Administrativo","Legal"],"tramite":5,"concentracion":2,"destino":"Eliminación","clasif":"Pública"}
];

/* =========================
   CAMPOS (según tu sitema_manual.xlsx)
   - Manual: Tipo documental, Fecha doc, Áreas, Asunto, Función, Soporte, Ubicación, Observaciones
   - Automático: No., Código CADIDO, Fondo, Sección, Serie/Subserie, Número doc, Fecha recepción,
                 Valor documental, Vigencias, Destino final, Expediente (sí/no)
========================= */
const FONDO = "Sistema para el Desarrollo Integral de la Familia del Estado de Jalisco";
const SECCION_DEFAULT = "Sección 8H";

/* =========================
   VISTAS
========================= */
const homeView = document.getElementById("homeView");
const views = [
  "direccionView","deptPlaneacionView","deptSeguimientoView","deptDesarrolloView","deptCapacitacionView"
].map(id => document.getElementById(id));

document.querySelectorAll(".home-btn").forEach(btn=>{
  btn.addEventListener("click", () => showView(btn.dataset.view));
});
document.querySelectorAll("[data-back]").forEach(btn=>{
  btn.addEventListener("click", () => showHome());
});

function showHome(){
  homeView.classList.remove("hidden");
  views.forEach(v => v.classList.add("hidden"));
  closeModal();
}
function showView(id){
  homeView.classList.add("hidden");
  views.forEach(v => v.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  closeModal();
  renderAll();
}

/* =========================
   MODAL RESPUESTA
========================= */
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalContext = document.getElementById("modalContext");
const respTipo = document.getElementById("respTipo");
const respNumero = document.getElementById("respNumero");
const respTexto = document.getElementById("respTexto");
const respFile = document.getElementById("respFile");
const respObs = document.getElementById("respObs");
const respDescargarPlantilla = document.getElementById("respDescargarPlantilla");
const respGuardar = document.getElementById("respGuardar");
const respStatus = document.getElementById("respStatus");

let modalState = { recordId:null, dept:null };

modalClose.addEventListener("click", closeModal);
function openModal(record, dept){
  modalState = { recordId: record.id, dept };
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden","false");

  modalContext.textContent = `${record.folio} — ${record.asunto} (${dept})`;
  respTipo.value = "OFICIO";
  respNumero.value = "";
  respTexto.value = "";
  respFile.value = "";
  respObs.value = "";
  setRespStatus("");
}
function closeModal(){
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden","true");
  modalState = { recordId:null, dept:null };
  setRespStatus("");
}
function setRespStatus(msg, ok=true){
  respStatus.textContent = msg;
  respStatus.className = "status " + (msg ? (ok ? "ok":"bad") : "");
}

/* =========================
   INDEXEDDB (una sola base)
========================= */
let db;
const DB_NAME = "DIF_GestionDocumental";
const DB_VER = 1;

function openDB(){
  return new Promise((resolve,reject)=>{
    const req = indexedDB.open(DB_NAME, DB_VER);

    req.onupgradeneeded = e => {
      const d = e.target.result;
      const records = d.createObjectStore("records", { keyPath:"id", autoIncrement:true });
      records.createIndex("folio","folio",{unique:false});
      records.createIndex("toDepts","toDepts",{unique:false});

      const responses = d.createObjectStore("responses", { keyPath:"id", autoIncrement:true });
      responses.createIndex("recordId","recordId",{unique:false});
      responses.createIndex("dept","dept",{unique:false});

      d.createObjectStore("meta", { keyPath:"key" });
    };

    req.onsuccess = e => { db = e.target.result; resolve(); };
    req.onerror = () => reject(req.error);
  });
}

function tx(store, mode="readonly"){ return db.transaction(store, mode).objectStore(store); }

async function metaGet(key, def){
  return new Promise(res=>{
    const r = tx("meta").get(key);
    r.onsuccess = ()=> res(r.result ? r.result.value : def);
    r.onerror = ()=> res(def);
  });
}
async function metaSet(key, value){
  return new Promise(res=>{
    const w = tx("meta","readwrite").put({ key, value });
    w.onsuccess = ()=> res();
    w.onerror = ()=> res();
  });
}

async function addRecord(rec){
  return new Promise((resolve,reject)=>{
    const r = tx("records","readwrite").add(rec);
    r.onsuccess = ()=> resolve(r.result);
    r.onerror = ()=> reject(r.error);
  });
}
async function getAllRecords(){
  return new Promise(res=>{
    const r = tx("records").getAll();
    r.onsuccess = ()=> res(r.result || []);
    r.onerror = ()=> res([]);
  });
}
async function updateRecord(id, patch){
  return new Promise((resolve,reject)=>{
    const store = tx("records","readwrite");
    const g = store.get(id);
    g.onsuccess = ()=>{
      const curr = g.result;
      if(!curr){ resolve(false); return; }
      const next = { ...curr, ...patch };
      const p = store.put(next);
      p.onsuccess = ()=> resolve(true);
      p.onerror = ()=> reject(p.error);
    };
    g.onerror = ()=> reject(g.error);
  });
}

async function addResponse(resp){
  return new Promise((resolve,reject)=>{
    const r = tx("responses","readwrite").add(resp);
    r.onsuccess = ()=> resolve(r.result);
    r.onerror = ()=> reject(r.error);
  });
}
async function getResponsesByRecord(recordId){
  return new Promise(res=>{
    const store = tx("responses");
    const idx = store.index("recordId");
    const req = idx.getAll(recordId);
    req.onsuccess = ()=> res(req.result || []);
    req.onerror = ()=> res([]);
  });
}

/* =========================
   UTIL
========================= */
function nowISO(){ return new Date().toISOString(); }
function fmt(iso){ return new Date(iso).toLocaleString("es-MX"); }
function quarter(d=new Date()){
  const m = d.getMonth()+1;
  return m<=3?1 : m<=6?2 : m<=9?3 : 4;
}
function year(d=new Date()){ return d.getFullYear(); }
function pad(n, w){ return String(n).padStart(w,"0"); }

function sanitize(s){
  return String(s ?? "").replace(/[<>]/g,"");
}

async function readFileAsDataURL(file){
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = ()=> resolve(reader.result);
    reader.onerror = ()=> reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/* =========================
   DIRECCIÓN: FORM
========================= */
const dirCadidoDoc = document.getElementById("dirCadidoDoc");
const cadidoResumen = document.getElementById("cadidoResumen");

const dirInOut = document.getElementById("dirInOut");
const dirCaracter = document.getElementById("dirCaracter");
const dirSoporte = document.getElementById("dirSoporte");
const dirTipoDoc = document.getElementById("dirTipoDoc");
const dirFechaDoc = document.getElementById("dirFechaDoc");
const dirAreaProd = document.getElementById("dirAreaProd");
const dirAreaDest = document.getElementById("dirAreaDest");
const dirAsunto = document.getElementById("dirAsunto");
const dirFuncion = document.getElementById("dirFuncion");
const dirUbicacion = document.getElementById("dirUbicacion");
const dirFechaLimite = document.getElementById("dirFechaLimite");
const dirSemaforo = document.getElementById("dirSemaforo");
const dirFile = document.getElementById("dirFile");
const dirObs = document.getElementById("dirObs");

const toPlaneacion = document.getElementById("toPlaneacion");
const toSeguimiento = document.getElementById("toSeguimiento");
const toDesarrollo = document.getElementById("toDesarrollo");
const toCapacitacion = document.getElementById("toCapacitacion");

const dirSave = document.getElementById("dirSave");
const dirReset = document.getElementById("dirReset");
const dirStatus = document.getElementById("dirStatus");

const dirSearch = document.getElementById("dirSearch");
const dirList = document.getElementById("dirList");
const kpiTotalDir = document.getElementById("kpiTotalDir");
const kpiPendientesDir = document.getElementById("kpiPendientesDir");
const kpiUrgentesDir = document.getElementById("kpiUrgentesDir");

function setDirStatus(msg, ok=true){
  dirStatus.textContent = msg;
  dirStatus.className = "status " + (msg ? (ok ? "ok":"bad") : "");
}

function cadidoOptionsForDireccion(){
  // Dirección registra todo; dejamos TODAS las opciones, agrupadas por área
  const groups = {};
  for(const c of CADIDO){
    if(!groups[c.area]) groups[c.area] = [];
    groups[c.area].push(c);
  }
  // build <option>
  dirCadidoDoc.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "— Selecciona —";
  dirCadidoDoc.appendChild(placeholder);

  Object.keys(groups).sort().forEach(area=>{
    const optg = document.createElement("optgroup");
    optg.label = area;
    groups[area].forEach(c=>{
      const opt = document.createElement("option");
      opt.value = c.code + "||" + c.documento + "||" + c.area;
      opt.textContent = `${c.documento} (${c.code})`;
      optg.appendChild(opt);
    });
    dirCadidoDoc.appendChild(optg);
  });
}

function getCadidoSelected(){
  const v = dirCadidoDoc.value;
  if(!v) return null;
  const [code, doc, area] = v.split("||");
  return CADIDO.find(x => x.code === code && x.documento === doc && x.area === area) || null;
}

dirCadidoDoc.addEventListener("change", ()=>{
  const c = getCadidoSelected();
  if(!c){
    cadidoResumen.textContent = "Selecciona un documento CADIDO…";
    return;
  }
  const serie = `Código CADIDO: ${c.code} · ${c.section || SECCION_DEFAULT}`;
  const valor = `Valor: ${c.valor.join(", ") || "—"}`;
  const vig = `Vigencias: Trámite ${c.tramite} / Concentración ${c.concentracion}`;
  const dest = `Destino final: ${c.destino} · Clasificación: ${c.clasif}`;
  cadidoResumen.textContent = `${serie} | ${valor} | ${vig} | ${dest}`;
});

dirReset.addEventListener("click", ()=>{
  dirInOut.value="ENTRADA";
  dirCaracter.value="CONOCIMIENTO";
  dirSoporte.value="DIGITAL";
  dirTipoDoc.value="MEMO";
  dirFechaDoc.value="";
  dirAreaProd.value="";
  dirAreaDest.value="";
  dirAsunto.value="";
  dirFuncion.value="";
  dirUbicacion.value="";
  dirFechaLimite.value="";
  dirSemaforo.value="VERDE";
  dirFile.value="";
  dirObs.value="";
  toPlaneacion.checked=false;
  toSeguimiento.checked=false;
  toDesarrollo.checked=false;
  toCapacitacion.checked=false;
  dirCadidoDoc.value="";
  cadidoResumen.textContent="Selecciona un documento CADIDO…";
  setDirStatus("");
});

/* =========================
   FOLIO + NUM DOC AUTO
========================= */
async function nextCounter(key){
  const curr = (await metaGet(key, 0)) + 1;
  await metaSet(key, curr);
  return curr;
}
function makeFolio(counter, inout){
  const tipo = inout === "ENTRADA" ? "ENT" : "SAL";
  return `DPI-${tipo}-${year()}-${pad(counter,4)}`;
}
function makeDocNumber(counter){
  return `${year()}-${pad(counter,4)}`;
}

/* =========================
   GUARDAR DIRECCIÓN
========================= */
dirSave.addEventListener("click", async ()=>{
  const c = getCadidoSelected();
  if(!c){ setDirStatus("Selecciona un Documento (CADIDO).", false); return; }

  const asunto = dirAsunto.value.trim();
  const prod = dirAreaProd.value.trim();
  const dest = dirAreaDest.value.trim();
  const funcion = dirFuncion.value.trim();

  if(!asunto || !prod || !dest || !funcion){
    setDirStatus("Faltan campos: Área productora, Área destinataria, Asunto y Función sustantiva.", false);
    return;
  }
  if(!dirFile.files || !dirFile.files.length){
    setDirStatus("Falta subir el archivo (PDF/Word/Escanéo).", false);
    return;
  }

  const toDepts = [];
  if(toPlaneacion.checked) toDepts.push(toPlaneacion.value);
  if(toSeguimiento.checked) toDepts.push(toSeguimiento.value);
  if(toDesarrollo.checked) toDepts.push(toDesarrollo.value);
  if(toCapacitacion.checked) toDepts.push(toCapacitacion.value);

  if(toDepts.length === 0){
    setDirStatus("Selecciona al menos un departamento para derivación.", false);
    return;
  }

  // AUTOMÁTICOS
  const folioCounter = await nextCounter("folioCounter");
  const docCounter = await nextCounter("docCounter");
  const folio = makeFolio(folioCounter, dirInOut.value);
  const numeroDocumento = makeDocNumber(docCounter);

  const createdAt = nowISO();
  const rec = {
    // Automáticos (según tu tabla)
    no: folioCounter,
    codigoCadido: c.code,
    fondo: FONDO,
    seccion: c.section || SECCION_DEFAULT,
    serie: c.area, // Serie macro por área (se guarda)
    subserie: c.documento, // Documento en CADIDO
    tipoDocumental: dirTipoDoc.value,
    numeroDocumento,
    fechaDocumento: dirFechaDoc.value || "",
    fechaRecepcion: createdAt,
    vigTramite: c.tramite,
    vigConcentracion: c.concentracion,
    valorDocumental: c.valor,
    destinoFinal: c.destino,
    clasificacionInfo: c.clasif,
    expediente: "SÍ",
    trimestre: quarter(),
    anio: year(),

    // Manuales
    inOut: dirInOut.value,
    caracter: dirCaracter.value,
    soporte: dirSoporte.value,
    areaProductora: prod,
    areaDestinataria: dest,
    asunto,
    funcionSustantiva: funcion,
    ubicacion: dirUbicacion.value.trim() || "Plataforma",
    observaciones: dirObs.value.trim() || "",

    // Flujo
    folio,
    createdAt,
    toDepts,
    fechaLimite: dirFechaLimite.value || "",
    semaforo: dirSemaforo.value,
    conocimiento: {}, // dept -> true/false
    status: "ASIGNADO",

    // Archivo
    fileName: dirFile.files[0].name,
    fileType: dirFile.files[0].type || "application/octet-stream",
    fileData: await readFileAsDataURL(dirFile.files[0]),
  };

  await addRecord(rec);
  setDirStatus(`Guardado: ${folio}`, true);
  dirReset.click();
  renderAll();
});

/* =========================
   RENDER DIRECCIÓN
========================= */
dirSearch.addEventListener("input", ()=> renderAll());

function matchesQuery(r, q){
  if(!q) return true;
  const hay = [
    r.folio, r.asunto, r.areaProductora, r.areaDestinataria,
    r.inOut, r.caracter, (r.toDepts||[]).join(" "),
    r.codigoCadido, r.subserie
  ].join(" ").toLowerCase();
  return hay.includes(q.toLowerCase());
}

function tagClassForSemaforo(v){
  if(v==="ROJO") return "tag red";
  if(v==="AMARILLO") return "tag yellow";
  return "tag green";
}
function tagClassForCaracter(v){
  if(v==="URGENTE") return "tag red";
  if(v==="RESPUESTA") return "tag yellow";
  return "tag gray";
}

async function renderDireccion(records){
  const q = dirSearch.value.trim();
  const list = records.filter(r => matchesQuery(r,q)).sort((a,b)=> (b.createdAt||"").localeCompare(a.createdAt||""));

  const total = list.length;
  const pendientes = list.filter(r => (r.caracter==="RESPUESTA") && !hasAnyResponse(r)).length;
  const urg = list.filter(r => r.caracter==="URGENTE").length;

  kpiTotalDir.textContent = `Total: ${total}`;
  kpiPendientesDir.textContent = `Pendientes: ${pendientes}`;
  kpiUrgentesDir.textContent = `Urgentes: ${urg}`;

  if(!list.length){
    dirList.innerHTML = `<div class="item"><div class="meta"><b>Sin registros</b><br><small>Aún no hay documentos registrados.</small></div></div>`;
    return;
  }

  const html = [];
  for(const r of list){
    const respCount = (await getResponsesByRecord(r.id)).length;
    html.push(`
      <div class="item">
        <div class="meta">
          <div><b>${sanitize(r.folio)}</b> — ${sanitize(r.inOut)} · ${sanitize(r.tipoDocumental)} · CADIDO ${sanitize(r.codigoCadido)}</div>
          <small>${sanitize(fmt(r.createdAt))} · Derivado a: ${sanitize((r.toDepts||[]).join(", "))}</small>
          <div class="tags">
            <span class="tag orange">${sanitize(r.status)}</span>
            <span class="${tagClassForCaracter(r.caracter)}">${sanitize(r.caracter)}</span>
            <span class="${tagClassForSemaforo(r.semaforo)}">${sanitize(r.semaforo)}</span>
            ${r.fechaLimite ? `<span class="tag gray">Límite: ${sanitize(r.fechaLimite)}</span>` : ``}
            <span class="tag gray">Resp.: ${respCount}</span>
          </div>
          <div style="margin-top:8px;">
            <div><b>Asunto:</b> ${sanitize(r.asunto)}</div>
            <div><b>De:</b> ${sanitize(r.areaProductora)} · <b>Para:</b> ${sanitize(r.areaDestinataria)}</div>
          </div>
        </div>

        <div class="btns">
          <button class="btn gray small" data-dl="${r.id}">⬇ Descargar</button>
        </div>
      </div>
    `);
  }
  dirList.innerHTML = html.join("");

  dirList.querySelectorAll("[data-dl]").forEach(b=>{
    b.addEventListener("click", async ()=>{
      const id = Number(b.dataset.dl);
      const rec = records.find(x=>x.id===id);
      if(!rec) return;
      downloadDataUrl(rec.fileData, rec.fileName);
    });
  });
}

/* =========================
   DEPARTAMENTOS
========================= */
document.querySelectorAll(".dept").forEach(section=>{
  const deptName = section.dataset.dept;
  const search = section.querySelector(".deptSearch");
  search.addEventListener("input", ()=> renderAll());
});

function hasAnyResponse(record){
  // rápido: lo recalculamos en render usando store; aquí se usa solo para KPIs generales
  return false;
}

async function renderDept(section, records){
  const deptName = section.dataset.dept;
  const search = section.querySelector(".deptSearch").value.trim();
  const listEl = section.querySelector(".deptList");
  const kTotal = section.querySelector(".deptTotal");
  const kResp = section.querySelector(".deptResp");
  const kUrg = section.querySelector(".deptUrg");

  // Solo lo derivado a este depto
  const mine = records
    .filter(r => (r.toDepts||[]).includes(deptName))
    .filter(r => matchesQuery(r, search))
    .sort((a,b)=> (b.createdAt||"").localeCompare(a.createdAt||""));

  const respCounts = {};
  for(const r of mine){
    const resp = await getResponsesByRecord(r.id);
    respCounts[r.id] = resp.length;
  }

  kTotal.textContent = `Total: ${mine.length}`;
  kResp.textContent = `Requiere respuesta: ${mine.filter(r=>r.caracter==="RESPUESTA" && (respCounts[r.id]===0)).length}`;
  kUrg.textContent = `Urgente: ${mine.filter(r=>r.caracter==="URGENTE").length}`;

  if(!mine.length){
    listEl.innerHTML = `<div class="item"><div class="meta"><b>Sin documentos</b><br><small>No hay documentos derivados a este departamento.</small></div></div>`;
    return;
  }

  const html = [];
  for(const r of mine){
    const knows = !!(r.conocimiento && r.conocimiento[deptName]);
    const respN = respCounts[r.id] || 0;

    html.push(`
      <div class="item">
        <div class="meta">
          <div><b>${sanitize(r.folio)}</b> — ${sanitize(r.inOut)} · ${sanitize(r.tipoDocumental)} · CADIDO ${sanitize(r.codigoCadido)}</div>
          <small>${sanitize(fmt(r.createdAt))}</small>
          <div class="tags">
            <span class="${tagClassForCaracter(r.caracter)}">${sanitize(r.caracter)}</span>
            <span class="${tagClassForSemaforo(r.semaforo)}">${sanitize(r.semaforo)}</span>
            <span class="tag gray">${knows ? "CONOCIMIENTO: SÍ" : "CONOCIMIENTO: NO"}</span>
            <span class="tag gray">Resp.: ${respN}</span>
          </div>
          <div style="margin-top:8px;">
            <div><b>Asunto:</b> ${sanitize(r.asunto)}</div>
            <div><b>De:</b> ${sanitize(r.areaProductora)} · <b>Para:</b> ${sanitize(r.areaDestinataria)}</div>
          </div>
        </div>

        <div class="btns">
          <button class="btn gray small" data-dl="${r.id}">⬇ Descargar</button>
          <button class="btn gray small" data-know="${r.id}">${knows ? "✔ Conocimiento" : "Marcar conocimiento"}</button>
          <button class="btn primary small" data-resp="${r.id}">📝 Responder</button>
        </div>
      </div>
    `);
  }

  listEl.innerHTML = html.join("");

  // Descargar
  listEl.querySelectorAll("[data-dl]").forEach(b=>{
    b.addEventListener("click", ()=>{
      const id = Number(b.dataset.dl);
      const rec = records.find(x=>x.id===id);
      if(!rec) return;
      downloadDataUrl(rec.fileData, rec.fileName);
    });
  });

  // Conocimiento
  listEl.querySelectorAll("[data-know]").forEach(b=>{
    b.addEventListener("click", async ()=>{
      const id = Number(b.dataset.know);
      const rec = records.find(x=>x.id===id);
      if(!rec) return;
      const conocimiento = { ...(rec.conocimiento||{}), [deptName]: true };
      await updateRecord(id, { conocimiento });
      renderAll();
    });
  });

  // Responder
  listEl.querySelectorAll("[data-resp]").forEach(b=>{
    b.addEventListener("click", async ()=>{
      const id = Number(b.dataset.resp);
      const rec = records.find(x=>x.id===id);
      if(!rec) return;
      openModal(rec, deptName);
    });
  });
}

/* =========================
   RESPUESTA: DESCARGAR PLANTILLA EDITABLE
   - Genera un .doc (HTML) que Word abre como editable.
========================= */
respDescargarPlantilla.addEventListener("click", async ()=>{
  if(!modalState.recordId) return;

  const records = await getAllRecords();
  const rec = records.find(r=>r.id===modalState.recordId);
  if(!rec) return;

  const tipo = respTipo.value; // OFICIO/MEMO
  const dept = modalState.dept;

  const num = respNumero.value.trim() || `RESP-${year()}-${pad(await nextCounter("respCounter"),4)}`;
  const cuerpo = (respTexto.value || "").trim() || "—";

  const html = `
  <html>
  <head><meta charset="UTF-8"></head>
  <body style="font-family:Segoe UI, Arial, sans-serif; font-size:12pt;">
    <h2 style="margin:0;">DIF Jalisco</h2>
    <div>Dirección de Planeación Institucional</div>
    <hr>
    <div><b>Tipo:</b> ${tipo === "OFICIO" ? "OFICIO" : "MEMORÁNDUM"}</div>
    <div><b>Número:</b> ${sanitize(num)}</div>
    <div><b>Folio relacionado:</b> ${sanitize(rec.folio)}</div>
    <div><b>Departamento que responde:</b> ${sanitize(dept)}</div>
    <div><b>CADIDO:</b> ${sanitize(rec.codigoCadido)} — ${sanitize(rec.subserie)}</div>
    <div><b>Asunto:</b> ${sanitize(rec.asunto)}</div>
    <br>
    <div style="white-space:pre-wrap;">${sanitize(cuerpo)}</div>
    <br><br>
    <div>ATENTAMENTE</div>
    <br><br>
    <div>__________________________________</div>
    <div>Nombre y cargo</div>
  </body></html>`;

  downloadBlob(new Blob([html], {type:"application/msword"}), `${tipo}_${rec.folio}_${num}.doc`);
});

/* =========================
   RESPUESTA: GUARDAR EN SISTEMA
========================= */
respGuardar.addEventListener("click", async ()=>{
  if(!modalState.recordId || !modalState.dept){
    setRespStatus("No hay contexto de respuesta.", false);
    return;
  }

  const records = await getAllRecords();
  const rec = records.find(r=>r.id===modalState.recordId);
  if(!rec){ setRespStatus("No se encontró el documento.", false); return; }

  const tipo = respTipo.value;
  const dept = modalState.dept;
  const num = respNumero.value.trim() || `RESP-${year()}-${pad(await nextCounter("respCounter"),4)}`;
  const texto = (respTexto.value || "").trim();

  // Adjuntar respuesta firmada (opcional)
  let fileData=null, fileName=null, fileType=null;
  if(respFile.files && respFile.files.length){
    const f = respFile.files[0];
    fileName = f.name;
    fileType = f.type || "application/octet-stream";
    fileData = await readFileAsDataURL(f);
  }

  const resp = {
    recordId: rec.id,
    folioOrigen: rec.folio,
    dept,
    tipo,
    numero: num,
    texto,
    observaciones: respObs.value.trim() || "",
    createdAt: nowISO(),
    // Hereda CADIDO (clave para cumplimiento)
    codigoCadido: rec.codigoCadido,
    seccion: rec.seccion,
    vigTramite: rec.vigTramite,
    vigConcentracion: rec.vigConcentracion,
    destinoFinal: rec.destinoFinal,
    clasificacionInfo: rec.clasificacionInfo,
    valorDocumental: rec.valorDocumental,
    // archivo respuesta (opcional)
    fileName, fileType, fileData
  };

  await addResponse(resp);
  setRespStatus("Respuesta guardada en el sistema.", true);
  renderAll();
});

/* =========================
   DESCARGAS
========================= */
function downloadDataUrl(dataUrl, filename){
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
function downloadBlob(blob, filename){
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* =========================
   RENDER GENERAL
========================= */
async function renderAll(){
  const records = await getAllRecords();

  // Dirección
  if(!document.getElementById("direccionView").classList.contains("hidden")){
    await renderDireccion(records);
  }

  // Deptos
  document.querySelectorAll(".dept").forEach(async (section)=>{
    if(!section.classList.contains("hidden")){
      await renderDept(section, records);
    }
  });
}

/* =========================
   INIT
========================= */
(async function init(){
  await openDB();
  cadidoOptionsForDireccion();
  showHome();
})();



