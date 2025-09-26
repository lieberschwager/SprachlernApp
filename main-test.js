import * as THREE from './libs/three.module.js';

// Globus Status
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
statusDiv.innerText = 'Globus Status: Lade Textur...';
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

  scene.add(new THREE.AmbientLight(0xffffff, 1.81));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(6,6,6);
  scene.add(dirLight);

  const loader = new THREE.TextureLoader();
  loader.load(
    'https://raw.githubusercontent.com/lieberschwager/SprachlernApp/main/app/src/main/assets/linguaflowai/earth_atmos_2048.jpg',
    (texture) => {
      const globeMaterial = new THREE.MeshPhongMaterial({ map: texture, shininess: 6 });
      const globeGeometry = new THREE.SphereGeometry(1.8, 64, 64);
      const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
      globeMesh.rotation.y = Math.PI;
      scene.add(globeMesh);
      statusDiv.innerText = 'Globus Status: Textur geladen ✅';

      function animate() {
        requestAnimationFrame(animate);
        globeMesh.rotation.y += 0.0015;
        renderer.render(scene, camera);
      }
      animate();
    },
    undefined,
    (err) => {
      console.error(err);
      statusDiv.innerText = 'Globus Status: Fehler ❌';
    }
  );

  function resizeRenderer() {
    const maxHeight = wrapper.parentElement.clientHeight;
    renderer.setSize(wrapper.clientWidth, maxHeight, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resizeRenderer);
  resizeRenderer();
});