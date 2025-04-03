import * as THREE from 'three'
import Experience from '../Experience.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export default class TPCamera {
    constructor(target) {
        // Bring in class instances from Experience.js
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.canvas = this.experience.canvas;
        this.camOffset = new THREE.Vector3(0, 8, 15); // Offset camera behind player
        this.lookAheadOffset = new THREE.Vector3(0, 1.5, -3); // Offset so camera will look slightly ahead of player
        this.lookAtPos = new THREE.Vector3(); // Create empty look at position

        // Basic Perspective Camera
        this.instance = new THREE.PerspectiveCamera(
            45,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        );
        
        this.setControls();
        this.scene.add(this.instance);
    }
    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.rotateSpeed = 0.6;
        this.controls.enablePan = false;
        this.controls.enableZoom = true;
        this.controls.target = new THREE.Vector3(0, 1.5, 0);

        // Fix for when shift key is being held - Orbit Controls ignores left click when shift is pressed
        this.controls.enableRotate = true;
        this.controls.screenSpacePanning = true;
        this.controls.listenToKeyEvents(window);

        // Restrictions on orbitting angles 
        this.controls.minPolarAngle = Math.PI * 0.1; // 30 degree minimum
        this.controls.maxPolarAngle = Math.PI * 0.45; // ~160 degree maximum

        // Limit zoom distance
        this.controls.minDistance = 5;
        this.controls.maxDistance = 25;
    }
    // Function for setting a target model - called once model is loaded
    setTarget(target)
    {
        if(!target) {
            console.error("TPCamera: target is undefined");
            return;
        }
        this.target = target;

        this.instance.position.copy(this.target.position.clone().add(this.camOffset)); // Setting of camera position - copy player position, add offset
        this.controls.target.copy(this.target.position.clone().add(this.lookAheadOffset));
    }
    updateTarget(target) {
        if (!target) {
            console.error("TPCamera: updateTarget received an undefined target.");
            return;
        }
        
        if (this.target) {
            // Keep current camera offset before switching
            const currentOffset = this.instance.position.clone().sub(this.target.position);
            this.camOffset.copy(currentOffset);
        }
    
        this.target = target;
    }
    update()
    {
        if(!this.target) {
            return;
        }

        this.controls.target.copy(this.target.position);

        // Calculate the smoothed look-ahead position
        const targetLookAt = this.target.position.clone().add(this.lookAheadOffset);
        this.lookAtPos.lerp(targetLookAt, 0.1); // Linear Interpolation for smooth transition to new look position

        // Make the camera look at the interpolated look-ahead position
        this.instance.lookAt(this.lookAtPos);

        this.controls.update();
    }
    resize() 
    {
        // Still need to update aspect ratio & projection matrix of Perspective Camera when 'resize' occurs
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }
    getForwardVector() {
        const direction = new THREE.Vector3();
        this.instance.getWorldDirection(direction);
        direction.y = 0; // Ignore vertical movement for character movement
        return direction.normalize();
    }

    getRightVector() {
        const forward = this.getForwardVector();
        return new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    }
}