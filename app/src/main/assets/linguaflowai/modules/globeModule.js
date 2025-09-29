import * as THREE from '../libs/three.module.js';
import { getUserCoordinates } from '../libs/GeoLocations.js';
import { isNightTime } from '../libs/NightControls.js';

export function initGlobe({ canvas, wrapper, statusCallback }) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);
  camera.position.set(0, 0, 3.5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
  dirLight.position.set(4, 6, 3);
  scene.add(dirLight);

  const loader = new THREE.TextureLoader();
  const urls = {
    day: 'https://raw.githubusercontent.com/lieberschwager/SprachlernApp/main/app/src/main/assets/linguaflowai/textures/2k_earth_daymap.jpg',
    relief: 'https://raw.githubusercontent.com/lieberschwager/SprachlernApp/main/app/src/main/assets/linguaflowai/textures/2k_earth_relief_map.png',
    specular: 'https://raw.githubusercontent.com/lieberschwager/SprachlernApp/main/app/src/main/assets/linguaflowai/textures/2k_earth_specular_map.jpg',
    clouds: 'https://raw.githubusercontent.com/lieberschwager/SprachlernApp/main/app/src/main/assets/linguaflowai/textures/2k_earth_clouds.jpg',
    night: 'https://raw.githubusercontent.com/lieberschwager/SprachlernApp/main/app/src/main/assets/linguaflowai/textures/2k_earth_nightmap.jpg'
  };

  const textures = {};
  let loadedCount = 0;
  const totalToLoad = Object.keys(urls).length;

  const statusDiv = document.createElement('div');
  statusDiv.className = 'status-box';
  statusDiv.innerText = 'Globus Status: Lade Texturen...';
  document.body.appendChild(statusDiv);

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
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: textures.day,
      bumpMap: textures.relief,
      bumpScale: 1024,
      specularMap: textures.specular,
      shininess: 8,
      specular: new THREE.Color(0x333333)
    });

    const globeGeometry = new THREE.SphereGeometry(1.8, 512, 512);
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeMesh.rotation.y = Math.PI;
    scene.add(globeMesh);

    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: textures.clouds,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    const cloudGeometry = new THREE.SphereGeometry(1.802, 512, 512);
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudMesh.rotation.y = Math.PI;
    scene.add(cloudMesh);

    let nightMesh = null;

    getUserCoordinates((lat, lon) => {
      if (lat === null || lon === null) return;

      if (isNightTime(lat, lon)) {
        const nightMaterial = new THREE.MeshPhongMaterial({
          map: textures.night,
          bumpMap: textures.relief,
          bumpScale: 1024,
          transparent: true,
          opacity: 0.75,
          depthWrite: false,
          side: THREE.DoubleSide
        });

        const nightGeometry = new THREE.SphereGeometry(1.801, 512, 512);
        nightMesh = new THREE.Mesh(nightGeometry, nightMaterial);
        nightMesh.rotation.y = Math.PI;
        scene.add(nightMesh);
      }
    });

    statusDiv.innerText += `\nGlobus vollständig geladen ✅`;

    function animate() {
      requestAnimationFrame(animate);
      globeMesh.rotation.y += 0.0015;
      cloudMesh.rotation.y += 0.0017;
      if (nightMesh) nightMesh.rotation.y += 0.0015;
      renderer.render(scene, camera);
    }
    animate();

    function resizeRenderer() {
      const width = wrapper?.clientWidth || window.innerWidth;
      const height = wrapper?.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    window.addEventListener("resize", resizeRenderer);
    resizeRenderer();
  }
}