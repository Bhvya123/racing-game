import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createLight } from './lighting';
import { ambLight } from './ambientlight';
import { loadCar } from './car';
import { Grid } from './grid';
import { moveCar, speed, playerAngleMoved } from './controls/keyControls';
import { renderMap, innerTrackRadius, outerTrackRadius } from './environment/roads';
import { Vector3 } from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
// import * as dat from 'dat.gui';

var car;
var Health = 3000;
// Setting up the scene and camera
const aspectRatio = window.innerWidth / window.innerHeight;
const camWidth = 5000;
const camHeight = camWidth / aspectRatio;
const glloader = new GLTFLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300000);

const cam2 = new THREE.OrthographicCamera(
	camWidth / -2,
	camWidth / 2,
	camHeight / 2,
	camHeight / -2,
	0,
	10000
);

cam2.position.set(0, 5000, 0);
cam2.lookAt(0, 0, 0);

/////////////////rendering map

const plane = renderMap(camWidth, camHeight * 2, scene);

///////////////////////////////

// Setting up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
document.body.appendChild(renderer.domElement);

// Setting up OrbitControls to move camera around
// const orbit = new OrbitControls(camera, renderer.domElement)
// orbit.keys = {
// 	LEFT: "ArrowLeft",
// 	UP: "ArrowUp",
// 	RIGHT: "ArrowRight",
// 	DOWN: "ArrowDown"
// }
// orbit.enabled = true;

let controls = new PointerLockControls(camera, document.body);

const blocker = document.getElementById('blocker');
const instructions = document.getElementById('instructions');

instructions.addEventListener('click', function () {

	controls.lock();

});

controls.addEventListener('lock', function () {

	instructions.style.display = 'none';
	blocker.style.display = 'none';

});

controls.addEventListener('unlock', function () {

	blocker.style.display = 'block';
	instructions.style.display = '';

});

scene.add(controls.getObject());

// Making objects to add to our Scene
const light = createLight();
light.position.set(-30, 50, 0);
const ambientLight = ambLight();
const grid = Grid();

let oppCar1;
let oppCar2;
let oppCar3;

scene.add(light);
scene.add(ambientLight);
scene.add(grid);
let insetWidth = window.innerHeight / 3.5;
let insetHeight = window.innerHeight / 3.5;

car = loadCar();
scene.add(car);
car.rotation.x = -0.5 * Math.PI;
// car.rotation.z = 0.5 * Math.PI;
car.position.z = 0;
car.position.x = (innerTrackRadius + outerTrackRadius) / 2;
car.position.y = 10;

oppCar1 = loadCar();
oppCar2 = loadCar();
oppCar3 = loadCar();
scene.add(oppCar1);
scene.add(oppCar2);
scene.add(oppCar3);

oppCar1.rotation.x = -0.5 * Math.PI;
oppCar2.rotation.x = -0.5 * Math.PI;
oppCar3.rotation.x = -0.5 * Math.PI;

oppCar1.position.y = 10;
oppCar2.position.y = 10;
oppCar3.position.y = 10;

scene.add(plane);
scene.background = new THREE.Color(0x87ceeb);
camera.position.z = car.position.z + 100;
camera.position.y = car.position.y + 90;
camera.position.x = car.position.x;
camera.lookAt(new THREE.Vector3(car.position.x, car.position.y, car.position.z));

for (let i = 0; i < 10; i++) {
	glloader.load('./assets/audience/scene.gltf', function (gltf) {
		const audience = gltf.scene;
		audience.scale.set(0.5, 0.5, 0.5);
		audience.rotateY(-0.5 * Math.PI);
		audience.position.set((outerTrackRadius + 200) * (Math.cos(Math.PI * (i / 5))), 10, (outerTrackRadius + 200) * (Math.sin(Math.PI * (i / 5))));
		audience.rotation.y = -Math.PI / 2 + Math.PI * (i / 5);
		scene.add(audience);
	});
}

let lastTimeStamp;
// let playerAngleMoved;
let score = 0;
renderer.setAnimationLoop(animate);
function animate(timestamp) {
	let carb = new THREE.Box3().setFromObject(car);
	let opp1b = new THREE.Box3().setFromObject(oppCar1);
	let opp2b = new THREE.Box3().setFromObject(oppCar2);
	let opp3b = new THREE.Box3().setFromObject(oppCar3);
	console.log(Health, score);
	// if(Health < 0) 
	// {
	// 	return;
	// }
	if (carb.intersectsBox(opp1b) === true) {
		// speed = 0;
		Health = Health - 5;
	}
	if (carb.intersectsBox(opp2b) === true) {
		// speed = 0;
		Health = Health - 5;
	}
	if (carb.intersectsBox(opp3b) === true) {
		// speed = 0;
		Health = Health - 5;
	}

	if(Health <= 0){
		renderer.setAnimationLoop(null);
	}
	
	const laps = Math.floor(Math.abs(playerAngleMoved)/(Math.PI*2));
    if(score != laps) score = laps;

	if (!lastTimeStamp) {
		lastTimeStamp = timestamp
		return;
	}
	let timedelta = timestamp - lastTimeStamp;
	moveCar(car, timedelta);
	lastTimeStamp = timestamp;

	// moving camera before the car
	camera.position.z = car.position.z + 100;
	camera.position.y = car.position.y + 90;
	camera.position.x = car.position.x + 10;
	camera.lookAt(new THREE.Vector3(car.position.x, car.position.y, car.position.z));
	renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
	renderer.setScissorTest(true);
	renderer.setScissor(16, window.innerHeight - insetHeight - 16, insetWidth, insetHeight);
	renderer.setViewport(16, window.innerHeight - insetHeight - 16, insetWidth, insetHeight);
	renderer.render(scene, cam2)
	renderer.setScissorTest(false);
	const scorele = document.getElementById("score")
	scorele.innerText = score
	const healthele = document.getElementById("health");
	healthele.innerText = Health;
};

animate();
window.addEventListener('resize', function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(widow.innerWidth, window.innerHeight);
});

export { oppCar1, oppCar2, oppCar3, score }