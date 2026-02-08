/* =========================================================
   DIF JALISCO — GESTIÓN DOCUMENTAL (MVP FUNCIONAL)
   - Captura registros (entrada/salida)
   - Folio automático
   - Trimestre automático
   - CADIDO automático (oculto)
   - Adjuntos reales (IndexedDB)
   - Listado Trámite / Concentración
   - Descarga de adjuntos
   - Export Concentración (CSV)
   - Permisos por rol (simulado)
========================================================= */

let db;

// UI
const roleSelect = document.getElementById("roleSelect");
const searchInput = document.getElementById("searchInput");
const alertsBox = document.getElementById("alertsBox");

const ioType = document.getElementById("ioType");
const docType = document.getElementById("docType");
const areaFrom = document.getElementById("areaFrom");
const areaTo = document.getElementById("areaTo");
const subject = document.getElementById("subject");
const traffic = document.getElementById("traffic");
const dueDate = document.getElementById("dueDate");
const fileInput = document.getElementById("fileInput");

const saveBtn = document.getElementById("saveBtn");
const resetFormBtn = document.getElementById("resetFormBtn");
const saveStatus = document.getElementById("saveStatus");

const tramiteList = document.getElementById("tramiteList");
const concentracionList = document.getElementById("concentracionList");

const exportConcentracionBtn = document.getElementById("exportConcentracionBtn");
const clearAllBtn = document.getElementById("clearAllBtn");

// =========================
// CADIDO (OCULTO) — reglas base (MVP)
// En tu versión final, esto se reemplaza con tu CADIDO real completo.
// =========================
const CADIDO_RULES = {
  memorandum: { serie: "Correspondencia interna", subserie: "Memorándums", conservacion: "2 años", valor: "Administrativo", destino: "Conservación por sexenio" },
  oficio:     { serie: "Correspondencia oficial", subserie: "Oficios",      conservacion: "5 años", valor: "Legal",          destino: "Conservación por sexenio" },
  circular:   { serie: "Normatividad interna",    subserie: "Circulares",   conservacion: "5 años", valor: "Administrativo", destino: "Conservación por sexenio" }
};

function getCadido(docTypeValue){
  return CADIDO_RULES[docTypeValue] || {
    serie:"Sin clasificar", subserie:"Sin clasificar", conservacion:"N/A", valor:"N/A", destino:"N/A"
  };
}

// =========================
// FECHAS / TRIMESTRE / FOLIO
// =========================
function nowISO(){ return new Date().toISOString(); }

function getQuarter(date = new Date()){
  const m = date.getMonth() + 1; // 1..12
  if(m <= 3) return 1;
  if(m <= 6) return 2;
  if(m <= 9) return 3;
  return 4;
}

function year(date = new Date()){ return date.getFullYear(); }

function fmtDateTime(iso){
  const d = new Date(iso);
  return d.toLocaleString("es-MX");
}

function makeFolio(counter, io){
  // ejemplo: DPI-ENT-2026-0001
  const pref = "DPI";
  const type = io === "entrada" ? "ENT" : "SAL";
  const y = year();
  const n = String(counter).padStart(4,"0");
  return `${pref}-${type}-${y}-${n}`;
}

// =========================
// IndexedDB
// =========================
function openDB(){
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("DIF_ArchivoDocumental", 1);

    req.onupgradeneeded = e => {
      const dbx = e.target.result;
      const store = dbx.createObjectStore("records", { keyPath:"id", autoIncrement:true });
      store.createIndex("status","status",{unique:false});
      store.createIndex("folio","folio",{unique:false});
      store.createIndex("year","year",{unique:false});
      dbx.createObjectStore("meta", { keyPath:"key" });
    };

    req.onsuccess = e => { db = e.target.result; resolve(); };
    req.onerror = () => reject(req.error);
  });
}

async function getMeta(key, defaultValue){
  return new Promise((resolve) => {
    const tx = db.transaction("meta","readonly");
    const store = tx.objectStore("meta");
    const r = store.get(key);
    r.onsuccess = () => resolve(r.result ? r.result.value : defaultValue);
    r.onerror = () => resolve(defaultValue);
  });
}

async function setMeta(key, value){
  return new Promise((resolve) => {
    const tx = db.transaction("meta","readwrite");
    tx.objectStore("meta").put({ key, value });
    tx.oncomplete = () => resolve();
  });
}

