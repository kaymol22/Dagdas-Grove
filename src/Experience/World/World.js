import * as THREE from 'three';
import Experience from '../Experience.js';
import Environment from './Environment.js';
import Floor from './Floor.js';
import Fox from './Fox.js';
import Druid from './Druid.js';
import Track from './Track.js';
import Helpers from '../Utils/Helpers.js';
import Movement from '../Utils/Movement.js';

export default class World {
    constructor() 
    {
        // Access scene, resources, and tpcamera instances through Experience.js
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources; 
        this.tpcamera = this.experience.tpcamera;

        // Listen for 'ready' trigger once loaded in Loader.js
        this.resources.on('ready', () => {
            this.floor = new Floor();
            this.fox = new Fox();
            this.druid = new Druid();
            this.track = new Track();
            this.environment = new Environment();
            this.helpers = new Helpers();

            console.log("Fox model loaded:", this.fox.model); // Debugging

            if (this.fox && this.fox.model) {
                this.tpcamera.setTarget(this.fox.model);
                this.movement = new Movement(this.fox.model);
                console.log("TPCamera & Movement target set!");
            } 
            else {
                console.error("World: Target not found");
            }
        });
    }
    update() 
    {
        if(this.fox)
            this.fox.update();
        if(this.druid)
            this.druid.update();
        if(this.movement)
            this.movement.update();
    }
}