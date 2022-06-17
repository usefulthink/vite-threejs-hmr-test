import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {HmrTestMaterial} from './hmr-test-material';

function init({
  renderer,
  scene,
  camera
}: {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
}) {
  // helpers
  scene.add(new GridHelper(50, 100, 0x666666, 0x444444));

  // sample geometry
  const box = new Mesh(new BoxGeometry(1, 1, 1), new HmrTestMaterial());

  scene.add(box);

  // ---- HMR
  if (import.meta.hot) {
    import.meta.hot.accept('./hmr-test-material', newModule => {
      console.log('whooop', {newModule});
      box.material = new newModule.HmrTestMaterial();
    });
  }
  // ---- END HMR

  return (t: number) => {
    box.position.y = 1 + Math.sin((2 * Math.PI * t) / 4000) / 2;
    box.rotation.set(
      2 * Math.PI * Math.sin(t / 3000),
      2 * Math.PI * Math.cos(t / 6000),
      0
    );
  };
}

// ---- boilerplate-code

// .... setup renderer
const renderer = new WebGLRenderer({alpha: true, antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);

// .... setup scene
// @ts-ignore
const scene = (window.scene = new Scene());

// .... setup camera and controls
const camera = new PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(-3, 3, 4);
camera.lookAt(new Vector3(0, 0, 0));

// .... setup some lighting
const dirLight = new DirectionalLight();
dirLight.position.set(1, 0.4, 0.2);
scene.add(dirLight, new AmbientLight(0x444444));

// .... setup and run demo-code
const update = init({renderer, scene, camera});
requestAnimationFrame(function loop(time) {
  controls.update();

  if (update) {
    update(time);
  }
  renderer.render(scene, camera);

  requestAnimationFrame(loop);
});

// .... bind events
window.addEventListener('resize', ev => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

document.body.appendChild(renderer.domElement);

export {};