async function addRecord(rec){
  return new Promise((resolve, reject) => {
    const tx = db.transaction("records","readwrite");
    const store = tx.objectStore("records");
    const r = store.add(rec);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

async function updateRecord(id, patch){
  return new Promise((resolve, reject) => {
    const tx = db.transaction("records","readwrite");
    const store = tx.objectStore("records");
    const g = store.get(id);
    g.onsuccess = () => {
      const curr = g.result;
      if(!curr){ resolve(false); return; }
      const next = { ...curr, ...patch };
      const p = store.put(next);
      p.onsuccess = () => resolve(true);
      p.onerror = () => reject(p.error);
    };
    g.onerror = () => reject(g.error);
  });
}

async function deleteRecord(id){
  return new Promise((resolve) => {
    const tx = db.transaction("records","readwrite");
    tx.objectStore("records").delete(id);
    tx.oncomplete = () => resolve();
  });
}

async function getAllRecords(){
  return new Promise((resolve) => {
    const tx = db.transaction("records","readonly");
    const store = tx.objectStore("records");
    const r = store.getAll();
    r.onsuccess = () => resolve(r.result || []);
    r.onerror = () => resolve([]);
  });
}

async function clearAll(){
  return new Promise((resolve) => {
    const tx1 = db.transaction("records","readwrite");
    tx1.objectStore("records").clear();
    const tx2 = db.transaction("meta","readwrite");
    tx2.objectStore("meta").clear();
    tx2.oncomplete = () => resolve();
  });
}

// =========================
// PERMISOS (simulados)
/// auxiliar/jefatura: edita
/// lectura: solo ve
/// direccion: ve todo, no edita (puedes cambiar esto si quieres)
// =========================
function canEdit(){
  const role = roleSelect.value;
  return role === "auxiliar" || role === "jefatura";
}
function canRespond(){
  return roleSelect.value === "jefatura";
}

// =========================
// UI Helpers
// =========================
function setStatus(msg, ok=true){
  saveStatus.textContent = msg;
  saveStatus.className = "status " + (ok ? "ok" : "bad");
}

function trafficTag(v){
  if(v === "rojo") return "tag red";
  if(v === "amarillo") return "tag yellow";
  return "tag green";
}

function statusTag(v){
  // abierto/cerrado
  return v === "concentracion" ? "tag gray" : "tag orange";
}

function sanitize(s){ return String(s||"").replace(/[<>]/g,""); }

function matchSearch(r, q){
  if(!q) return true;
  const hay = [
    r.folio, r.subject, r.areaFrom, r.areaTo, r.docType, r.ioType, r.traffic, r.year
  ].join(" ").toLowerCase();
  return hay.includes(q.toLowerCase());
}

// =========================
// RENDER
// =========================
async function render(){
  const all = await getAllRecords();
  const q = searchInput.value.trim();
  const filtered = all.filter(r => matchSearch(r, q));

  const tramite = filtered
    .filter(r => r.archive === "tramite")
    .sort((a,b) => (b.createdAt.localeCompare(a.createdAt)));

  const concentracion = filtered
    .filter(r => r.archive === "concentracion")
    .sort((a,b) => (b.closedAt||"").localeCompare(a.closedAt||""));

  tramiteList.innerHTML = tramite.length ? "" : `<div class="item"><div class="meta">No hay documentos en Trámite.</div></div>`;
  concentracionList.innerHTML = concentracion.length ? "" : `<div class="item"><div class="meta">No hay documentos en Concentración.</div></div>`;

  for(const r of tramite) tramiteList.appendChild(renderItem(r));
  for(const r of concentracion) concentracionList.appendChild(renderItem(r));

  renderAlerts(all);
}

function renderAlerts(all){
  const today = new Date();
  const q = getQuarter(today);
  const y = year(today);

  const tramiteCurrentQ = all.filter(r => r.archive === "tramite" && r.year === y && r.quarter === q).length;
  const tramiteOld = all.filter(r => r.archive === "tramite" && (r.year < y || (r.year === y && r.quarter < q))).length;

  const concThisYear = all.filter(r => r.archive === "concentracion" && r.year === y).length;

  const msgs = [];
  msgs.push(`<b>Trimestre actual:</b> Q${q} ${y}. Registros en Trámite (Q actual): <b>${tramiteCurrentQ}</b>.`);
  if(tramiteOld > 0){
    msgs.push(`⚠️ <b>Alerta trimestral:</b> Hay <b>${tramiteOld}</b> registros de Trámite de trimestres anteriores. Deben cerrarse (descarga y pase a Concentración).`);
  } else {
    msgs.push(`✅ Sin rezagos trimestrales en Trámite.`);
  }
  msgs.push(`<b>Concentración ${y}:</b> <b>${concThisYear}</b> registros cerrados (reporte anual disponible).`);

  alertsBox.innerHTML = msgs.map(m => `<div style="margin:6px 0;">${m}</div>`).join("");
}

function renderItem(r){
  const div = document.createElement("div");
  div.className = "item";

  const cad = r.cadido; // oculto para el usuario en UI, pero lo usamos para trazabilidad

  const hasFile = !!r.file && !!r.fileName;

  div.innerHTML = `
    <div class="meta">
      <div><b>${sanitize(r.folio)}</b> — ${sanitize(r.ioType.toUpperCase())} · ${sanitize(r.docTypeLabel)}</div>
      <small>${sanitize(fmtDateTime(r.createdAt))}${r.closedAt ? " · Cerrado: " + sanitize(fmtDateTime(r.closedAt)) : ""}</small>

      <div class="tags">
        <span class="tag ${statusTag(r.archive)}">${r.archive === "tramite" ? "TRÁMITE" : "CONCENTRACIÓN"}</span>
        <span class="tag ${trafficTag(r.traffic)}">${sanitize(r.traffic.toUpperCase())}</span>
        <span class="tag gray">Q${r.quarter} · ${r.year}</span>
        ${r.dueDate ? `<span class="tag gray">Límite: ${sanitize(r.dueDate)}</span>` : ``}
        ${hasFile ? `<span class="tag green">Archivo adjunto</span>` : `<span class="tag yellow">Sin adjunto</span>`}
      </div>

      <div style="margin-top:8px;">
        <div><b>De:</b> ${sanitize(r.areaFrom || "—")} · <b>Para:</b> ${sanitize(r.areaTo || "—")}</div>
        <div><b>Asunto:</b> ${sanitize(r.subject || "—")}</div>
      </div>

      <!-- CADIDO se mantiene oculto al usuario final -->
      <div style="display:none">
        ${sanitize(cad.serie)} | ${sanitize(cad.subserie)} | ${sanitize(cad.conservacion)} | ${sanitize(cad.valor)} | ${sanitize(cad.destino)}
      </div>
    </div>

    <div class="btns"></div>
  `;

  const btns = div.querySelector(".btns");

  const btnDownload = document.createElement("button");
  btnDownload.textContent = "⬇ Descargar";
  btnDownload.className = "secondary";
  btnDownload.disabled = !hasFile;
  btnDownload.onclick = () => downloadFile(r.id);

  const btnClose = document.createElement("button");
  btnClose.textContent = "✅ Cerrar (a Concentración)";
  btnClose.disabled = !canEdit() || r.archive !== "tramite";
  btnClose.onclick = async () => {
    await updateRecord(r.id, { archive:"concentracion", closedAt: nowISO() });
    await render();
  };

  const btnDelete = document.createElement("button");
  btnDelete.textContent = "🗑 Eliminar";
  btnDelete.className = "danger";
  btnDelete.disabled = !canEdit();
  btnDelete.onclick = async () => {
    const ok = confirm("¿Eliminar este registro? Esta acción no se puede deshacer.");
    if(!ok) return;
    await deleteRecord(r.id);
    await render();
  };

  // Botón de respuesta (solo jefatura) — MVP: descarga plantilla .txt con datos
  const btnResp = document.createElement("button");
  btnResp.textContent = "📝 Generar respuesta";
  btnResp.disabled = !canRespond();
  btnResp.onclick = () => generateResponse(r);

  btns.appendChild(btnDownload);
  btns.appendChild(btnClose);
  btns.appendChild(btnResp);
  btns.appendChild(btnDelete);

  return div;
}

// =========================
// ACCIONES
// =========================
async function saveRecord(){
  if(!canEdit()){
    setStatus("No tienes permisos para capturar (rol: Solo lectura).", false);
    return;
  }

  const subjectVal = subject.value.trim();
  const fromVal = areaFrom.value.trim();
  const toVal = areaTo.value.trim();

  if(!subjectVal || !fromVal || !toVal){
    setStatus("Faltan campos obligatorios: Área remitente, Área destinataria y Asunto.", false);
    return;
  }

  // contador para folio
  const counter = (await getMeta("folioCounter", 0)) + 1;
  await setMeta("folioCounter", counter);

  const createdAt = nowISO();
  const q = getQuarter(new Date());
  const y = year(new Date());

  const io = ioType.value;
  const dt = docType.value;

  const docTypeLabel = dt === "memorandum" ? "Memorándum" : dt === "oficio" ? "Oficio" : "Circular";
  const folio = makeFolio(counter, io);

  // CADIDO oculto
  const cadido = getCadido(dt);

  // archivo
  let fileData = null;
  let fileName = null;
  let fileType = null;

  if(fileInput.files && fileInput.files.length){
    const f = fileInput.files[0];
    fileName = f.name;
    fileType = f.type || "application/octet-stream";
    fileData = await readFileAsDataURL(f);
  }

  const record = {
    folio,
    ioType: io,
    docType: dt,
    docTypeLabel,
    areaFrom: fromVal,
    areaTo: toVal,
    subject: subjectVal,
    traffic: traffic.value,
    dueDate: dueDate.value || "",
    createdAt,
    quarter: q,
    year: y,
    userRole: roleSelect.value,
    archive: "tramite",
    status: "abierto",
    // CADIDO (oculto)
    cadido,
    // archivo
    file: fileData,
    fileName,
    fileType
  };

  await addRecord(record);
  setStatus(`Registro guardado: ${folio}`, true);
  resetForm();
  await render();
}

function resetForm(){
  ioType.value = "entrada";
  docType.value = "memorandum";
  areaFrom.value = "";
  areaTo.value = "";
  subject.value = "";
  traffic.value = "verde";
  dueDate.value = "";
  fileInput.value = "";
}

function readFileAsDataURL(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function downloadFile(id){
  const all = await getAllRecords();
  const r = all.find(x => x.id === id);
  if(!r || !r.file || !r.fileName) return;

  const a = document.createElement("a");
  a.href = r.file;
  a.download = r.fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function generateResponse(r){
  const text =
`DIF JALISCO
Dirección de Planeación Institucional

Respuesta / Acuse (MVP)
Folio: ${r.folio}
Tipo: ${r.ioType.toUpperCase()} — ${r.docTypeLabel}
De: ${r.areaFrom}
Para: ${r.areaTo}
Asunto: ${r.subject}
Fecha de registro: ${fmtDateTime(r.createdAt)}
Fecha límite: ${r.dueDate || "—"}

NOTA: Este documento es un borrador generado por el sistema.
`;

  const blob = new Blob([text], { type:"text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `respuesta_${r.folio}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function exportConcentracionCSV(){
  const all = await getAllRecords();
  const conc = all.filter(r => r.archive === "concentracion");

  if(!conc.length){
    alert("No hay registros en Concentración para exportar.");
    return;
  }

  const headers = [
    "folio","ioType","docTypeLabel","areaFrom","areaTo","subject","traffic","dueDate",
    "createdAt","closedAt","quarter","year","fileName"
  ];

  const rows = conc.map(r => headers.map(h => csvCell(r[h] || "")).join(","));
  const csv = headers.join(",") + "\n" + rows.join("\n");

  const blob = new Blob([csv], { type:"text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `concentracion_${year()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvCell(v){
  const s = String(v).replaceAll('"','""');
  return `"${s}"`;
}

// =========================
// EVENTOS
// =========================
saveBtn.addEventListener("click", saveRecord);
resetFormBtn.addEventListener("click", () => { resetForm(); setStatus("", true); saveStatus.className="status"; });
exportConcentracionBtn.addEventListener("click", exportConcentracionCSV);

clearAllBtn.addEventListener("click", async () => {
  const ok = confirm("Esto borrará TODOS los registros guardados en este navegador. ¿Continuar?");
  if(!ok) return;
  await clearAll();
  await render();
  setStatus("Base local reiniciada (solo pruebas).", true);
});

roleSelect.addEventListener("change", async () => {
  const editable = canEdit();
  saveBtn.disabled = !editable;
  resetFormBtn.disabled = !editable;
  await render();
});

searchInput.addEventListener("input", () => render());

// =========================
// INICIO
// =========================
(async function init(){
  await openDB();
  const editable = canEdit();
  saveBtn.disabled = !editable;
  resetFormBtn.disabled = !editable;
  await render();
})();
;


