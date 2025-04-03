import * as THREE from 'three';

// Handle possible states and transitions for character
export default class FiniteStateMachine {
    constructor() {
        this.states = {};
        this.currentState = null;
    }
    AddState(name, type) {
        this.states[name] = type;
    }
    SetState(name) {
        const prevState = this.currentState;

        if(prevState) {
            if(prevState.Name == name) {
                return;
            }
            prevState.Exit();
        }

        const state = new this.states[name](this);

        this.currentState = state;
        state.Enter(prevState);
    }

    update(timeElapsed, input) {
        if (this.currentState) {
            this.currentState.Update(timeElapsed, input);
        }
    }
}