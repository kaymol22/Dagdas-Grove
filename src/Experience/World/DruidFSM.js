import CharacterFSM from "../Utils/CharacterFSM";
import { DruidIdleState, DruidTransformState, DruidWalkState } from "./DruidStates";

export default class DruidFSM extends CharacterFSM {
    constructor(character) {
        super(character);

        this.AddState('idle', DruidIdleState);
        this.AddState('walk', DruidWalkState);
        this.AddState('transform', DruidTransformState);
    }
}