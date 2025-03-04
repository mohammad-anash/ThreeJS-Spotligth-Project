import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { ssrExportAllKey } from 'vite/module-runner';

const [width, height] = [window.innerWidth, window.innerHeight];
const canvas = document.getElementById('canvas');

const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(
  'https://threejs.org/examples/textures/disturb.jpg'
);

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(75, width / height);
camera.position.z = 3;

gltfLoader.load('3d angel/scene.gltf', (gltf) => {
  gltf.scene.castShadow = true;
  gltf.scene.scale.x = 1.5;
  gltf.scene.scale.y = 1.5;
  gltf.scene.scale.z = 1.5;
  scene.add(gltf.scene);
});

// floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    map: texture,
  })
);
scene.add(floor);

floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = -1.2;

const spotLight = new THREE.SpotLight('0xffffff');
spotLight.castShadow = true;
scene.add(spotLight);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.shadowMap.enabled = true;
renderer.setSize(width, height);

const clock = new THREE.Clock();

// run function every frame per second
function tick() {
  const elapsedTime = clock.getElapsedTime();

  floor.rotation.z = -elapsedTime * 0.2;
  spotLight.rotation.z = -elapsedTime * 0.2;

  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick();