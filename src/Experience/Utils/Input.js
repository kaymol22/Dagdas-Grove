import EventEmitter from "./EventEmitter";

export default class Input extends EventEmitter{
    constructor() {
        super()

        this.keys = {
            forward: false, 
            backward: false, 
            left: false, 
            right: false, 
        };

        this.initKeyboardListeners();
    }
    
    initKeyboardListeners() {
        window.addEventListener('keydown', (event) => this.onKeyChange(event, true));
        window.addEventListener('keyup', (event) => this.onKeyChange(event, false));
    }

    onKeyChange(event, isPressed) {
        switch (event.code) {
            case 'KeyW':
                this.keys.forward = isPressed;
                this.trigger('move', ['forward', isPressed]);
                break;
            case 'KeyS':
                this.keys.backward = isPressed;
                this.trigger('move', ['backward', isPressed]);
                break;
            case 'KeyA':
                this.keys.left = isPressed;
                this.trigger('move', ['left', isPressed]);
                break;
            case 'KeyD':
                this.keys.right = isPressed;
                this.trigger('move', ['right', isPressed]);
                break;
        }
    }
}