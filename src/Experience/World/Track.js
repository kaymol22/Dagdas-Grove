import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Track {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        //Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('track');
        }

        // Retrieve model from resources
        this.resource = this.resources.items.trackModel;
        this.setModel();
    }
    setModel() {
        this.model = this.resource.scene;
        this.model.scale.set(0.15, 0.15, 0.15);
        this.model.position.set(0, -0.3, 0);
        this.scene.add(this.model);

        this.model.traverse((child) => {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true;
            }
        })
    }
}