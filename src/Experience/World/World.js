import * as THREE from 'three';
import Experience from '../Experience.js';
import Environment from './Environment.js';
import Floor from './Floor.js';
// import Fox from './Fox.js';
// import Druid from './Druid.js';
import CharacterController from '../Utils/CharacterController.js';
import Helpers from '../Utils/Helpers.js';


export default class World {
    constructor() 
    {
        // Access scene, resources, and tpcamera instances through Experience.js
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources; 
        this.tpcamera = this.experience.tpcamera;

        // Listen for 'ready' trigger once loaded in Resources.js
        this.resources.on('ready', () => {
            this.floor = new Floor();
            // this.fox = new Fox(); - Debug Models for testing anims
            // this.druid = new Druid(); - Debug Models for testing anims
            this.character = new CharacterController();
            this.environment = new Environment();
            // this.helpers = new Helpers(); // Grid and Shadow Camera Helper


            if (this.character.activeModel) {
                this.tpcamera.setTarget(this.character.activeModel);
                console.log("Camera target set");
            } 
            else {
                console.error("World: Target not found");
            }

            setInterval(() => {
                if(this.character.activeModel !== this.tpcamera.target) {
                    this.tpcamera.updateTarget(this.character.activeModel);
                    console.log("Camera target updated:", this.character.activeModel);
                }
            }, 100);
        });
    }
    update() 
    {
        // if(this.fox)
        //     this.fox.update();
        // if(this.druid)
        //     this.druid.update();
        
        if(this.character) {
            this.character.update();
        }
    }
}