// ============================================
// Sistema de Gestión Documental DIF Jalisco
// Archivo: app.js
// ============================================

// --------------------------------------------
// Utilidad institucional (opcional)
// --------------------------------------------
function showInfo(message) {
  alert(message);
}

// --------------------------------------------
// Funciones base (no obligatorias, no rompen)
// --------------------------------------------
function openOverview() {
  showInfo("System overview loaded.");
}

function openFunctions() {
  showInfo("System functions loaded.");
}

function openArchive() {
  showInfo("Document archive module loaded.");
}

function openCADIDO() {
  showInfo("CADIDO rules are applied automatically.");
}

function openPermissions() {
  showInfo("User permissions loaded.");
}

// --------------------------------------------
// Resaltar sección activa en el menú al hacer scroll
// --------------------------------------------
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

// --------------------------------------------
// Confirmación de carga del sistema
// --------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  console.log("Document Management System DIF Jalisco loaded successfully.");
});

