import * as THREE from '/libs/three.module.js';
import { OrbitControls } from '/libs/OrbitControls.js';

// ==================== WebGL Check ====================
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!window.WebGLRenderingContext && !!canvas.getContext('webgl');
  } catch (e) {
    return false;
  }
}

if (!isWebGLAvailable()) {
  alert("❌ WebGL wird nicht unterstützt – der Globus kann nicht angezeigt werden.");
  throw new Error("WebGL nicht verfügbar");
}

// ==================== Globus Setup ====================
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("globeCanvas");
  if (!canvas) {
    console.error("Canvas mit ID 'globeCanvas' nicht gefunden.");
    return;
  }

  console.log("✅ Canvas gefunden – Größe:", canvas.clientWidth, canvas.clientHeight);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 6); // etwas weiter weg für mobile Darstellung

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.rotateSpeed = 0.5;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 6;
  controls.maxDistance = 6;

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
  directionalLight.position.set(2, 2, 5);
  scene.add(directionalLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const textureLoader = new THREE.TextureLoader();
  const basePath = 'file:///android_asset/linguaflowai/';

  const colorMap     = textureLoader.load(basePath + 'earth_atmos_2048.jpg');
  const specularMap  = textureLoader.load(basePath + 'earth_specular_2048.jpg');
  const normalMap    = textureLoader.load(basePath + 'earth_normal_2048.jpg');
  const cloudMap     = textureLoader.load(basePath + 'earth_clouds_2048.jpg');

  setTimeout(() => {
    console.log("🧪 Texturstatus:");
    console.log("colorMap:", colorMap?.image);
    console.log("specularMap:", specularMap?.image);
    console.log("normalMap:", normalMap?.image);
    console.log("cloudMap:", cloudMap?.image);
  }, 1000);

  const globeMaterial = new THREE.MeshPhongMaterial({
    map: colorMap,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(1.5, 1.5),
    specularMap: specularMap,
    specular: new THREE.Color(0x666666),
    shininess: 40,
  });

  const globeGeometry = new THREE.SphereGeometry(1.8, 64, 64);
  const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
  globeMesh.rotation.y = Math.PI;

  const cloudMaterial = new THREE.MeshPhongMaterial({
    map: cloudMap,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const cloudGeometry = new THREE.SphereGeometry(1.83, 64, 64);
  const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
  cloudMesh.rotation.y = Math.PI;

  const globeGroup = new THREE.Group();
  globeGroup.add(globeMesh);
  globeGroup.add(cloudMesh);
  scene.add(globeGroup);

  function resizeRenderer() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height, true);
    renderer.setPixelRatio(window.devicePixelRatio);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resizeRenderer);
  resizeRenderer();

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
});