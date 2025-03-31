import * as THREE from 'three'
import Experience from '../Experience.js';

export default class TPCamera {
    constructor(target) {
        // Bring in class instances from Experience.js
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.canvas = this.experience.canvas;
        this.camOffset = new THREE.Vector3(0, 3, -9); // Offset camera behind player
        this.lookAheadOffset = new THREE.Vector3(0, 1.5, 3); // Offset so camera will look slightly ahead of player

        // Basic Perspective Camera
        this.instance = new THREE.PerspectiveCamera(
            45,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        );
        
        this.scene.add(this.instance);
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
    }
    update(deltaTime)
    {
        if(!this.target) {
            return;
        }
        // Make sure TPCamera is updating it's position as the player does
        const targetPos = this.target.position.clone().add(this.camOffset);
        const lookAtPos = this.target.position.clone().add(this.lookAheadOffset);

        this.instance.position.lerp(targetPos, 0.1); // Adding lerp for smoothness
        this.instance.lookAt(lookAtPos); // Dont want to be looking directly at player, but AHEAD of the player 
    }
    resize() 
    {
        // Still need to update aspect ratio & projection matrix of Perspective Camera when 'resize' occurs
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }
}