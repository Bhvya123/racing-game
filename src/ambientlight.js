import * as THREE from 'three';

function ambLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);    
    return ambientLight;
}

export { ambLight }