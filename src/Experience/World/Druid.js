import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Druid {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.debug = this.experience.debug;

        //Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('druid');
        }

        // Retrieve model from resources
        this.resource = this.resources.items.druidModel;
        this.setModel();
        this.setAnimation();
    }
    setModel() {
        this.model = this.resource.scene;
        this.model.scale.set(1.9, 1.9, 1.9);
        this.model.position.set(2, 0, 0);
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

        this.animation.actions.dance = this.animation.mixer.clipAction(this.resource.animations[0]);
        this.animation.actions.forage = this.animation.mixer.clipAction(this.resource.animations[1]);
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[2]);
        this.animation.actions.interact = this.animation.mixer.clipAction(this.resource.animations[3]);
        this.animation.actions.jog = this.animation.mixer.clipAction(this.resource.animations[4]);
        this.animation.actions.land = this.animation.mixer.clipAction(this.resource.animations[5]);
        this.animation.actions.tpose = this.animation.mixer.clipAction(this.resource.animations[6]);
        this.animation.actions.transform = this.animation.mixer.clipAction(this.resource.animations[7]);
        this.animation.actions.walk = this.animation.mixer.clipAction(this.resource.animations[8]);
        
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
                dance: () => { this.animation.play('dance') },
                forage: () => { this.animation.play('forage') },
                idle: () => { this.animation.play('idle') },
                interact: () => { this.animation.play('interact') },
                jog: () => { this.animation.play('jog') },
                land: () => { this.animation.play('land') },
                tpose: () => { this.animation.play('tpose') },
                transform: () => { this.animation.play('transform') },
                walk: () => { this.animation.play('walk') }
            }
            this.debugFolder.add(debugObject, 'walk');
            this.debugFolder.add(debugObject, 'jog');
            this.debugFolder.add(debugObject, 'idle');
            this.debugFolder.add(debugObject, 'interact');
            this.debugFolder.add(debugObject, 'transform');
            this.debugFolder.add(debugObject, 'land');
            this.debugFolder.add(debugObject, 'forage');
            this.debugFolder.add(debugObject, 'dance');
            this.debugFolder.add(debugObject, 'tpose');
        }
    }
    update() {
        this.animation.mixer.update(this.time.delta * 0.001);
    }
}