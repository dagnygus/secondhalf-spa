/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { PerspectiveCamera,
         Scene,
         TextureLoader,
         BufferGeometry,
         PointsMaterial,
         Points,
         WebGLRenderer,
         Float32BufferAttribute,
         } from 'three';

let camera: PerspectiveCamera;
let scene: Scene;
let renderer: WebGLRenderer;
let material: PointsMaterial;
let allawAnimationFrame = false;

let container: HTMLElement | null;

export function init(theContainer: HTMLElement): void {
  container = theContainer;

  camera = new PerspectiveCamera(55, container.clientWidth / container.clientHeight, 2, 2000);
  camera.position.z = 250;

  scene = new Scene();
  // scene.background = ;

  const geometry = new BufferGeometry();
  const texture = new TextureLoader().load('/assets/front_end_images/second_half_hearts.w200.png');

  const vertices: number[] = [];

  for ( let i = 0; i < 400; i ++ ) {

    const x = 500 * Math.random() - 250;
    const y = 500 * Math.random() - 250;
    const z = 500 * Math.random() - 250;

    vertices.push( x, y, z );

  }

  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));

  material = new PointsMaterial({
    size: 35,
    sizeAttenuation: true,
    map: texture,
    alphaTest: 0.5,
    transparent: true }
  );

  const particles = new Points(geometry, material);
  scene.add(particles);

  renderer = new WebGLRenderer({ alpha: true });
  renderer.setClearColor(0xffffff, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize);
  allawAnimationFrame = true;
  animate();
}


function onWindowResize(): void {

  if (container) {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
  }
}

function render(): void {

  const timeVariable = (Date.now() % 100000) * 0.00001;

  if (timeVariable > 1) { console.log('WRONG'); }

  camera.position.x = 250 * Math.sin(timeVariable * 2 * Math.PI);
  camera.position.y = 250 * Math.cos(timeVariable * 2 * Math.PI);
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

function animate(): void {
  render();
  if (allawAnimationFrame) {
    requestAnimationFrame(animate);
  }
}

export function dispose(): void {
  allawAnimationFrame = false;
  container = null;
  window.removeEventListener('resize', onWindowResize);
}
