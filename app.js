/**
 * Sistema de Gestión Documental y Correspondencia
 * Dirección de Planeación Institucional – DIF Jalisco
 *
 * app.js
 * Lógica base para navegación, control visual y evidencia operativa
 * Versión inicial – Proyecto en documentación
 */

// ===============================
// Configuración general del sistema
// ===============================
const sistema = {
  nombre: "Sistema de Gestión Documental y Correspondencia",
  institucion: "DIF Jalisco",
  area: "Dirección de Planeación Institucional",
  version: "1.0",
  estado: "En documentación",
  inicioProyecto: "2026-02-07"
};

console.info("Inicializando:", sistema.nombre);
console.info("Área responsable:", sistema.area);
console.info("Estado del proyecto:", sistema.estado);

// ===============================
// Utilidades
// ===============================

/**
 * Obtiene la fecha actual en formato legible
 */
function fechaActual() {
  const fecha = new Date();
  return fecha.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

/**
 * Registra eventos como evidencia de uso
 */
function registrarEvento(evento) {
  const registro = {
    evento,
    fecha: new Date().toISOString()
  };
  console.log("Evento registrado:", registro);
}

// ===============================
// Navegación por secciones
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  registrarEvento("Carga inicial del sistema");

  // Resalta sección activa al hacer scroll
  const secciones = document.querySelectorAll("section");
  const enlaces = document.querySelectorAll("nav a");

  window.addEventListener("scroll", () => {
    let seccionActual = "";

    secciones.forEach(seccion => {
      const top = window.scrollY;
      const offset = seccion.offsetTop - 120;
      const height = seccion.offsetHeight;

      if (top >= offset && top < offset + height) {
        seccionActual = seccion.getAttribute("id");
      }
    });

    enlaces.forEach(enlace => {
      enlace.classList.remove("activo");
      if (enlace.getAttribute("href") === `#${seccionActual}`) {
        enlace.classList.add("activo");
      }
    });
  });

  // Inserta fecha automática en el footer si existe
  const footer = document.querySelector("footer");
  if (footer) {
    const p = document.createElement("p");
    p.textContent = `Última actualización del documento: ${fechaActual()}`;
    footer.appendChild(p);
  }
});

// ===============================
// Evidencia de control documental
// ===============================

/**
 * Simula una alerta documental (archivo, plazos, etc.)
 * Esto sirve como base para futuras integraciones
 */
function alertaDocumental(tipo) {
  const mensajes = {
    tramite: "Alerta trimestral: cierre de Archivo de Trámite",
    concentracion: "Alerta anual: control de Archivo de Concentración",
    general: "Alerta del sistema de gestión documental"
  };

  const mensaje = mensajes[tipo] || mensajes.general;
  registrarEvento(mensaje);
  alert(mensaje);
}

// ===============================
// Exposición mínima (controlada)
// ===============================

window.sistemaDocumental = {
  sistema,
  registrarEvento,
  alertaDocumental
};


