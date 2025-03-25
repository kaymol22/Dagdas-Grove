import * as THREE from 'three';
import Experience from '../Experience.js';
import Environment from './Environment.js';
import Floor from './Floor.js';
import Fox from './Fox.js';

export default class World {
    constructor() 
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources; // Access resources class through Experience.js
        
        // Test Mesh
        // const testMesh = new THREE.Mesh(
        //     new THREE.BoxGeometry(1, 1, 1),
        //     new THREE.MeshStandardMaterial()
        // );
        // this.scene.add(testMesh);

        // Listen for 'ready' trigger once loaded in Loader.js
        this.resources.on('ready', () => {
            this.floor = new Floor();
            this.fox = new Fox();
            this.environment = new Environment();
        });
    }
    update() 
    {
        if(this.fox)
            this.fox.update();
    }
}