import * as THREE from './libs/three.module.js';

// Globus Statusanzeige
const statusDiv = document.createElement('div');
statusDiv.style.position = 'absolute';
statusDiv.style.top = '10px';
statusDiv.style.left = '50%';
statusDiv.style.transform = 'translateX(-50%)';
statusDiv.style.padding = '5px 10px';
statusDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
statusDiv.style.color = '#fff';
statusDiv.style.fontFamily = 'sans-serif';
statusDiv.style.fontSize = '14px';
statusDiv.style.borderRadius = '5px';
statusDiv.innerText = 'Globus Status: Lade Texturen...';
document.body.appendChild(statusDiv);

// Navigation
const navButtons = document.querySelectorAll(".nav-btn");
const modules = document.querySelectorAll(".app-module");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");
    modules.forEach(mod => mod.classList.remove("active"));
    document.getElementById(target)?.classList.add("active");
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Globus
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("globeCanvas");
  const wrapper = document.querySelector('.globe-wrapper');
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);
  camera.position.set(0, 0, 3.5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2.4);
  dirLight.position.set(4, 6, 3);
  scene.add(dirLight);

  const loader = new THREE.TextureLoader();

  const urls = {
    atmos: 'https://raw.githubusercontent.com/lieberschwager/SprachlernApp/main/app/src/main/assets/linguaflowai/earth_atmos_2048.jpg',
    normal: 'https://raw.githubusercontent.com/lieberschwager/SprachlernApp/main/app/src/main/assets/linguaflowai/earth_normal_2048.jpg',
    specular: 'https://raw.githubusercontent.com/lieberschwager/SprachlernApp/main/app/src/main/assets/linguaflowai/earth_specular_2048.jpg',
    clouds: 'https://raw.githubusercontent.com/lieberschwager/SprachlernApp/main/app/src/main/assets/linguaflowai/earth_clouds_2048.jpg'
  };

  const textures = {};
  let loadedCount = 0;
  const totalToLoad = Object.keys(urls).length;

  Object.entries(urls).forEach(([key, url]) => {
    loader.load(
      url,
      (tex) => {
        textures[key] = tex;
        loadedCount++;
        statusDiv.innerText += `\n${key} geladen ✅`;
        if (loadedCount === totalToLoad) buildGlobe();
      },
      undefined,
      () => {
        statusDiv.innerText += `\n${key} Fehler ❌`;
      }
    );
  });

  function buildGlobe() {
    const globeMaterial = new THREE.MeshStandardMaterial({
      map: textures.atmos,
      normalMap: textures.normal,
      normalScale: new THREE.Vector2(2.5, 2.5),
      metalnessMap: textures.specular,
      metalness: 1.2,
      roughness: 2,4
    });

    const globeGeometry = new THREE.SphereGeometry(1.8, 64, 64);
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeMesh.rotation.y = Math.PI;
    scene.add(globeMesh);

    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: textures.clouds,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    const cloudGeometry = new THREE.SphereGeometry(1.81, 64, 64);
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudMesh.rotation.y = Math.PI;
    scene.add(cloudMesh);

    statusDiv.innerText += `\nGlobus vollständig geladen ✅`;

    function animate() {
      requestAnimationFrame(animate);
      globeMesh.rotation.y += 0.0015;
      cloudMesh.rotation.y += 0.0016;
      renderer.render(scene, camera);
    }
    animate();
  }

  function resizeRenderer() {
    const maxHeight = wrapper?.parentElement?.clientHeight || window.innerHeight;
    renderer.setSize(wrapper?.clientWidth || window.innerWidth, maxHeight, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resizeRenderer);
  resizeRenderer();
});