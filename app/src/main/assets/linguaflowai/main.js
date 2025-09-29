// Importiere Three.js und die Globus-Initialisierung aus dem Modul
import * as THREE from './libs/three.module.js';
import { initGlobe } from './modules/globeModule.js';

// === Globus-Statusanzeige vorbereiten ===
const showStatus = true;
let statusDiv;

if (showStatus) {
  // Erzeuge ein Status-Div zur Anzeige des Ladefortschritts
  statusDiv = document.createElement('div');
  statusDiv.className = 'status-box';
  statusDiv.innerText = 'Globus Status: Lade Texturen...';
  document.body.appendChild(statusDiv);
}

// === Navigation zwischen Modulen (z. B. Globus, Vokabeln, Einstellungen) ===
const navButtons = document.querySelectorAll(".nav-btn");
const modules = document.querySelectorAll(".app-module");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");

    // Alle Module ausblenden
    modules.forEach(mod => mod.style.display = "none");

    // Zielmodul einblenden
    document.getElementById(target).style.display = "flex";

    // Navigation visuell aktualisieren
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Statusanzeige nur im Globus-Modul sichtbar
    if (target !== "globeModule" && statusDiv) {
      statusDiv.style.display = "none";
    } else if (statusDiv) {
      statusDiv.style.display = "block";
    }
  });
});

// === Initialisierung nach Laden der Seite ===
document.addEventListener("DOMContentLoaded", () => {
  // Referenz auf das Canvas und den Wrapper holen
  const canvas = document.getElementById("globeCanvas");
  const wrapper = document.querySelector('.globe-wrapper');

  // Globus initialisieren (Texturen laden, Szene aufbauen, Animation starten)
  initGlobe({
    canvas,
    wrapper,
    statusCallback: (msg) => {
      // Statusmeldung anzeigen, wenn aktiviert
      if (showStatus && statusDiv) {
        statusDiv.innerText += `\n${msg}`;
      }
    }
  });
});