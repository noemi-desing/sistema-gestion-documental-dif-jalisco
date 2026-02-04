// ============================================
// Sistema de Gestión Documental DIF Jalisco
// Archivo: app.js
// ============================================

// Mensaje base institucional
function showInfo(message) {
  alert(message);
}

// Funciones de navegación / demostración
function openOverview() {
  showInfo("System overview loaded.");
}

function openFunctions() {
  showInfo("Core system functions loaded.");
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

// Mensaje de carga inicial
document.addEventListener("DOMContentLoaded", function () {
  console.log("Document Management System DIF Jalisco loaded successfully.");
});
