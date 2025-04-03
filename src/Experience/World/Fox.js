// ====================================== DEBUG MODEL ================================================= // 
import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Fox {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.debug = this.experience.debug;

        //Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('fox');
        }

        // Retrieve model from resources
        this.resource = this.resources.items.foxModel;
        this.setModel();
        this.setAnimation();
    }
    setModel() {
        this.model = this.resource.scene;
        this.model.scale.set(0.02, 0.02, 0.02);
        this.model.rotation.set(0, 3.14159, 0);
        this.scene.add(this.model);

        this.model.traverse((child) => {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true;
            }
        })
    }
    setAnimation() {
        this.animation = {};

        this.animation.mixer = new THREE.AnimationMixer(this.model);
        
        this.animation.actions = {};

        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0]);
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1]);
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2]);
        
        this.animation.actions.current = this.animation.actions.idle;
        this.animation.actions.current.play(); 

        this.animation.play = (name) => {
            const newAction = this.animation.actions[name];
            const currentAction = this.animation.actions.current;

            newAction.reset();
            newAction.play();
            newAction.crossFadeFrom(currentAction, 1);

            this.animation.actions.current = newAction;
        }

        // Add animations to Debug UI
        if(this.debug.active)
        {
            const debugObject = {
                playIdle: () => { this.animation.play('idle') },
                playWalking: () => { this.animation.play('walking') },
                playRunning: () => { this.animation.play('running') }
            }
            this.debugFolder.add(debugObject, 'playIdle');
            this.debugFolder.add(debugObject, 'playWalking');
            this.debugFolder.add(debugObject, 'playRunning');
        }
    }
    update() {
        this.animation.mixer.update(this.time.delta * 0.001);
    }
}