import CharacterFSM from "../Utils/CharacterFSM";
import { FoxIdleState, FoxRunState, FoxTransformState, FoxWalkState } from "./FoxStates";

export default class FoxFSM extends CharacterFSM {
    constructor(character) {
        super(character);

        this.AddState('idle', FoxIdleState);
        this.AddState('walk', FoxWalkState);
        this.AddState('run', FoxRunState);
        this.AddState('transform', FoxTransformState);
    }
}