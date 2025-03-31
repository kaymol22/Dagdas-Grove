import * as THREE from 'three';
import Experience from '../Experience.js';
import Input from './Input.js';

export default class Movement {
    constructor(target) {

        this.experience = new Experience();
        this.time = this.experience.time; // Need 'time' from Experience.js
        this.input = new Input();

        this.target = target; // Player model target

        this.maxSpeed = 3.0;
        this.acceleration = 10.0;
        this.deceleration = 7.0;
        this.rotationSpeed = 6.0;

        // Movement Vectors
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();

        this.input.on('move', (direction, isPressed) => {
            this.handleMovement(direction, isPressed);
        });
    }

    handleMovement(direction, isPressed) {
        if (direction === 'forward') this.direction.z = isPressed ? 1 : 0;
        if (direction === 'backward') this.direction.z = isPressed ? -1 : 0;
        if (direction === 'left') this.direction.x = isPressed ? 1 : 0;
        if (direction === 'right') this.direction.x = isPressed ? -1 : 0;
    
        this.direction.normalize(); // Prevent diagonal speed boost
    }

    update() {
        const deltaTime = this.time.delta * 0.001; // Convert ms to seconds

        // Exponential damping for smooth acceleration & deceleration
        const targetVelocity = this.direction.clone().multiplyScalar(this.maxSpeed);
        this.velocity.lerp(targetVelocity, 1 - Math.exp(-this.acceleration * deltaTime));

        // Apply movement
        this.target.position.add(this.velocity.clone().multiplyScalar(deltaTime));

        // Smoothly rotate towards movement direction
        if (this.velocity.lengthSq() > 0.01) { // Avoid jitter at low speeds
            const lookDirection = this.velocity.clone().setY(0).normalize();
            const targetRotation = new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 0, 1),
                lookDirection
            );

            this.target.quaternion.slerp(targetRotation, 1 - Math.exp(-this.rotationSpeed * deltaTime));
        }
    }
}