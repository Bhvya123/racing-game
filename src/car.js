import * as THREE from 'three';

var car;

const vehicleColors = [0xa52523, 0xbdb638, 0x7Bb114b, 0x800080]; 

function loadCar() {
    const model = new THREE.Group();
    const colors = pickRandom(vehicleColors);

    const bodygeometry = new THREE.BoxBufferGeometry(60/2, 30/2, 15/2);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: colors });
    const body = new THREE.Mesh(bodygeometry, bodyMaterial);

    body.position.z = 12/2;
    model.add(body);

    const carFrontTexture = getCarFrontTexture();
    carFrontTexture.center = new THREE.Vector2(0.5/2,0.5/2);
    carFrontTexture.rotation = Math.PI / 2;

    const carBackTexture = getCarFrontTexture();
    carBackTexture.center = new THREE.Vector2(0.5/2,0.5/2);
    carBackTexture.rotation = -Math.PI / 2;

    const carRightTexture = getCarSideTexture();
    const carLeftTexture = getCarSideTexture();
    carLeftTexture.flipY = false;

    const cabinGeo = new THREE.BoxBufferGeometry(33/2, 24/2, 12/2);
    const cabinMat = [
        new THREE.MeshLambertMaterial({ map: carFrontTexture }),
        new THREE.MeshLambertMaterial({ map: carBackTexture }),
        new THREE.MeshLambertMaterial({ map: carLeftTexture }),
        new THREE.MeshLambertMaterial({ map: carRightTexture }),
        new THREE.MeshLambertMaterial({ color: 0xffffff }),
        new THREE.MeshLambertMaterial({ color: 0xffffff }),        
    ];
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);

    cabin.position.x = -6/2;
    cabin.position.z = 25.5/2;
    model.add(cabin);

    const backWheel = Wheel();
    backWheel.position.x = -18/2;
    model.add(backWheel);

    const frontWheel = Wheel();
    frontWheel.position.x = 18/2;
    model.add(frontWheel);

    return model;
}

function getCarFrontTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);

    context.fillStyle = "#666666";
    context.fillRect(8, 8, 48, 24);

    return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);

    return new THREE.CanvasTexture(canvas);
}

function Wheel() {
    const wheel = new THREE.Mesh(
        new THREE.BoxBufferGeometry(12/2, 33/2, 12/2),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );
    wheel.position.z = 6/2;
    return wheel;
}

function pickRandom(array) {
    return array[Math.floor(Math.random() + array.length)];
}

export{ loadCar, car }