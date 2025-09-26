import * as THREE from './three.module.js';

class OrbitControls {
  constructor(object, domElement) {
    this.object = object;
    this.domElement = domElement;

    this.enabled = true;
    this.enableZoom = true;
    this.enableRotate = true;
    this.enablePan = false;
    this.enableDamping = true;
    this.dampingFactor = 0.05;
    this.zoomSpeed = 1.0;
    this.rotateSpeed = 1.0;

    this.spherical = new THREE.Spherical();
    this.target = new THREE.Vector3();
    this.offset = new THREE.Vector3();

    this.state = 'none';
    this.pointerStart = new THREE.Vector2();
    this.pointerEnd = new THREE.Vector2();
    this.delta = new THREE.Vector2();

    this.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
    this.domElement.addEventListener('pointermove', this.onPointerMove.bind(this));
    this.domElement.addEventListener('pointerup', this.onPointerUp.bind(this));
    this.domElement.addEventListener('wheel', this.onMouseWheel.bind(this), { passive: false });

    this.update();
  }

  onPointerDown(event) {
    if (!this.enabled) return;
    this.state = 'rotate';
    this.pointerStart.set(event.clientX, event.clientY);
  }

  onPointerMove(event) {
    if (!this.enabled || this.state !== 'rotate') return;
    this.pointerEnd.set(event.clientX, event.clientY);
    this.delta.subVectors(this.pointerEnd, this.pointerStart).multiplyScalar(this.rotateSpeed / 100);
    this.pointerStart.copy(this.pointerEnd);

    const element = this.domElement;
    const rotation = new THREE.Vector2(
      (2 * Math.PI * this.delta.x) / element.clientHeight,
      (2 * Math.PI * this.delta.y) / element.clientHeight
    );

    this.rotateLeft(rotation.x);
    this.rotateUp(rotation.y);
    this.update();
  }

  onPointerUp() {
    this.state = 'none';
  }

  onMouseWheel(event) {
    if (!this.enabled || !this.enableZoom) return;
    event.preventDefault();
    const delta = event.deltaY > 0 ? 1.1 : 0.9;
    this.zoom(delta);
    this.update();
  }

  rotateLeft(angle) {
    this.spherical.theta -= angle;
  }

  rotateUp(angle) {
    this.spherical.phi -= angle;
    this.spherical.phi = Math.max(0.01, Math.min(Math.PI - 0.01, this.spherical.phi));
  }

  zoom(scale) {
    this.spherical.radius *= scale;
    this.spherical.radius = Math.max(0.5, Math.min(10, this.spherical.radius));
  }

  update() {
    this.offset.setFromSpherical(this.spherical);
    this.object.position.copy(this.target).add(this.offset);
    this.object.lookAt(this.target);
  }
}

export { OrbitControls };