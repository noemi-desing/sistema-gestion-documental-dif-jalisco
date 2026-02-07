// ======================================================
// Sistema de Gestión y Sistematización Documental
// DIF Jalisco – Dirección de Planeación Institucional
// Archivo: app.js
// Cumplimiento: Ley de Archivos / CONARCH / CGCA / CADIDO
// ======================================================

// ------------------------------------------------------
// Configuración institucional fija (NO editable)
// ------------------------------------------------------
const INSTITUCION = {
  fondo: "Sistema DIF Jalisco",
  seccion: "Dirección de Planeación Institucional",
  areaResponsable: "Departamento de Seguimiento y Evaluación"
};

// ------------------------------------------------------
// Reglas CADIDO (instrumento de control archivístico)
// SOLO ADMINISTRABLE A NIVEL SISTEMA
// ------------------------------------------------------
const CADIDO = {
  "PLN-01": {
    serie: "Planeación Institucional",
    subserie: "Programas y Proyectos",
    valorDocumental: "Administrativo",
    vigenciaTramite: 3,
    vigenciaConcentracion: 2,
    destinoFinal: "Conservación"
  },
  "PLN-02": {
    serie: "Evaluación Institucional",
    subserie: "Informes y Seguimiento",
    valorDocumental: "Administrativo",
    vigenciaTramite: 5,
    vigenciaConcentracion: 2,
    destinoFinal: "Conservación"
  }
};

// ------------------------------------------------------
// Validación normativa mínima (obligatoria)
// ------------------------------------------------------
function validarDatos(datos) {
  const camposObligatorios = [
    "codigoCADIDO",
    "tipoDocumental",
    "numeroDocumento",
    "fechaDocumento",
    "areaProductora",
    "areaDestinataria",
    "asunto",
    "soporte"
  ];

  for (let campo of camposObligatorios) {
    if (!datos[campo]) {
      throw new Error(`Campo obligatorio faltante: ${campo}`);
    }
  }

  if (!CADIDO[datos.codigoCADIDO]) {
    throw new Error("Código CADIDO no reconocido por el sistema.");
  }
}

// ------------------------------------------------------
// Creación de registro archivístico (NO editable)
// ------------------------------------------------------
function crearRegistroArchivistico(datos) {
  validarDatos(datos);

  const regla = CADIDO[datos.codigoCADIDO];

  return {
    // Identificación
    idRegistro: Date.now(),
    codigoCADIDO: datos.codigoCADIDO,

    // Clasificación archivística
    fondo: INSTITUCION.fondo,
    seccion: INSTITUCION.seccion,
    serie: regla.serie,
    subserie: regla.subserie,

    // Datos documentales
    tipoDocumental: datos.tipoDocumental,
    numeroDocumento: datos.numeroDocumento,
    fechaDocumento: datos.fechaDocumento,
    fechaRegistro: new Date().toISOString().split("T")[0],

    // Contexto institucional
    areaProductora: datos.areaProductora,
    areaDestinataria: datos.areaDestinataria,
    asunto: datos.asunto,
    funcionSustantiva: datos.funcionSustantiva || "",

    // Valoración documental (CADIDO)
    valorDocumental: regla.valorDocumental,
    vigenciaTramite: regla.vigenciaTramite,
    vigenciaConcentracion: regla.vigenciaConcentracion,
    destinoFinal: regla.destinoFinal,

    // Control
    soporte: datos.soporte,
    integraExpediente: Boolean(datos.expediente),
    observaciones: datos.observaciones || "",

    // Estado archivístico
    estado: "Trámite"
  };
}

// ------------------------------------------------------
// Almacenamiento histórico (registro diario e histórico)
// ------------------------------------------------------
function obtenerRegistros() {
  return JSON.parse(localStorage.getItem("archivoInstitucional")) || [];
}

function guardarRegistro(registro) {
  const registros = obtenerRegistros();
  registros.push(registro);
  localStorage.setItem("archivoInstitucional", JSON.stringify(registros));
}

// ------------------------------------------------------
// Función oficial de registro documental
// ------------------------------------------------------
function registrarDocumento(datos) {
  try {
    const registro = crearRegistroArchivistico(datos);
    guardarRegistro(registro);
    console.info("Registro archivístico generado conforme a normativa:", registro);
    return true;
  } catch (error) {
    console.error("Error normativo en el registro:", error.message);
    return false;
  }
}

// ------------------------------------------------------
// Consulta histórica (solo lectura)
// ------------------------------------------------------
function consultarRegistros() {
  return obtenerRegistros();
}

// ------------------------------------------------------
// Navegación institucional (sin impacto archivístico)
// ------------------------------------------------------
function openOverview() {
  console.info("Vista general cargada.");
}

function openArchive() {
  console.info("Módulo de registro documental activo.");
}

function openCADIDO() {
  console.info("Instrumentos de control archivístico aplicados automáticamente.");
}

// ------------------------------------------------------
// Inicialización del sistema
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  console.log("Sistema de Gestión Documental inicializado conforme a normativa archivística.");
});

