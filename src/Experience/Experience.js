import * as THREE from 'three';

import Sizes from './Utils/Sizes.js';
import Time from './Utils/Time.js';
import TPCamera from './Utils/TPCamera.js';
// import Camera from './Utils/Camera.js';
import Renderer from './Utils/Renderer.js';
import World from './World/World.js';
import Resources from './Utils/Resources.js';

import Debug from './Utils/Debug.js';

import sources from './sources.js';

let instance = null; // Singleton - only want one instance of our 'Experience' class

export default class Experience {
    constructor(canvas) 
    {   
        // Singleton logic, return if instance if already exists/not null
        if(instance){
            return instance;
        }
        instance = this;

        // ONLY FOR RUNNING CONSOLE COMMANDS (e.g. window.experience.destroy())       DELETE BEFORE SUBMISSION
        window.experience = this;

        this.canvas = canvas;

        this.debug = new Debug();
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.resources = new Resources(sources);
        
        this.tpcamera = new TPCamera();
        // this.camera = new Camera();
        this.world = new World();
        this.renderer = new Renderer();

        this.sizes.on('resize', () => {
            this.resize();
        })
        this.time.on('tick', () => {
            this.update();
        })
    }

    resize() 
    {
        console.log("a resize occured");
        this.tpcamera.resize();
        this.renderer.resize();
    }

    update() 
    {
        if(this.tpcamera) this.tpcamera.update(this.time.delta);
        this.renderer.update();
        this.world.update(); // Update world for animations (fox)
    }
    
    destroy() 
    {
        // **Would probably be better to make desctructors for each class and call in here
        this.sizes.off('resize'); // off() method extended from EventEmitter class
        this.time.off('tick');

        this.scene.traverse((child) => {
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose();

                for(const key in child.material)
                {
                    const value = child.material[key]

                    if(value && typeof value.dispose == 'function'){
                        value.dispose();
                    }
                }
            }
        });
        // this.tpcamera.controls.dispose();
        this.renderer.instance.dispose();
        if(this.debug.active){
            this.debug.ui.destroy();
        }
    }
}