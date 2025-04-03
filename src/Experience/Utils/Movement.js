import * as THREE from 'three';
import Experience from '../Experience.js';
import Input from './Input.js';

export default class Movement {
    constructor(target) {

        this.experience = new Experience();
        this.time = this.experience.time; // Need 'time' from Experience.js
        this.input = new Input(); 

        this.target = target; // Player model target
        this.camera = this.experience.tpcamera;

        this.maxSpeed = 3.0;
        this.runningMultiplier = 2.5;
        this.acceleration = 10.0;
        this.deceleration = 7.0;
        this.rotationSpeed = 6.0;

        // Movement Vectors
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.forward = new THREE.Vector3();
        this.right = new THREE.Vector3();

    }

    update(activeModel) {
        // Need to update the target as activeModel will be switched 
        this.target = activeModel;
        this.currentForm = this.experience.world.character.currentForm;

        const deltaTime = this.time.delta * 0.001; // Convert ms to seconds

        // Get camera's forward & right vectors
        this.forward.copy(this.camera.getForwardVector()).setY(0).normalize();
        this.right.copy(this.camera.getRightVector()).setY(0).normalize();

        // reset direction
        this.direction.set(0, 0, 0);
        
        if (this.input.keys.forward) { this.direction.add(this.forward); }
        if (this.input.keys.backward) { this.direction.sub(this.forward); }
        if (this.input.keys.left) { this.direction.sub(this.right); }
        if (this.input.keys.right) { this.direction.add(this.right); }

        this.direction.normalize(); // Normalize to prevent faster diagonal movement

        // Boolean for checking if the player is in fox form 
        const isFox = this.currentForm !== "druid";
        // Boolean for running - only if shift key returns true and model name is 'Fox'
        const isRunning = this.input.keys.shift && isFox;
        
        // Apply multiplier if true, assign maxSpeed to newSpeed if false
        const newSpeed = isRunning ? this.maxSpeed * this.runningMultiplier : this.maxSpeed;

        // Damping & Linear Interpolation for smoother acceleration & deceleration
        const targetVelocity = this.direction.clone().multiplyScalar(newSpeed);
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