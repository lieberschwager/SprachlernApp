import * as THREE from '../libs/three.module.js';
import { buildCountryMeshes } from './buildCountryMeshes.js';
import { drawBorders } from './borderBuilder.js';
import { setupInteractions } from './interactionHandler.js';
import { FlaggenManager } from './FlaggenManager.js';
import { getUserCoordinates } from '../libs/GeoLocations.js';
import { isNightTime } from '../libs/NightControls.js';

export async function initGlobe({ canvas, wrapper }) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);
  camera.position.set(0, 0, 3.5);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas || undefined,
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);

  function resizeRenderer() {
    const wrapper = canvas.parentElement;
    const width = wrapper.clientWidth;
    const height = Math.min(wrapper.clientHeight, width);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
  dirLight.position.set(4, 6, 3);
  scene.add(dirLight);

  const globePivot = new THREE.Group();
  scene.add(globePivot);

  const globeRadius = 1.8;
  const autoRotationControl = { enabled: true };

  console.log('Globus: starte Texturen-Load...');
  const loader = new THREE.TextureLoader();
  const textureURLs = {
    day: 'https://raw.githubusercontent.com/lieberschwager/SprachlernApp/main/app/src/main/assets/linguaflowai/textures/2k_earth_daymap.jpg',
    relief: 'https://raw.githubusercontent.com/lieberschwager/SprachlernApp/main/app/src/main/assets/linguaflowai/textures/2k_earth_relief_map.png',
    specular: 'https://raw.githubusercontent.com/lieberschwager/SprachlernApp/main/app/src/main/assets/linguaflowai/textures/2k_earth_specular_map.jpg',
    clouds: 'https://raw.githubusercontent.com/lieberschwager/SprachlernApp/main/app/src/main/assets/linguaflowai/textures/2k_earth_clouds.jpg',
    night: 'https://raw.githubusercontent.com/lieberschwager/SprachlernApp/main/app/src/main/assets/linguaflowai/textures/2k_earth_nightmap.jpg',
    flags: 'https://raw.githubusercontent.com/lieberschwager/SprachlernApp/main/app/src/main/assets/linguaflowai/textures/2k_earth_flaggen_map.png'
  };

  const textures = {};
  const loadPromises = Object.entries(textureURLs).map(([key, url]) => new Promise((resolve) => {
    loader.load(
      url,
      (tex) => { textures[key] = tex; console.log(`${key} geladen ✅`); resolve(); },
      undefined,
      () => { console.warn(`${key} Fehler ❌`); resolve(); }
    );
  }));

  await Promise.all(loadPromises);
  console.log('Globus: Texturen geladen');

  const globeMaterial = new THREE.MeshPhongMaterial({
    map: textures.day || null,
    bumpMap: textures.relief || null,
    bumpScale: 512,
    specularMap: textures.specular || null,
    shininess: 8,
    specular: new THREE.Color(0x333333)
  });

  const globeGeometry = new THREE.SphereGeometry(globeRadius, 128, 128);
  const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
  globeMesh.rotation.y = Math.PI;
  globePivot.add(globeMesh);

  const cloudMaterial = new THREE.MeshPhongMaterial({
    map: textures.clouds || null,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(globeRadius + 0.002, 128, 128), cloudMaterial);
  cloudMesh.rotation.y = Math.PI;
  globePivot.add(cloudMesh);

  getUserCoordinates((lat, lon) => {
    if (lat == null || lon == null) return;
    if (isNightTime(lat, lon) && textures.night) {
      const nightMat = new THREE.MeshPhongMaterial({
        map: textures.night,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const nightMesh = new THREE.Mesh(new THREE.SphereGeometry(globeRadius + 0.001, 128, 128), nightMat);
      nightMesh.rotation.y = Math.PI;
      globePivot.add(nightMesh);
      console.log('Nachtkarte aktiviert');
    }
    const flagMapMaterial = new THREE.MeshPhongMaterial({
  map: textures.flags,
  transparent: true,
  opacity: 1,
  depthWrite: false,
  side: THREE.DoubleSide
});

const flagMapMesh = new THREE.Mesh(
  new THREE.SphereGeometry(globeRadius + 0.001, 128, 128),
  flagMapMaterial
);

flagMapMesh.name = 'flagMapLayer';
flagMapMesh.rotation.set(
  THREE.MathUtils.degToRad(2.1), // vertikal korrigiert
  Math.PI + 0.188,               // horizontal korrigiert
  0
);
globePivot.add(flagMapMesh);
  });

  console.log('Lade Länder (buildCountryMeshes) ...');
  let countryMeshes = {};
  try {
    countryMeshes = await buildCountryMeshes({ globePivot, globeRadius });
    console.log(`Länderflächen: ${Object.keys(countryMeshes).length} geladen`);
  } catch (err) {
    console.warn('buildCountryMeshes-Fehler', err);
  }

  try {
    const res = await fetch('./libs/countries.geojson');
    if (res.ok) {
      const geojson = await res.json();
      drawBorders({ geojson, globePivot, globeRadius });
      console.log('Ländergrenzen gezeichnet');
    } else {
      console.warn('Borders: GeoJSON nicht gefunden (skip)');
    }
  } catch (err) {
    console.warn('Borders-Fetch-Fehler', err);
  }

  let flaggenManager = null;
  try {
    flaggenManager = new FlaggenManager({ globePivot, countryMeshes });
    if (typeof flaggenManager.flagPath !== 'undefined') flaggenManager.flagPath = './flags/';
  } catch (err) {
    try {
      flaggenManager = new FlaggenManager(scene, countryMeshes);
      flaggenManager.flagPath = './flags/';
    } catch (err2) {
      console.warn('FlaggenManager konnte nicht instanziiert werden:', err, err2);
    }
  }

  console.log('Interaktionen initialisieren...');
  const interactionHandler = setupInteractions({
    canvas,
    camera,
    renderer,
    globePivot,
    countryMeshes,
    autoRotationControl
  });

  if (interactionHandler) {
    interactionHandler.onHoverEnter = (mesh) => {
      console.log(`Hover: ${mesh?.userData?.iso2 || mesh?.userData?.name || '—'}`);
      if (flaggenManager?.showFlag) {
        try { flaggenManager.showFlag(mesh); } catch (e) { console.warn('flaggenManager.showFlag error', e); }
      }
    };
    interactionHandler.onHoverLeave = (mesh) => {
      console.log('Hover end');
      if (flaggenManager?.hideFlag) {
        try { flaggenManager.hideFlag(mesh); } catch (e) { console.warn('flaggenManager.hideFlag error', e); }
      }
    };
    interactionHandler.onClick = (mesh) => {
      console.log(`Klick auf: ${mesh?.userData?.iso2 || mesh?.userData?.name || '—'}`);
      if (flaggenManager?.selectFlag) {
        try { flaggenManager.selectFlag(mesh); } catch (e) { console.warn('flaggenManager.selectFlag error', e); }
      }
    };
  } else {
    console.warn('⚠️ Interaktions-Handler nicht initialisiert');
  }

  window.addEventListener('resize', resizeRenderer, { passive: true });
  resizeRenderer();

  function animate() {
    requestAnimationFrame(animate);
    if (autoRotationControl.enabled) globePivot.rotation.y += 0.001;
    renderer.render(scene, camera);
  }
  animate();

  console.log('✅ Globus vollständig geladen');
  return {
    scene,
    camera,
    renderer,
    pivot: globePivot,
    globeRadius,
    countryMeshes,
    flaggenManager,
    interactionHandler,
    autoRotationControl
  };
}