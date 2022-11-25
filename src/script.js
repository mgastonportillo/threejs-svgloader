import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './style.css';

// Base
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Textures
// const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load('/textures/door/color.jpg');

// Svg
const loader = new SVGLoader();

// load a SVG resource
loader.load(
	'gale_path_1k.svg',

	function (data) {
		const paths = data.paths;
		const group = new THREE.Group();
		group.scale.multiplyScalar(0.001);
		group.position.x = -0.89;
		group.position.y = 1.45;
		group.scale.y *= -1;

		for (let i = 0; i < paths.length; i++) {
			const path = paths[i];

			const material = new THREE.MeshBasicMaterial({
				color: path.color,
				side: THREE.DoubleSide,
				depthWrite: false,
			});

			const shapes = SVGLoader.createShapes(path);

			for (let j = 0; j < shapes.length; j++) {
				const shape = shapes[j];
				const geometry = new THREE.ShapeGeometry(shape);
				const mesh = new THREE.Mesh(geometry, material);
				group.add(mesh);
			}
		}

		scene.add(group);
	},

	function (xhr) {
		console.log(
			Infinity ? 'SVG Loaded' : `${(xhr.loaded / xhr.total) * 100}% loaded`
		);
	},

	function (error) {
		console.log('An error happened');
	}
);

// // Object
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({
// 	map: texture,
// });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 3.5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
