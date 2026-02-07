// ======================================================
// Sistema de Gestión y Sistematización Documental
// Sistema DIF Jalisco
// Archivo: app.js
// Versión: Funcional institucional (CADIDO + Registro)
// ======================================================

// ------------------------------------------------------
// Configuración institucional
// ------------------------------------------------------
const CONFIG_INSTITUCIONAL = {
  fondo: "Sistema DIF Jalisco",
  seccion: "Dirección de Planeación Institucional",
  areaResponsable: "Departamento de Seguimiento y Evaluación"
};

// ------------------------------------------------------
// Reglas CADIDO (ejemplo base, ampliable)
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
// Modelo institucional de registro documental
// ------------------------------------------------------
function crearRegistroDocumental(datos) {
  const regla = CADIDO[datos.codigoCADIDO];

  if (!regla) {
    throw new Error("Código CADIDO no válido.");
  }

  return {
    idRegistro: Date.now(),
    codigoCADIDO: datos.codigoCADIDO,
    fondo: CONFIG_INSTITUCIONAL.fondo,
    seccion: CONFIG_INSTITUCIONAL.seccion,
    serie: regla.serie,
    subserie: regla.subserie,
    tipoDocumental: datos.tipoDocumental,
    numeroDocumento: datos.numeroDocumento,
    fechaDocumento: datos.fechaDocumento,
    fechaRegistro: new Date().toISOString().split("T")[0],
    areaProductora: datos.areaProductora,
    areaDestinataria: datos.areaDestinataria,
    asunto: datos.asunto,
    funcionSustantiva: datos.funcionSustantiva,
    valorDocumental: regla.valorDocumental,
    vigenciaTramite: regla.vigenciaTramite,
    vigenciaConcentracion: regla.vigenciaConcentracion,
    destinoFinal: regla.destinoFinal,
    soporte: datos.soporte,
    expediente: datos.expediente || false,
    observaciones: datos.observaciones || ""
  };
}

// ------------------------------------------------------
// Almacenamiento institucional (localStorage)
// ------------------------------------------------------
function obtenerRegistros() {
  return JSON.parse(localStorage.getItem("registrosDocumentales")) || [];
}

function guardarRegistro(registro) {
  const registros = obtenerRegistros();
  registros.push(registro);
  localStorage.setItem("registrosDocumentales", JSON.stringify(registros));
}

function eliminarRegistros() {
  localStorage.removeItem("registrosDocumentales");
}

// ------------------------------------------------------
// Funciones institucionales del sistema
// ------------------------------------------------------
function registrarDocumento(datos) {
  try {
    const registro = crearRegistroDocumental(datos);
    guardarRegistro(registro);
    console.log("Registro documental guardado:", registro);
  } catch (error) {
    console.error("Error en el registro:", error.message);
  }
}

function consultarRegistros() {
  return obtenerRegistros();
}

// ------------------------------------------------------
// Navegación institucional (base)
// ------------------------------------------------------
function openOverview() {
  console.info("Vista general del sistema cargada.");
}

function openFunctions() {
  console.info("Funciones del sistema cargadas.");
}

function openArchive() {
  console.info("Módulo de archivo cargado.");
}

function openCADIDO() {
  console.info("Reglas CADIDO activas y aplicadas automáticamente.");
}

function openPermissions() {
  console.info("Permisos institucionales cargados.");
}

// ------------------------------------------------------
// Resaltado de sección activa en navegación
// ------------------------------------------------------
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".navigation a");

  let currentSection = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 140;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
});

// ------------------------------------------------------
// Inicialización del sistema
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  console.log("Sistema de Gestión Documental DIF Jalisco inicializado correctamente.");
});


// --------------------------------------------
// Confirmación de carga del sistema
// --------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  console.log("Document Management System DIF Jalisco loaded successfully.");
});

