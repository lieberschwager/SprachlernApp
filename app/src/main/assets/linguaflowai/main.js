import * as THREE from './libs/three.module.js';

// ==================== Navigation ====================
const navButtons = document.querySelectorAll(".nav-btn");
const modules = document.querySelectorAll(".app-module");

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");

    modules.forEach((mod) => {
      mod.classList.add("hidden");
      mod.classList.remove("active");
    });

    document.getElementById(target).classList.remove("hidden");
    document.getElementById(target).classList.add("active");

    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// ==================== Globus Setup ====================
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("globeCanvas");
  if (!canvas) {
    console.error("Canvas mit ID 'globeCanvas' nicht gefunden.");
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
  directionalLight.position.set(0, 0, 5);
  scene.add(directionalLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const textureLoader = new THREE.TextureLoader();
  const colorMap = textureLoader.load("assets/earth_atmos_2048.jpg");
  const specularMap = textureLoader.load("assets/earth_specular_2048.jpg");
  const normalMap = textureLoader.load("assets/earth_normal_2048.jpg");
  const cloudMap = textureLoader.load("assets/earth_clouds_2048.png");

  const globeMaterial = new THREE.MeshPhongMaterial({
    map: colorMap,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(1.5, 1.5), // kräftigerer Relief-Effekt
    specularMap: specularMap,
    specular: new THREE.Color(0x222222), // dezenter Glanz
    shininess: 8, // weichere Lichtreflexe
  });

  const globeGeometry = new THREE.SphereGeometry(1.8, 64, 64);
  const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
  globeMesh.rotation.y = Math.PI;

  const cloudMaterial = new THREE.MeshPhongMaterial({
    map: cloudMap,
    transparent: true,
    opacity: 0.6,
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
    globeMesh.rotation.y += 0.001;
    cloudMesh.rotation.y += 0.0015;
    renderer.render(scene, camera);
  }

  animate();
});

// ==================== Vokabeltrainer ====================
const wordCard = document.querySelector(".word-card");
if (wordCard) {
  wordCard.addEventListener("click", () => {
    wordCard.classList.toggle("flipped");
  });
}

const nextWordBtn = document.getElementById("btn-next-word");
if (nextWordBtn) {
  nextWordBtn.addEventListener("click", () => {
    alert("Nächstes Wort kommt später 🚀");
  });
}

// ==================== Sprach-Explorer ====================
const exploreBtn = document.getElementById("btn-explore-language");
if (exploreBtn) {
  exploreBtn.addEventListener("click", () => {
    alert("Sprachen-Explorer in Arbeit 🌍");
  });
}