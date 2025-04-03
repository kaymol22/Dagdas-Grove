import * as THREE from 'three';

import Experience from '../Experience.js';
import Movement from './Movement.js';
import DruidFSM from '../World/DruidFSM.js';
import FoxFSM from '../World/FoxFSM.js';

export default class CharacterController {
    constructor() {

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.scene = this.experience.scene;

        this.currentForm = 'druid';

        this.setModels();
        this.setAnimations();

        this.druidFSM = new DruidFSM(this);
        this.foxFSM = new FoxFSM(this);
        this.fsm = this.druidFSM; // Set druidFSM as starting state machine
        this.fsm.SetState('idle');

        this.canShapeShift = true;
        this.shapeShiftCooldown = 2.0; // 2 second cooldown to prevent rapid switch
        this.lastShapeShiftTime = 0;

        // Movement 
        this.movement = new Movement(this.activeModel);
        // Use input instantiated in movement class to avoid duplicate instances/ eventListeners
        this.input = this.movement.input;
    }

    setModels() {
        this.druidModel = this.resources.items.druidModel.scene;
        this.druidModel.scale.set(1.9, 1.9, 1.9);
        this.foxModel = this.resources.items.foxModel.scene;
        this.foxModel.scale.set(0.02, 0.02, 0.02);
        this.foxModel.rotation.set(0, 3.14159, 0);
        this.druidModel.rotation.set(0, Math.PI, 0);

        this.druidModel.traverse((child) => {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true;
            }
        });
        this.foxModel.traverse((child) => {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true;
            }
        });

        this.activeModel = this.druidModel;
        this.scene.add(this.activeModel);
    }
    // Setup animation mixer and references to animations for FSM to use
    setAnimations() {
        // Check if mixer already exists - setAnimations called everytime form is switched
        if(!this.animation) {
            this.animation = {};
            this.animation.mixer = new THREE.AnimationMixer(this.activeModel);
            this.animation.actions = {};
        }
        else {
            this.animation.mixer.stopAllAction(); // Stop all animations - prevent overlap of anims
            this.animation.mixer._root = this.activeModel // Update the target for the mixer since it already exists
            this.animation.actions = {}; // Clear actions so correct ones can be added
        }

        // Dynamic loading of animations based on currentForm variable
        const animations = this.currentForm == 'druid' 
        ? this.resources.items.druidModel.animations : this.resources.items.foxModel.animations;
        
        console.log("Loaded Animations:", animations.map((a, i) => `Index ${i}: ${a.name}`)); // Debug

        // Loop through animations and store references animation.actions to access through playAnimation method
        animations.forEach((clip) => {
            this.animation.actions[clip.name] = this.animation.mixer.clipAction(clip);
        });

        // Initial animation to assign to currentAction 
        if (this.animation.actions['Idle_anim']) {
            this.animation.actions.current = this.animation.actions['Idle_anim'];
            this.animation.actions.current.play();
        }
    }

    update() {
        if (!this.activeModel) {
            return;
        }

        // Check if shapeshifting is triggered, apply cooldown if true 
        if(this.input.keys.shapeshift) {
            const currentTime = this.time.elapsed * 0.001;
            if (this.canShapeShift && (currentTime - this.lastShapeShiftTime > this.shapeShiftCooldown)) {
                this.switchForm();
                this.lastShapeShiftTime = currentTime;
                this.canShapeShift = false;
                setTimeout(() => { this.canShapeShift = true; }, this.shapeShiftCooldown * 1000);
            }
        }

        if(this.currentForm == 'druid') {
            this.movement.direction.z *= -1;
            this.movement.direction.x *= -1;
        }

        this.movement.update(this.activeModel);

        this.fsm.update(this.time.delta * 0.001, this.input);

        if(this.animation.mixer){
            this.animation.mixer.update(this.time.delta * 0.001);
        }

    }

    switchForm() {
        this.fsm.SetState('transform'); // Set transform state in DruidFSM to trigger animation

        // Store position and rotation of currentForm model
        const { position, quaternion } = this.activeModel;

        // Call function for shader effect 
        this.applyShapeShiftEffect();

        setTimeout(() => {
            this.scene.remove(this.activeModel);

            if(this.currentForm == 'druid') {
                this.currentForm = 'fox';
                this.activeModel = this.foxModel;
                this.fsm = this.foxFSM;
            }
            else {
                this.currentForm = 'druid';
                this.activeModel = this.druidModel;
                this.fsm = this.druidFSM;
            }

            this.activeModel.position.copy(position); // Copy position
            this.activeModel.quaternion.copy(quaternion); // Copy rotation 

            this.scene.add(this.activeModel);

            this.setAnimations(); // Load animations for current form 
            this.fsm.SetState('idle'); // Set default FSM state to idle 

            console.log("Switched to:", this.currentForm);
        }, 1000);
    }

    playAnimation(name) {
        if (!this.animation || !this.animation.actions[name]) {
            console.warn(`Animation "${name}" not found for ${this.currentForm}`);
            return;
        }
        
        const newAction = this.animation.actions[name];
        const currentAction = this.animation.actions.current;

        // Check if not the same action - crossfade
        if (currentAction) {
            newAction.reset(); // Make sure new action starts from beginning
            newAction.play();
            newAction.crossFadeFrom(currentAction, 0.5); // Crossfade from current to new action
        }
        else {
            newAction.play(); // Just play new action if no current
        }
        this.animation.actions.current = newAction; // Assign new action as the current 
    }

    applyShapeShiftEffect() {
        console.log("Shapeshifting shader effect");
    }
}