import * as THREE from 'three';

function createLight() {
  const color = 0xFFFFFF;
  const intensity = 0.6;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(100, 300, 400);
  return light;
}

export {createLight};