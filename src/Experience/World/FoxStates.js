import * as THREE from 'three';

export class FoxIdleState {
    constructor(fsm) {
        this.fsm = fsm;
    }

    get Name() {
        return 'idle';
    }

    Enter() {
        this.fsm.character.playAnimation('Survey');
    }

    Update(_, input) {
        if(input.keys['forward'] || input.keys['backward'] || input.keys['left'] || input.keys['right'] ) {
            this.fsm.SetState('walk');
        }
        else if((input.keys['forward'] && input.keys['shift']) || (input.keys['backward'] && input.keys['shift']) || (input.keys['left'] && input.keys['shift']) || (input.keys['right'] && input.keys['shift']) ) {
            this.fsm.SetState('run');
        }
    }

    Exit() {}
}

export class FoxWalkState {
    constructor(fsm) {
        this.fsm = fsm;
    }

    get Name() {
        return 'walk';
    }

    Enter() {
        const walkAction = this.fsm.character.animation.actions['Walk'];
        const runAction = this.fsm.character.animation.actions['Run'];

        if (!walkAction) {
            console.warn("FoxWalkState: Walk animation not found!");
            return;
        }

        if (this.fsm.character.animation.actions.current == walkAction) {
            return; // Prevent restarting animation if already playing
        }

        // Smooth transition from run to walk
        if (runAction && runAction.isRunning()) {
            runAction.crossFadeTo(walkAction, 0.3, false);
        }

        walkAction.reset();
        walkAction.play();
        this.fsm.character.animation.actions.current = walkAction;
    }

    Update(_, input) {
        const noMovement = !input.keys['forward'] && !input.keys['backward'] && !input.keys['left'] && !input.keys['right'];

        if(noMovement) {
            this.fsm.SetState('idle'); // Switch to idle if no movement input detected
        }
        else if (input.keys['shift']) { // Holding shift key transitions to run state
            this.fsm.SetState('run');
        }
    }

    Exit() {
        console.log('FoxStates: Exiting Walk');
    }
}
export class FoxRunState {
    constructor(fsm) {
        this.fsm = fsm;
    }

    get Name() {
        return 'run';
    }

    Enter() {

        const runAction = this.fsm.character.animation.actions['Run'];
        const walkAction = this.fsm.character.animation.actions['Walk'];

        if (!runAction) {
            console.warn("FoxRunState: Run animation not found!");
            return;
        }

        // Prevent animation from restarting 
        if (this.fsm.character.animation.actions.current == runAction) {
            return;
        }

        // Crossfade walk and run anims
        if (walkAction && walkAction.isRunning()) {
            walkAction.crossFadeTo(runAction, 0.3, false);
        }

        runAction.reset();
        runAction.timeScale = 1.0; // Set normal animation speed
        runAction.play();
        this.fsm.character.animation.actions.current = runAction;
    }

    Update(_, input) {
        const noMovement = !input.keys['forward'] && !input.keys['backward'] && !input.keys['left'] && !input.keys['right'];

        if(noMovement) {
            this.fsm.SetState('idle'); // Switch to idle if no movement input detected
        }
        else if (!input.keys['shift']) { 
            this.fsm.SetState('walk'); // Switch to walk state if shift released
        }
    }

    Exit() {
        console.log('FoxStates: Exiting Run');
    }
}
export class FoxTransformState {
    constructor(fsm) {
        this.fsm = fsm;
    }
    
    get Name() {
        return 'transform';
    }

    async Enter() {
        this.fsm.SetState('idle');
    }
    Update() {
        // No need for movement input - transform logic handled in Character class
    }

    Exit() {
        console.log('FoxStates: Exiting Transform');
    }
}