import * as THREE from 'three';

function addPlane() {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshBasicMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});

    const plane = new THREE.Mesh(geometry, material);
    return plane;
}

export { addPlane }