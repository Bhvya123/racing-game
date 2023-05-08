import * as THREE from 'three';
import { oppCar1, oppCar2, oppCar3, score } from '..';
import { trackRadius, innerTrackRadius, outerTrackRadius } from '../environment/roads';

const playerAngleInitial = 0.5 * Math.PI;
var playerAngleMoved=0;
let ang1 = 0;
let ang2 = 0;
let ang3 = 0;
let init1 = 0.5 * Math.PI;
let init2 = 0.4 * Math.PI;
let init3 = 0.2 * Math.PI;

let speed = 0;
let oppspeed=0.0012;
let accelerate = false;
let right=0
let decelerate = false;

function moveCar(car, timeDelta) {
    speed = carSpeed();
    playerAngleMoved -= speed * timeDelta;
    // oppCar1.rotation.x = -init1;
    // oppCar2.rotation.x = -init2;
    // oppCar3.rotation.x = -init3;

    const totalPlayerAngle = playerAngleInitial + playerAngleMoved;
    
    if(trackRadius + right <= innerTrackRadius) right = innerTrackRadius - trackRadius;
    if(trackRadius + right >= outerTrackRadius) right = outerTrackRadius - trackRadius;
    let playerX = Math.cos(totalPlayerAngle) * (trackRadius+right);
    let playerZ = Math.sin(totalPlayerAngle) * (trackRadius+right);

    car.position.x = playerX;
    car.position.z = playerZ;

    car.rotateZ(speed * timeDelta);

    ang1 -= oppspeed * timeDelta;

    const op1 =  init1 + ang1;

    playerX = Math.cos(op1) * (trackRadius);
    playerZ = Math.sin(op1) * (trackRadius);

    oppCar1.position.x = playerX;
    oppCar1.position.z = playerZ;
    
    oppCar1.rotateZ(oppspeed * timeDelta);


    ang2 -= oppspeed * timeDelta;

    const op2 =  init2 + ang2;

    playerX = Math.cos(op2) * (trackRadius);
    playerZ = Math.sin(op2) * (trackRadius);

    oppCar2.position.x = playerX;
    oppCar2.position.z = playerZ;
    
    oppCar2.rotateZ(oppspeed * timeDelta);

    ang3 -= oppspeed * timeDelta;

    const op3 =  init3 + ang3;

    playerX = Math.cos(op3) * (trackRadius);
    playerZ = Math.sin(op3) * (trackRadius);

    oppCar3.position.x = playerX;
    oppCar3.position.z = playerZ;
    
    oppCar3.rotateZ(oppspeed * timeDelta);
  }
  
window.addEventListener("keydown", function (event) {
    if (event.key == "ArrowUp") {
      accelerate = true;
    }
    if (event.key == "ArrowDown") {
      decelerate = true;
    }
    if (event.key == "ArrowRight") {
      right -= 3;
    }
    if (event.key == "ArrowLeft") {
      right += 3;
    }
  });
  window.addEventListener("keyup", function (event) {
    if (event.key == "ArrowUp") {
      accelerate = false;
    }
    if (event.key == "ArrowDown") {
      decelerate = false;
    }
  });

function carSpeed() {
    if (accelerate) return Math.min(0.0025,speed + 0.0001);
    else if (decelerate) return Math.max(-0.0005,speed - 0.0001);
    return speed;
}

export { moveCar, speed, playerAngleMoved }