import * as THREE from 'three';

function Grid() {
    const gridHelper = new THREE.GridHelper(100);
    return gridHelper;
}

export { Grid }