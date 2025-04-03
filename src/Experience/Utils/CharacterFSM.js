import FiniteStateMachine from "./FiniteStateMachine";

export default class CharacterFSM extends FiniteStateMachine {
    constructor(character) {
        super();

        this.character = character; // Reference player character
    }
}