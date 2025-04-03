import * as THREE from 'three';

export class DruidIdleState {
    constructor(fsm) {
        this.fsm = fsm;
    }

    get Name() {
        return 'idle';
    }

    Enter() {
        this.fsm.character.playAnimation('Idle_anim');
    }

    Update(_, input) {
        if(input.keys['forward'] || input.keys['backward'] || input.keys['left'] || input.keys['right'] ) {
            this.fsm.SetState('walk');
        }
    }

    Exit() {}
}

export class DruidWalkState {
    constructor(fsm) {
        this.fsm = fsm;
    }

    get Name() {
        return 'walk';
    }

    Enter() {
        this.fsm.character.playAnimation('Walk_anim');
    }

    Update(_, input) {
        if(!input.keys['forward'] && !input.keys['backward'] && !input.keys['left'] && !input.keys['right'] ) {
            this.fsm.SetState('idle');
        }
    }

    Exit() {}
}

export class DruidTransformState {
    constructor(fsm) {
        this.fsm = fsm;
    }
    
    get Name() {
        return 'transform';
    }

    Enter() {

        const transformAction = this.fsm.character.animation.actions['Transform_anim'];
        const idleAction = this.fsm.character.animation.actions['Idle_anim'];

        if (!transformAction || !idleAction) {
            console.warn("DruidTransformState: Transform or Idle animation not found!");
            return;
        }

        transformAction.reset();
        transformAction.setLoop(THREE.LoopOnce); // Play only once
        // transformAction.clampWhenFinished = true; // Hold last frame instead of resetting
        transformAction.play();

        // Fade to idle after animation completes
        transformAction.getMixer().addEventListener('finished', (e) => {
            if (e.action === transformAction) {
                this.fsm.SetState('idle'); // Return to idle
            }
            });
        }

        Update() {
            // Ignore movement input during transformation
        }

        Exit() {}
} 