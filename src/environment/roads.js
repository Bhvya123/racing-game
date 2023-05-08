import * as THREE from 'three';
import { Texture } from 'three';

const trackRadius = 425;
const trackWidth = 100;
const innerTrackRadius = trackRadius - trackWidth;
const outerTrackRadius = trackRadius + trackWidth;

const arcAngle1 = (1 / 3) * Math.PI;

const deltaY = Math.sin(arcAngle1) * innerTrackRadius;
const arcAngle2 = Math.asin(deltaY / outerTrackRadius);

const arcCenterX = 0;
    // (
    //     Math.cos(arcAngle1) * innerTrackRadius +
    //     Math.cos(arcAngle2) * outerTrackRadius
    // ) / 2;

const arcAngle3 = Math.acos(arcCenterX / innerTrackRadius);
const arcAngle4 = Math.acos(arcCenterX / outerTrackRadius);

function getLeftIsland() {
    const islandLeft = new THREE.Shape();

    islandLeft.absarc(
        arcCenterX,
        0,
        innerTrackRadius,
        0,
        2*Math.PI,
        false
    );
    islandLeft.absarc(
        arcCenterX,
        0,
        outerTrackRadius+10,
        0,
        2*Math.PI,
        true
    );

    return islandLeft;
}

// function getMiddleIsland() {
//     const islandMiddle = new THREE.Shape();

//     islandMiddle.absarc(
//         -arcCenterX,
//         0,
//         innerTrackRadius,
//         arcAngle3,
//         -arcAngle3,
//         true
//     );
//     islandMiddle.absarc(
//         arcCenterX,
//         0,
//         innerTrackRadius,
//         Math.PI + arcAngle3,
//         Math.PI - arcAngle3,
//         true
//     );

//     return islandMiddle;
// }

// function getRightIsland() {
//     const islandRight = new THREE.Shape();

//     islandRight.absarc(
//         arcCenterX,
//         0,
//         innerTrackRadius,
//         Math.PI - arcAngle1,
//         Math.PI + arcAngle1,
//         true
//     );
//     islandRight.absarc(
//         -arcCenterX,
//         0,
//         outerTrackRadius,
//         -arcAngle2,
//         arcAngle2,
//         false
//     );

//     return islandRight;
// }

// function getOuterField(mW, mH) {
//     const field = new THREE.Shape();

//     field.moveTo(-mW / 2, -mH / 2);
//     field.lineTo(0, -mH / 2);

//     field.absarc(
//         -arcCenterX,
//         0,
//         outerTrackRadius,
//         -arcAngle4,
//         arcAngle4,
//         true
//     );
//     field.absarc(
//         arcCenterX,
//         0,
//         outerTrackRadius,
//         Math.PI - arcAngle4,
//         Math.PI + arcAngle4,
//         true
//     );

//     field.lineTo(0, -mH / 2);
//     field.lineTo(mW / 2, -mH / 2);
//     field.lineTo(mW / 2, mH / 2);
//     field.lineTo(-mW / 2, mH / 2);

//     return field;
// }

function getMarks(mW, mH) {
    const canvas = document.createElement("canvas");
    canvas.width = mW;
    canvas.height = mH;

    const context = canvas.getContext("2d");

    context.fillStyle = "#546E90";
    context.fillRect(0, 0, mW, mH);

    context.lineWidth = 2;
    context.strokeStyle = "#E0ffff";
    context.setLineDash([10, 14]);

    context.beginPath();
    context.arc(
        arcCenterX,
        0,
        (innerTrackRadius+outerTrackRadius)/2,
        0,
        Math.PI * 2
    );
    return new THREE.CanvasTexture(canvas);
}

function renderMap(mW, mH, scene) {

    const lineTexture = getMarks(mW, mH);

    const geo = new THREE.PlaneGeometry(mW, mH);
    const mat = new THREE.MeshLambertMaterial({
        map: lineTexture,
    });
    const plane = new THREE.Mesh(geo, mat);
    // scene.add(plane);
    plane.rotation.x = -0.5 * Math.PI;

    const islandLeft = getLeftIsland();
    // const islandRight = getRightIsland();
    // const islandMiddle = getMiddleIsland();
    // const outerField = getOuterField(mW, mH);

    const fieldGeometry = new THREE.ExtrudeGeometry(
        [islandLeft],
        { depth: 6, bevelEnabled: false }
    );
    const fieldMesh = new THREE.Mesh(fieldGeometry, [
        new THREE.MeshLambertMaterial({ color: 0x67c240 }),
        new THREE.MeshLambertMaterial({ color: 0x23311c }),
    ]);
    scene.add(fieldMesh);
    fieldMesh.rotation.x = -0.5*Math.PI;

    // const sideTexture = new THREE.TextureLoader().load('./assets/audience.jpg');
    const cylGeo = new THREE.CylinderGeometry(innerTrackRadius,innerTrackRadius,100,32,1,false,0,2*Math.PI);
    const cylMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF});
    const cylinder = new THREE.Mesh(cylGeo, cylMat);
    cylinder.position.set(arcCenterX,50,0);

    scene.add(cylinder);
}

// export { renderMap };

// function renderMap() {
//     const geometry = new THREE.PlaneGeometry(30,100);
//     const material = new THREE.MeshBasicMaterial({ color: 0x333333 });
//     const plane = new THREE.Mesh(geometry, material);

//     return plane;
// }

export{ renderMap, trackRadius, trackWidth, innerTrackRadius, outerTrackRadius, arcCenterX };