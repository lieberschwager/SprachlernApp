import * as THREE from './libs/three.module.js';
import { initGlobe } from './modules/globeModule.js';
import i18n from './libs/i18n.js';

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = i18n.t(key);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await i18n.init();
  applyTranslations();

  const canvas = document.getElementById('globeCanvas');
  const wrapper = document.querySelector('.globe-wrapper');

  try {
    const globe = await initGlobe({ canvas, wrapper });
    window.globe = globe;
    document.getElementById('globeModule').style.display = 'flex';
    console.log('[MAIN] Globe gestartet');
  } catch (err) {
    console.error('[MAIN] Fehler beim Start:', err);
  }
});