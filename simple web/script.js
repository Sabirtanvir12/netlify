import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('scene');

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x050816, 7, 18);

const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(0, 0, 7);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x8b5cf6, 2.4, 20);
pointLight.position.set(3, 2, 5);
scene.add(pointLight);

const pointLightTwo = new THREE.PointLight(0x67e8f9, 2.8, 20);
pointLightTwo.position.set(-4, -2, 4);
scene.add(pointLightTwo);

const root = new THREE.Group();
scene.add(root);

const coreMaterial = new THREE.MeshStandardMaterial({
  color: 0x9d7af7,
  emissive: 0x2b0a7a,
  roughness: 0.35,
  metalness: 0.8,
});

const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 1), coreMaterial);
root.add(core);

const ring = new THREE.Mesh(
  new THREE.TorusKnotGeometry(2.2, 0.5, 140, 20),
  new THREE.MeshStandardMaterial({
    color: 0x67e8f9,
    emissive: 0x0c1d2d,
    roughness: 0.28,
    metalness: 0.8,
  }),
);
ring.rotation.x = 1.2;
ring.rotation.y = 0.7;
root.add(ring);

const particleCount = 800;
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i += 1) {
  const radius = 4.5 + Math.random() * 4.5;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);

  positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
  positions[i * 3 + 1] = radius * Math.cos(phi);
  positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
}

const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particles = new THREE.Points(
  particleGeometry,
  new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.04,
    transparent: true,
    opacity: 0.8,
  }),
);
scene.add(particles);

let pointerX = 0;
let pointerY = 0;

window.addEventListener('pointermove', (event) => {
  pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
  pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
});

function resizeScene() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('resize', resizeScene);

function animate() {
  requestAnimationFrame(animate);

  const t = performance.now() * 0.001;

  core.rotation.x = t * 0.7;
  core.rotation.y = t * 0.9;
  ring.rotation.x += 0.005;
  ring.rotation.y += 0.01;

  root.rotation.y += 0.004;
  root.rotation.x = pointerY * 0.5;
  root.position.x = pointerX * 0.8;
  root.position.y = -pointerY * 0.5;

  particles.rotation.y += 0.0008;
  particles.rotation.x = Math.sin(t * 0.4) * 0.5;

  camera.position.x += (pointerX * 1.5 - camera.position.x) * 0.05;
  camera.position.y += (-pointerY * 1.2 - camera.position.y) * 0.05;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

animate();
