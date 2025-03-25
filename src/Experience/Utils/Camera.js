import * as THREE from 'three';
import Experience from '../Experience.js';
import CameraControls from 'camera-controls';

CameraControls.install( { THREE: THREE } );

export default class Camera 
{
    constructor() {
        this.experience = new Experience(); // Retrieve instance of experience instead of creating new (Singleton)
        // Can then retrieve sizes, scene + canvas from experience class
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        // Create instance of camera & camera controls
        this.setInstance(); 
        this.setControls(); 
    }
    
    setInstance() {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100);
        this.instance.position.set(0, 4, 8);
        this.scene.add(this.instance);
    }

    setControls() {
        this.controls = new CameraControls(this.instance, this.canvas);
        this.controls.smoothTime = 0.05; // Smooth movement
        this.controls.draggingSmoothTime = 0.15;
        this.controls.azimuthRotateSpeed = 0.5;
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update(deltaTime) {
        this.controls.update(deltaTime); // Make sure this runs inside Experience.js animation loop
    }
}